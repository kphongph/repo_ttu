function draw_graph(graph,rank) {
  var str = 'digraph G {\n';
  str+= '  node [shape=circle,width=.25,height=.25,fixedsize=true,fontsize=10];\n';
  str+= '  edge [arrowhead="vee",arrowsize=.5];\n';
  for(var i=0;i<graph.length;i++) {
   for(var j=0;j<graph[i].length;j++) {
    if(graph[i][j]>0 || graph[j][i]) {
      str+= '  s'+i+' [label=\"'+rank[i]+'\"];\n';
      // str+= '  s'+i+' [label=\"'+i+'\"];\n';
      break;
    }
   }
  }

  for(var i=0;i<graph.length;i++) {
   for(var j=0;j<graph[i].length;j++) {
    if(graph[i][j]>0) {
      if(graph[i][j]==0.1) {
       // str+='  s'+i+' -> s'+j+' [color=\"red\"];\n';
       str+='  s'+i+' -> s'+j+' [style=dashed];\n';
      }
      if(graph[i][j]==0.3) {
       // str+='  s'+i+' -> s'+j+' [color=\"yellow\"];\n';
       str+='  s'+i+' -> s'+j+' [penwidth=1];\n';
      }
      if(graph[i][j]==0.7) {
       // str+='  s'+i+' -> s'+j+' [color=\"green\"];\n';
       str+='  s'+i+' -> s'+j+' [penwidth=3];\n';
      }
      if(graph[i][j]==1.0) {
       // str+='  s'+i+' -> s'+j+' [color=\"black\"];\n';
       str+='  s'+i+' -> s'+j+' [penwidth=1];\n';
      }
    }
   }
  }
  str+='}\n';
  return str;
};

exports.draw_graph = draw_graph;
