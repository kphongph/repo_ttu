var csv = require('fast-csv');
var fs = require('fs');
var _ = require('underscore');
var util = require('./util.js');

var log4js = require('log4js');
log4js.configure('log4js.json',{});
var logger = log4js.getLogger();

logger.setLevel('info');

function compute_score(cutpoint1,cutpoint2,raw_table,taxonomy,cons,attr,from,to) {
  logger.debug('+compute_score '+from+' -> '+JSON.stringify(to));
  logger.debug(cons);
  var score = 0;
  var c1_table = util.modify_table(raw_table,taxonomy,cutpoint1);
  var i_org = compute_I(c1_table,{'type':attr,'value':from});
  score=i_org.value;
  logger.debug('I('+from+') ='+ i_org.value);
  var c2_table = util.modify_table(raw_table,taxonomy,cutpoint2);
  for(var i=0;i<to.length;i++) {
    var tmp = compute_I(c2_table,{'type':attr,'value':to[i]});
    score-=(tmp.rows/i_org.rows)*tmp.value;
    logger.debug('I('+to[i]+') ='+ tmp.value);
  }
  logger.debug('InfoGain('+from+') ='+score);
  var avg_loss = 0;
  var violate = false;
  for(var c=0;c<cons.length;c++) {
    var min_anony = compute_anony(c2_table,cons[c]);
    if(cons[c].freq > min_anony) violate = true; 
    avg_loss += compute_anony(c1_table,cons[c]) - min_anony;
  }
  avg_loss = avg_loss/cons.length;
  logger.debug('AnonyLoss('+from+') ='+avg_loss);
  if(avg_loss != 0 ) {
    score = score/avg_loss;
  }
  logger.debug('Score('+from+') ='+score);
  logger.debug('-compute_score');
  if(violate) {
    return -1;
  }
  return score;
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
  var max = 1;
  var it = 0;
  var next_cutpoint = {};
  while(max!=-1) {
  it++;
  var n_table = util.modify_table(raw_table,taxonomy,cutpoint);
  // generate specification choice
  max = -1;
  next_cutpoint = {};
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
      logger.debug('n_choice ='+JSON.stringify(tmp_choice));
      if(tmp_choice.length > 0) {
        n_choice[key] = _.without(cutpoint[key],cutpoint[key][i]);
        n_choice[key] = _.union(n_choice[key],tmp_choice);
        logger.debug('+Specify ['+cutpoint[key][i]+']');
        logger.debug(cutpoint);
        logger.debug(n_choice);
        var score = compute_score(cutpoint,n_choice,raw_table,
           taxonomy,cons,key,cutpoint[key][i],tmp_choice);

        if(max < score) {
          max = score;
          next_cutpoint = n_choice;
          cutpoint = next_cutpoint;
        }
        logger.debug('-Specify');
      }
    }
  }

  logger.info('Max Score ='+max);
  logger.info(next_cutpoint);
  }
  
  logger.info('===Solution==');
  var n_table = util.modify_table(raw_table,taxonomy,cutpoint);
  logger.info('Compute row ='+util.compute_row(n_table));
  var sol_dict = {};
  for(var key in cutpoint) {
    sol_dict[key] = [];
    for(var k=0;k<cutpoint[key].length;k++) {
      for(var i=0;i<taxonomy.length;i++) {
        if(taxonomy[i].tree == key && taxonomy[i].parent == cutpoint[key][k]) {
          if(sol_dict[key].indexOf(taxonomy[i].parent)==-1) {
            sol_dict[key].push(taxonomy[i].parent);
          }
        }
      }
    }
  }
  logger.info(sol_dict);
}

function algorithm_1(tab_csv,tax_csv,int_cols,cons) {
  console.time("execution");
  var list_nodes = [];
  var cutpoint_list = [];
  util.init(tab_csv,tax_csv,int_cols,function(raw_table,taxonomy) {
    var cutpoint = {};
    for(var key in raw_table[0]) {
      if(key=='Class') continue;
      cutpoint[key] = ['ANY'];
    }
    generate_node(cutpoint,taxonomy,raw_table,cons);
    console.timeEnd("execution");
  });
}

algorithm_1('adult.csv','adult.tax',['A','Cg','Cl','En','Fw','H'],
  [
    {'cols':['E','S'],'freq':50}, 
 //   {'cols':['Sex','Work'],'freq':11}, 
  ]
);

