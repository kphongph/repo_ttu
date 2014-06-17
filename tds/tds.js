var csv = require('fast-csv');
var fs = require('fs');
var _ = require('underscore');

function readCSV(path,callback) {
  var content = [];
  csv.fromPath(path,{headers:true})
  .on('record',function(data) {
    content.push(data);
  })
  .on('end',function() {
    callback(content);
  });
}

function convert_int(table,taxonomy,col_name) {
  var c_list = [];
  var p_list = [];
  for(var j=0;j<taxonomy.length;j++) {
    if(taxonomy[j].tree == col_name) {
      c_list.push(taxonomy[j].child);
      p_list.push(taxonomy[j].parent);
    }
  }
  
  var child_list={};
  var regex = /\[([0-9]+)-([0-9]+)\)/i;
  for(var i=0;i<c_list.length;i++) {
    if(p_list.indexOf(c_list[i])==-1) {
      child_list[c_list[i]] = {};
      var result=c_list[i].match(regex);
      child_list[c_list[i]] = {'min':result[1],'max':result[2]};
    }
  }
  
  for(var i=0;i<table.length;i++) {
    var int_value = parseInt(table[i][col_name]);
    for(var key in child_list) {
      if(int_value >= child_list[key].min && int_value < child_list[key].max) {
        table[i][col_name]=key;
      }
    }
  }
 // console.log(table);
}

function compute_row(table) {
  var dict={};
  var row=0;
  for(var i=0;i<table.length;i++) {
    var row_key ='';
    for(var key in table[i]) {
      if(key!="Class") {
        row_key+='('+table[i][key]+')';
      }
    }
    if(!dict[row_key]) {
      row++;
      dict[row_key]=0;
    }
    dict[row_key]++;
  }
 // console.log(dict);
  return row;
}

function check_constraint(table,list,freq) {
  var dict={}; 
  for(var i=0;i<table.length;i++) {
    var key ='';
    var value_dict = {};
    for(var j=0;j<list.length;j++) {
      key+='('+table[i][list[j]]+')';
      value_dict[list[j]]=table[i][list[j]];
    }
    if(!dict[key]) {
      dict[key]={'freq':0,'value':value_dict};
    }
    dict[key].freq++;
  }
  var pass=true;
  var choice = [];
  for(var key in dict) {
    if(dict[key].freq<freq) {
      choice.push(dict[key]);
    }
  }
  return choice;
}

function modify_table(table,taxonomy,cutpoint) {
  var n_table = JSON.parse(JSON.stringify(table));
  for(var key in cutpoint) {
    var map = {};
    var tree = cutpoint[key];
    for(var i=0;i<n_table.length;i++) {
      if(!map[n_table[i][key]]) {
        var end_search=false;
        var found = false;
        var cur_key = n_table[i][key];
        while(!end_search && !found) {
          if(cutpoint[key].indexOf(cur_key)==-1) {
            end_search = true;
            for(var j=0;j<taxonomy.length;j++) {
              if(taxonomy[j].tree == key && taxonomy[j].child == cur_key) {
                cur_key=taxonomy[j].parent;
                end_search = false;
              }
            }
          } else {
            found=true;
          }
        }
        if(found) {
          map[n_table[i][key]]=cur_key;
        } else {
          map[n_table[i][key]]=n_table[i][key];
        }
      }
      n_table[i][key]=map[n_table[i][key]];
    }
  }
  return n_table;
}

function init(tab_csv,tax_csv,int_cols,cb) {
  readCSV(tab_csv,function(raw_table) {
    readCSV(tax_csv,function(taxonomy) {
      for(var i=0;i<int_cols.length;i++) {
        convert_int(raw_table,taxonomy,int_cols[i]);
      }
      cb(raw_table,taxonomy);
    });
  });
}

function isDuplicate(list,cutpoint) {
  for(var i=0;i<list.length;i++) {
    if(_.isEqual(list[i].cutpoint,cutpoint)) {
      return true;
    }
  }
  return false;
}

function generate_node(node_list,cp_list,taxonomy,raw_table,cons) {
  var max_rows = 0;
  var sol = null;
  while(node_list.length>0) {
    var c_node = node_list.shift();

    var n_table = modify_table(raw_table,taxonomy,c_node.cutpoint);
    c_node['rows'] = compute_row(n_table);
    c_node['choice']= [];

    for(var i=0;i<cons.length;i++) {
      var choices = check_constraint(n_table,cons[i].cols,cons[i].freq);
      for(var j=0;j<choices.length;j++) {
        c_node['choice'].push(choices[j]);
      }
    }

    console.log(JSON.stringify(c_node.cutpoint)+' ('+c_node.rows+','+c_node.choice.length+')');
    if(c_node.choice.length==0) {
      if(c_node.rows > max_rows) {
        sol = c_node;
        max_rows = c_node.rows;
      }
    }
    
    if(max_rows >= c_node.rows) {
      console.log('BREAK');
      continue;
    }
    
    for(var i=0;i<c_node.choice.length;i++) {
      var choice = c_node.choice[i];
      for(var key in choice.value) {
        for(var j=0;j<taxonomy.length;j++) {
          if(taxonomy[j].tree == key) {
            if(taxonomy[j].child == choice.value[key]) {
              var new_cut = JSON.parse(JSON.stringify(c_node.cutpoint));
              if(!new_cut[key]) {
                new_cut[key] = [];
              }
              new_cut[key].push(taxonomy[j].parent);
              new_cut[key].sort();
              if(!isDuplicate(cp_list,new_cut)) {
                if(!isDuplicate(node_list,new_cut)) {
                  node_list.push({'cutpoint':new_cut});
                  console.log('->'+JSON.stringify(new_cut)+'<-');
                }
              }
            }
          }
        }
      }
    }

    cp_list.push(c_node);
  }
  console.log('==Solution==');
  console.log(sol);
}

function algorithm_1(tab_csv,tax_csv,int_cols,cons) {
  var list_nodes = [];
  var cutpoint_list = [];
  init(tab_csv,tax_csv,int_cols,function(raw_table,taxonomy) {
    list_nodes.push({'cutpoint':{}});
    generate_node(list_nodes,cutpoint_list,taxonomy,raw_table,cons);
  });
}

algorithm_1('sample.csv','taxonomy.csv',['Work'],
  [
    {'cols':['Education','Sex'],'freq':4}, 
    {'cols':['Sex','Work'],'freq':11}, 
  ]
);

