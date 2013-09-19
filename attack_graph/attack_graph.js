var link_exists = 0.5;
var link_factor = 0.5;

var is_attack_graph = function (graph) {
  var visited = [];
  var waiting = [0];
  if(graph.length == 0) return false;
  while (waiting.length > 0) {
    var new_waiting = [];
    for (var i = 0; i < waiting.length; i++) {
      if (visited.indexOf(waiting[i]) == -1) {
        for (var j = 0; j < graph[waiting[i]].length; j++) {
          var e_idx = graph[waiting[i]][j];
          if (e_idx > 0 && visited.indexOf(j) == -1) {
            if (new_waiting.indexOf(j) == -1 && waiting.indexOf(j) == -1) {
              new_waiting.push(j);
            }
          }
        }
        visited.push(waiting[i]);
      }
    }
    waiting = new_waiting;
  }
  if(visited.length != graph.length) {
    return false;
  } else {
    return true;
  }
}

var gen_graph = function (total_node) {
  var count_link = 0;
  var min_link = total_node*link_factor*total_node;
  var node_list = [];
  for (var i = 0; i < total_node; i++) {
    var out_link = [];
    out_link.push(0);
    for (var j = 1; j < total_node; j++) {
      if (Math.random() < link_exists) {
        out_link.push(0);
      } else {
        out_link.push(Math.random());
        count_link++;
      }
    }
    node_list.push(out_link);
  }
    
  while(count_link!=min_link) {
    var s_node = Math.round(Math.random()*total_node);
    var s_link = Math.round(Math.random()*total_node);
    if(s_node == total_node) continue;
    if(count_link < min_link) {
      if(node_list[s_node][s_link] == 0) {
        node_list[s_node][s_link] = Math.random();
        if(node_list[s_node][s_link] > 0) {
          count_link++;
        }
      }
    } else {
      if(node_list[s_node][s_link] > 0) {
        node_list[s_node][s_link] = 0;
        count_link--;
      }
    }
  }
  return node_list;
};

var generate_ag = function(node_size) {
  var graph = [];
  while(!is_attack_graph(graph)) {
    graph = gen_graph(node_size);
  }
  var link_count = 0;
  for(var i=0;i<graph.length;i++) {
    for(var j=0;j<graph[i].length;j++) {
      if(graph[i][j] > 0) {
        link_count++;
      }
    }
  }
  return {'node':node_size,'link':link_count,'graph':graph};
};


function add_link(graph,src,dst_list) {
  for(var i=0;i<dst_list.length;i++) {
   // graph[src][dst_list[i]] = Math.floor(Math.random() * 90 + 10)/100;
   graph[src][dst_list[i]] = 1;

   /*
     var r=Math.random();
     if(r < 0.3) {
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

/*
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

exports.generate_ag = generate_ag;
