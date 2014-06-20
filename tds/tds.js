var csv = require('fast-csv');
var fs = require('fs');
var _ = require('underscore');

var util = require('./util');

var log4js = require('log4js');
log4js.configure('log4js.json',{});
var logger = log4js.getLogger();


logger.setLevel('INFO');

function isDuplicate(list,cutpoint) {
  for(var i=0;i<list.length;i++) {
    if(_.isEqual(list[i].cutpoint,cutpoint)) {
      return true;
    }
  }
  return false;
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
      // logger.debug('Violate '+key+' ('+dict[key].freq+')');
    }
  }
  return choice;
}

function generate_node(node_list,cp_list,taxonomy,raw_table,cons) {
  var max_rows = 0;
  var sol = null;
  while(node_list.length>0) {
    var c_node = node_list.shift();

    var n_table = util.modify_table(raw_table,taxonomy,c_node.cutpoint);
    c_node['rows'] = util.compute_row(n_table);
    c_node['choice']= [];

    for(var i=0;i<cons.length;i++) {
      var choices = check_constraint(n_table,cons[i].cols,cons[i].freq);
      for(var j=0;j<choices.length;j++) {
        c_node['choice'].push(choices[j]);
      }
    }

    logger.debug(c_node.choice);
    if(c_node.choice.length==0) {
      logger.info(JSON.stringify(c_node.cutpoint)+' ('+c_node.rows+','+c_node.choice.length+')');
    }

    if(c_node.choice.length==0) {
      if(c_node.rows > max_rows) {
        sol = c_node;
        max_rows = c_node.rows;
      }
    }
    
    if(max_rows >= c_node.rows) {
      logger.debug('BREAK');
      continue;
    }
    
    for(var i=0;i<c_node.choice.length;i++) {
      var choice = c_node.choice[i];
      // logger.debug('choice ('+i+') '+JSON.stringify(choice));
      for(var key in choice.value) {
        for(var j=0;j<taxonomy.length;j++) {
          // logger.debug('taxonomy '+j+' '+JSON.stringify(taxonomy[j]));
          if(taxonomy[j].tree == key) {
            if(taxonomy[j].child == choice.value[key]) {
              var new_cut = JSON.parse(JSON.stringify(c_node.cutpoint));
              // logger.debug('new_cut ('+j+') '+JSON.stringify(new_cut));
              if(!new_cut[key]) {
                new_cut[key] = [];
              }
              if(new_cut[key].indexOf(taxonomy[j].parent)==-1) {
                new_cut[key].push(taxonomy[j].parent);
              }
              new_cut[key].sort();
              if(!isDuplicate(cp_list,new_cut)) {
                if(!isDuplicate(node_list,new_cut)) {
                  node_list.push({'cutpoint':new_cut});
                  logger.debug('->'+JSON.stringify(new_cut)+'<-');
                }
              }
            }
          }
        }
      }
    }

    cp_list.push(c_node);
  }
  logger.info('==Solution==');
  logger.info(sol);
  console.timeEnd("execution");
}

function algorithm_1(tab_csv,tax_csv,int_cols,cons) {
  console.time("execution");
  var list_nodes = [];
  var cutpoint_list = [];
  util.init(tab_csv,tax_csv,int_cols,function(raw_table,taxonomy) {
    list_nodes.push({'cutpoint':{}});
    generate_node(list_nodes,cutpoint_list,taxonomy,raw_table,cons);
  });
}

algorithm_1('adult.csv','adult.tax',['A','Cg','Cl','En','Fw','H'],
  [
    {'cols':['E','S'],'freq':50}, 
  ]
);

