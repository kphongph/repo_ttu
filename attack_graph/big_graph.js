function add_link(graph,src,dst_list) {
  for(var i=0;i<dst_list.length;i++) {
    graph[src][dst_list[i]] = 1;
    /*
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
    */
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

  return graph;
}


exports.create_graph = create_graph;
