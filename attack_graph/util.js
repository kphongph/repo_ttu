function draw_graph(graph,rank) {
  var str = 'digraph G {\n';
  str+= '  node [shape=circle,width=.25,height=.25,fixedsize=true,fontsize=10];\n';
  str+= '  edge [arrowhead="vee",arrowsize=.5];\n';
  for(var i=0;i<graph.length;i++) {
   for(var j=0;j<graph[i].length;j++) {
    var order = -1;
    if(graph[i][j]>0 || graph[j][i]) {
      for(var k=0;k<rank.length;k++) {
       if(rank[k]==i) {
        order = k;
       }
      }
      str+= '  s'+i+' [label=\"'+order+'\"];\n';
      break;
    }
   }
  }

  for(var i=0;i<graph.length;i++) {
   for(var j=0;j<graph[i].length;j++) {
    if(graph[i][j]>0) {
      if(graph[i][j]==0.1) {
       str+='  s'+i+' -> s'+j+' [color=\"red\"];\n';
      }
      if(graph[i][j]==0.3) {
       str+='  s'+i+' -> s'+j+' [color=\"yellow\"];\n';
      }
      if(graph[i][j]==0.7) {
       str+='  s'+i+' -> s'+j+' [color=\"green\"];\n';
      }
      if(graph[i][j]==1.0) {
       str+='  s'+i+' -> s'+j+' [color=\"black\"];\n';
      }
    }
   }
  }
  str+='}\n';
  return str;
};

var rank_value = page_rank(graph);
//console.log(rank_value);
var rank_order = [];
var idx = -1;
for(var i=0;i<rank_value.length;i++) {
  var idx = -1;
  var max = 0;
  for(var j=0;j<rank_value.length;j++) {
   if(rank_value[j]>max) {
    max=rank_value[j];
    idx=j;
   }
  }
  rank_order.push(idx);
  rank_value[idx]=0;
}

console.log(draw_graph(graph,rank_order));
*/

/*
graph = [
   [0, 4.3, 7.5, 4.3, 0, 0, 0],
   [0, 0, 7.5, 0, 0, 0, 0],
   [0, 0, 0, 0, 4.3, 0, 0],
   [0, 0, 0, 0, 0, 7.5, 0],
   [0, 0, 0, 0, 0, 7.5, 0],
   [0, 0, 0, 0, 0, 0, 5.0],
   [0, 0, 0, 0, 0, 0, 0]
];
console.log(page_rank(graph));
*/

var iteration = 10;
var time_p = 0.0;
var time_e = 0.0;

var total_node_start = parseInt(process.argv[2])||10;
var total_node_size = parseInt(process.argv[3])||3;
var total_node_list = [];
for(var i=0;i<total_node_size;i++) {
  total_node_list.push(total_node_start);
  total_node_start+=2;
}

//console.log(total_node);
for(var j=0;j<total_node_list.length;j++) {
  var total_node = total_node_list[j];
  for (var i = 0; i < iteration; i++) {
   var graph = [];
   while(!is_attack_graph(graph)) {
    graph = gen_graph(total_node);
   }
  
   var s_time = (new Date()).getTime();
   page_rank(graph);
   var e_time = (new Date()).getTime();
   time_p+= (e_time - s_time);   
   // s_time = (new Date()).getTime();
   // exploit_rank(graph);
   // e_time = (new Date()).getTime();
   // time_e+= (e_time - s_time);
  }
  var graph_size = total_node + total_node*total_node/2;
  console.log(graph_size+'\t'+time_p/iteration);
}
// console.log("Exploit-based "+time_e/iteration);
