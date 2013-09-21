var ag_graph = require('./attack_graph');
var ranking = require('./ranking');
var big_graph = require('./big_graph');

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
     new_graph[i][i] = sum;
  }
  return new_graph;
}

var node_size = parseInt(process.argv[2])||2;
var data_size = parseInt(process.argv[3])||10;
var iteration = 10;

for(var j=0;j<data_size;j++) {
  var sum_time = 0;
  for(var i=0;i<iteration;i++) {
    var graph = ag_graph.generate_ag(node_size);
    var n_graph = modify_graph(graph.graph);
    var s_time = (new Date()).getTime();
    ranking.page_rank(n_graph);
    var e_time = (new Date()).getTime();
    sum_time += e_time-s_time;
  }
  console.log(node_size+'\t'+(node_size*node_size/2)+'\t'+(sum_time/iteration));
  node_size+=2;
}



// ranking.page_rank(graph.graph);
// var graph = big_graph.create_graph();
// ranking.page_rank(graph);
