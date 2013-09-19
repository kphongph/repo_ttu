var ag_graph = require('./attack_graph');
var ranking = require('./ranking');
var big_graph = require('./big_graph');

// var graph = ag_graph.generate_ag(4);
// ranking.page_rank(graph.graph);
var graph = big_graph.create_graph();
ranking.page_rank(graph);
