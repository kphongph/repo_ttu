var ag_graph = require('./attack_graph');
var ranking = require('./ranking');
var big_graph = require('./big_graph');
var util = require('./util');

var modify_graph = function(graph) {
  var new_graph = [];
  for(var i=0;i<graph.length;i++) {
     new_graph.push([]);
     for(var j=0;j<graph[i].length;j++) {
        new_graph[i].push(graph[i][j]);
     }
  }

  for(var i=0;i<graph.length;i++) {
     var sum = 0.0;
     for(var j=0;j<graph[i].length;j++) {
        if(graph[i][j]>0) {
          sum+=(1-graph[i][j]);
        }
     }
     if(sum==0) {
       new_graph[i][0] = 1;  // no outgoing link
     } else {
       new_graph[i][0] = sum;
     }
  }
  return new_graph;
}

var compute_r_time = function(node_sizie, data_size) {
  var iteration = 10;

  for(var j=0;j<data_size;j++) {
    var sum_time=[0,0];
    for(var i=0;i<iteration;i++) {
      var graph = ag_graph.generate_ag(node_size);
      var n_graph = modify_graph(graph.graph);
      var s_time = process.hrtime();
      ranking.page_rank(n_graph);
      var e_time = process.hrtime(s_time);
      sum_time[0]+=e_time[0];
      sum_time[1]+=e_time[1];
    }
    var time = sum_time[0]*1000 + sum_time[1]/100000;
    console.log(node_size+'\t'+(node_size*node_size/2)+'\t'+time.toFixed(3));
    node_size+=2;
  }
}

var compute_convert = function(node_size) {
  var graph = ag_graph.generate_ag(node_size);
  var n_graph = modify_graph(graph.graph);
  ranking.page_rank(n_graph);
}



var node_size = parseInt(process.argv[2])||2;
// var data_size = parseInt(process.argv[3])||10;
// compute_r_time(node_size,data_size);
// compute_convert(node_size);


var graph = big_graph.create_graph();
var n_graph = modify_graph(graph);
var rank_value =  ranking.page_rank(n_graph);
var sum_r = 0.0;
for(var i=0;i<rank_value.length;i++) {
   sum_r+=rank_value[i];
}
// console.log(sum_r);
var r_order = ranking.rank_order(rank_value);
// console.log(r_order);
console.log(util.draw_graph(graph,r_order));

