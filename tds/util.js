var csv = require('fast-csv');
var fs = require('fs');
var _ = require('underscore');

var log4js = require('log4js');
log4js.configure('log4js.json',{});
var logger = log4js.getLogger('util');

logger.setLevel('DEBUG');

var limit = 1000;

function readCSV(path,callback) {
  var content = [];
  csv.fromPath(path,{headers:true})
  .on('record',function(data) {
    var pushable = true;
    for(var key in data) {
      data[key] = data[key].replace(/ /gi,'');
      if(data[key].length == 0) {
        pushable = false;
      }
    }
    if(pushable && content.length<limit) {
      content.push(data);
    }
  })
  .on('end',function() {
    logger.info('Total records = '+ content.length);
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

module.exports.init = init
module.exports.modify_table = modify_table
module.exports.compute_row = compute_row
