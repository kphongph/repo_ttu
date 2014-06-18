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

function compute_score(cutpoint1,cutpoint2,raw_table,taxonomy,cons,attr,from,to) {
  console.log('+compute_score '+from+' -> '+JSON.stringify(to));
  console.log(cons);
  var score = 0;
  var c1_table = modify_table(raw_table,taxonomy,cutpoint1);
  var i_org = compute_I(c1_table,{'type':attr,'value':from});
  score=i_org.value;
  console.log('I('+from+') ='+ i_org.value);
  var c2_table = modify_table(raw_table,taxonomy,cutpoint2);
  for(var i=0;i<to.length;i++) {
    var tmp = compute_I(c2_table,{'type':attr,'value':to[i]});
    score-=(tmp.rows/i_org.rows)*tmp.value;
    console.log('I('+to[i]+') ='+ tmp.value);
  }
  console.log('InfoGain('+from+') ='+score);
  var avg_loss = 0;
  for(var c=0;c<cons.length;c++) {
    avg_loss += compute_anony(c1_table,cons[c]) - compute_anony(c2_table,cons[c]);
  }
  avg_loss = avg_loss/cons.length;
  console.log('AnonyLoss('+from+') ='+avg_loss);
  if(avg_loss != 0 ) {
    score = score/avg_loss;
  }
  console.log('Score('+from+') ='+score);
  console.log('-compute_score');
}

function compute_anony(table,con) {
  var min = table.length;
  var key_dict = {};
  for(var j=0;j<table.length;j++) {
    var key='';
    for(var k=0;k<con.cols.length;k++) { 
      key+='('+table[j][con.cols[k]]+')';
    }
    if(!key_dict[key]) {
      key_dict[key]=0;
    }
    key_dict[key]++;
  }
  for(var key in key_dict) {
    if(min > key_dict[key]) { 
      min = key_dict[key];
    }
  }
  return min;
}

function compute_I(table,attr,value) {
  var count = {};
  var sum = 0;
  var result = 0;
  for(var i=0;i<table.length;i++) {
    if(table[i][attr.type]==attr.value) {
      sum++;
      if(!count[table[i]['Class']]) {
        count[table[i]['Class']] = 0;
      }
      count[table[i]['Class']]++;
    }
  }
  for(var key in count) {
    result-=(count[key]/sum)*(Math.log(count[key]/sum)/Math.log(2));
  }
  // console.log(JSON.stringify(attr)+' '+result);
  return {'value':result,'rows':sum};
}

function generate_node(cutpoint,taxonomy,raw_table,cons) {
  // console.log(cutpoint);
 //  cutpoint['Education'] = ['Secondary','University'];
  var n_table = modify_table(raw_table,taxonomy,cutpoint);
  // generate specification choice
  for(var key in cutpoint) {
    for(var i=0;i<cutpoint[key].length;i++) {
      var tmp_choice = [];
      for(var j=0;j<taxonomy.length;j++) {
        if(taxonomy[j].tree == key && taxonomy[j].parent == cutpoint[key][i]) {
          if(tmp_choice.indexOf(taxonomy[j].child)) {
            tmp_choice.push(taxonomy[j].child);
          }
        }
      }
      var n_choice = _.clone(cutpoint);
      n_choice[key] = _.without(cutpoint[key],cutpoint[key][i]);
      n_choice[key] = _.union(n_choice[key],tmp_choice);
      console.log('+Specify ['+cutpoint[key][i]+']');
      console.log(cutpoint);
      console.log(n_choice);
      compute_score(cutpoint,n_choice,raw_table,taxonomy,cons,key,cutpoint[key][i],tmp_choice);
      console.log('-Specify');
    }
  }

  /*
  var choice = {};
  for(var i=0;i<n_table.length;i++) {
    for(var col_name in n_table[0]) {
      if(col_name == 'Class') continue;
      if(!choice[col_name]) {
        choice[col_name] = {};
      }
      if(!choice[col_name][n_table[i][col_name]]) {
        choice[col_name][n_table[i][col_name]] = [];
        for(var j=0;j<taxonomy.length;j++) {
          if(taxonomy[j].tree == col_name && taxonomy[j].parent == n_table[i][col_name]) {
            if(choice[col_name][n_table[i][col_name]].indexOf(taxonomy[j].child)) {
              choice[col_name][n_table[i][col_name]].push(taxonomy[j].child);
            }
          }
        }
      }
    }
  }
  */

  /*
  for(var key in choice) {
    console.log(key);
    console.log(choice[key]);
    console.log(c_node.cutpoint);
    for(var c_key in c_node.cutpoint) {
      if(c_key == key) {
      }
    }

    for(var p_node in choice[key]) {
      compute_I(n_table,{'type':key,'value':p_node});
      for(var i=0;i<choice[key][p_node].length;i++) {
        compute_I(n_table,{'type':key,'value':choice[key][p_node][i]});
      }
    }
  }
  */

  //var n_table = modify_table(raw_table,taxonomy,c_node.cutpoint);
  //compute_I(n_table,{type:col_name,value:'ANY'});
}

function algorithm_1(tab_csv,tax_csv,int_cols,cons) {
  var list_nodes = [];
  var cutpoint_list = [];
  init(tab_csv,tax_csv,int_cols,function(raw_table,taxonomy) {
    var cutpoint = {};
    for(var key in raw_table[0]) {
      if(key=='Class') continue;
      cutpoint[key] = ['ANY'];
    }
    generate_node(cutpoint,taxonomy,raw_table,cons);
  });
}

algorithm_1('sample.csv','taxonomy.csv',['Work'],
  [
    {'cols':['Education','Sex'],'freq':4}, 
 //   {'cols':['Sex','Work'],'freq':11}, 
  ]
);

