function add_link(graph,src,dst_list) {
  for(var i=0;i<dst_list.length;i++) {
    // graph[src][dst_list[i]] = 1;
    var r=Math.random();
    if(r<0.3) {
      graph[src][dst_list[i]] = 0.1;
    } else {
      if(r < 0.7) {
        graph[src][dst_list[i]] = 0.3;
      } else {
        graph[src][dst_list[i]] = 0.7;
      }
    } 
  }
}

function m_link(graph,src,dst,weight) {
  graph[src][dst] = weight;
}

var create_graph = function() {
  var graph = [];
  var node_size = 65;
  for(var i=0;i<node_size;i++) {
    var tmp = []; 
    for(var j=0;j<node_size;j++) {
      tmp.push(0);
    }
    graph.push(tmp);
  }

  add_link(graph,0,[1,2,3]);
  add_link(graph,1,[4,5,8]);
  add_link(graph,2,[6,7,10]);
  add_link(graph,3,[9,11,12]);
  add_link(graph,4,[13,14,15,16,18]);
  add_link(graph,5,[17,20,22]);
  add_link(graph,6,[17,20,22]);
  add_link(graph,7,[21]);
  add_link(graph,8,[19,23,24,26]);
  add_link(graph,9,[19,23,24,26]);
  add_link(graph,10,[25]);
  add_link(graph,11,[25]);
  add_link(graph,12,[25]);
  add_link(graph,13,[27,28,31]);
  add_link(graph,14,[27,28,31]);
  add_link(graph,15,[29,30,34,35,36]);
  add_link(graph,16,[29,30,34,35,36]);
  add_link(graph,17,[29,30,34,35,36]);
  add_link(graph,18,[32,33,37,38,39]);
  add_link(graph,19,[32,33,37,38,39]);
  add_link(graph,20,[40,41]);
  add_link(graph,21,[40,41]);
  add_link(graph,22,[41,44]);
  add_link(graph,23,[41,44]);
  add_link(graph,24,[41,44]);
  add_link(graph,25,[41,44]);
  add_link(graph,26,[42,43,45,46,47]);
  add_link(graph,27,[48,49,50]);
  add_link(graph,28,[48,49,50]);
  add_link(graph,29,[48,49,50]);
  add_link(graph,30,[48,49,50]);
  add_link(graph,31,[51,52,53]);
  add_link(graph,32,[51,52,53]);
  add_link(graph,33,[51,52,53]);
  add_link(graph,34,[54,55]);
  add_link(graph,35,[54,55]);
  add_link(graph,36,[54,55]);
  add_link(graph,37,[54,55]);
  add_link(graph,38,[54,55]);
  add_link(graph,39,[54,55]);
  add_link(graph,40,[54,55]);
  add_link(graph,41,[54,55]);
  add_link(graph,42,[56,57,58]);
  add_link(graph,43,[56,57,58]);
  add_link(graph,44,[59,60]);
  add_link(graph,45,[59,60]);
  add_link(graph,46,[59,60]);
  add_link(graph,47,[59,60]);

  add_link(graph,54,[61]);
  add_link(graph,55,[62]);
  add_link(graph,59,[63]);
  add_link(graph,60,[64]);

  /*
  add_link(graph,48,[48]);
  add_link(graph,49,[49]);
  add_link(graph,50,[50]);
  add_link(graph,51,[51]);
  add_link(graph,52,[52]);
  add_link(graph,53,[53]);
  add_link(graph,56,[56]);
  add_link(graph,57,[57]);
  add_link(graph,58,[58]);
  add_link(graph,61,[61]);
  add_link(graph,62,[62]);
  add_link(graph,63,[63]);
  add_link(graph,64,[64]);
  */

  /*
  m_link(graph,48,48,1.0);
  m_link(graph,49,49,1.0);
  m_link(graph,50,50,1.0);
  m_link(graph,51,51,1.0);
  m_link(graph,52,52,1.0);
  m_link(graph,53,53,1.0);
  m_link(graph,56,56,1.0);
  m_link(graph,57,57,1.0);
  m_link(graph,58,58,1.0);
  m_link(graph,61,61,1.0);
  m_link(graph,62,62,1.0);
  m_link(graph,63,63,1.0);
  m_link(graph,64,64,1.0);
  */

  // for weigth
  /*
  m_link(graph,44,59,1.0);
  m_link(graph,44,60,1.0);
  m_link(graph,45,59,1.0);
  m_link(graph,45,60,1.0);
  m_link(graph,46,59,1.0);
  m_link(graph,46,60,1.0);
  m_link(graph,47,59,1.0);
  m_link(graph,47,60,1.0);
  */

  return graph;
}

var demo_graph = function(graph) {
  m_link(graph,0,1,0.3);
  m_link(graph,0,2,0.7);
  m_link(graph,0,3,0.3);

  m_link(graph,1,4,0.1);
  m_link(graph,1,5,0.7);
  m_link(graph,1,8,0.3);

  m_link(graph,2,6,0.7);
  m_link(graph,2,7,0.3);
  m_link(graph,2,10,0.7);

  m_link(graph,3,9,0.3);
  m_link(graph,3,11,0.1);
  m_link(graph,3,12,0.7);

  m_link(graph,4,13,0.3);
  m_link(graph,4,14,0.1);
  m_link(graph,4,15,0.1);
  m_link(graph,4,16,0.1);
  m_link(graph,4,18,0.1);

  m_link(graph,5,17,0.3);
  m_link(graph,5,20,0.3);
  m_link(graph,5,22,0.3);

  m_link(graph,6,17,0.3);
  m_link(graph,6,20,0.3);
  m_link(graph,6,22,0.3);

  m_link(graph,7,21,0.3);

  m_link(graph,8,19,0.3);
  m_link(graph,8,23,0.3);
  m_link(graph,8,24,0.7);
  m_link(graph,8,26,0.3);

  m_link(graph,9,19,0.7);
  m_link(graph,9,23,0.3);
  m_link(graph,9,24,0.7);
  m_link(graph,9,26,0.7);

  m_link(graph,10,25,0.1);
  m_link(graph,11,25,0.3);
  m_link(graph,12,25,0.7);
 
  m_link(graph,13,27,0.7);
  m_link(graph,13,28,0.3);
  m_link(graph,13,31,0.7);

  m_link(graph,14,27,0.3);
  m_link(graph,14,28,0.1);
  m_link(graph,14,31,0.1);

  m_link(graph,15,29,0.3);
  m_link(graph,15,30,0.1);
  m_link(graph,15,34,0.3);
  m_link(graph,15,35,0.3);
  m_link(graph,15,36,0.1);

  m_link(graph,16,29,0.1);
  m_link(graph,16,30,0.1);
  m_link(graph,16,34,0.3);
  m_link(graph,16,35,0.1);
  m_link(graph,16,36,0.7);

  m_link(graph,17,29,0.1);
  m_link(graph,17,30,0.7);
  m_link(graph,17,34,0.1);
  m_link(graph,17,35,0.3);
  m_link(graph,17,36,0.1);

  m_link(graph,18,32,0.3);
  m_link(graph,18,33,0.3);
  m_link(graph,18,37,0.1);
  m_link(graph,18,38,0.7);
  m_link(graph,18,39,0.1);

  m_link(graph,19,33,0.7);
  m_link(graph,19,32,0.3);
  m_link(graph,19,38,0.3);
  m_link(graph,19,37,0.1);
  m_link(graph,19,39,0.3);

  m_link(graph,20,40,0.7);
  m_link(graph,20,41,0.1);

  m_link(graph,21,40,0.7);
  m_link(graph,21,41,0.7);

  m_link(graph,22,41,0.7);
  m_link(graph,22,44,0.7);

  m_link(graph,23,41,0.7);
  m_link(graph,23,44,0.3);

  m_link(graph,24,41,0.1);
  m_link(graph,24,44,0.7);

  m_link(graph,25,41,0.1);
  m_link(graph,25,44,0.3);

  m_link(graph,26,47,0.1);
  m_link(graph,26,45,0.1);
  m_link(graph,26,46,0.3);
  m_link(graph,26,42,0.7);
  m_link(graph,26,43,0.3);

  m_link(graph,27,48,0.3);
  m_link(graph,27,49,0.3);
  m_link(graph,27,50,0.7);

  m_link(graph,28,48,0.1);
  m_link(graph,28,49,0.7);
  m_link(graph,28,50,0.7);

  m_link(graph,29,48,0.3);
  m_link(graph,29,49,0.3);
  m_link(graph,29,50,0.7);

  m_link(graph,30,50,0.3);
  m_link(graph,30,48,0.7);
  m_link(graph,30,49,0.1);

  m_link(graph,31,52,0.7);
  m_link(graph,31,53,0.7);
  m_link(graph,31,51,0.3);

  m_link(graph,32,51,0.3);
  m_link(graph,32,52,0.3);
  m_link(graph,32,53,0.1);

  m_link(graph,33,52,0.7);
  m_link(graph,33,53,0.1);
  m_link(graph,33,51,0.7);

  m_link(graph,34,54,0.3);
  m_link(graph,34,55,0.3);

  m_link(graph,35,54,0.3);
  m_link(graph,35,55,0.7);

  m_link(graph,36,54,0.7);
  m_link(graph,36,55,0.1);

  m_link(graph,37,54,0.7);
  m_link(graph,37,55,0.1);

  m_link(graph,38,54,0.3);
  m_link(graph,38,55,0.1);

  m_link(graph,39,54,0.7);
  m_link(graph,39,55,0.3);

  m_link(graph,40,54,0.1);
  m_link(graph,40,55,0.3);

  m_link(graph,41,54,0.3);
  m_link(graph,41,55,0.1);

  m_link(graph,42,58,0.3);
  m_link(graph,42,56,0.1);
  m_link(graph,42,57,0.1);

  m_link(graph,43,58,0.3);
  m_link(graph,43,56,0.7);
  m_link(graph,43,57,0.3);

  m_link(graph,44,59,0.3);
  m_link(graph,44,60,0.3);

  m_link(graph,45,59,0.3);
  m_link(graph,45,60,0.3);

  m_link(graph,46,59,0.3);
  m_link(graph,46,60,0.3);

  m_link(graph,47,59,0.3);
  m_link(graph,47,60,0.3);

  m_link(graph,54,61,0.1);
  m_link(graph,55,62,0.7);
  m_link(graph,59,63,0.7);
  m_link(graph,60,64,0.3);
  return graph;
}


exports.create_graph = create_graph;
exports.demo_graph = demo_graph;
