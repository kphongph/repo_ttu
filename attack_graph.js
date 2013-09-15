var link_exists = 0.5;
var page_rank_d = 0.85;
var page_rank_diff = 0.00001;
var link_factor = 0.5;

var make_attack_graph = function (graph) {
    var visited = [];
    var waiting = [0];
    while (waiting.length > 0) {
        var new_waiting = [];
        for (var i = 0; i < waiting.length; i++) {
            if (visited.indexOf(waiting[i]) == -1) {
                for (var j = 0; j < graph[waiting[i]].length; j++) {
                    if (graph[waiting[i]][j] > 0 && visited.indexOf(j) == -1) {
                        if (new_waiting.indexOf(j) == -1 && waiting.indexOf(j) == -1) {
                            new_waiting.push(j);
                        }
                    }
                }
                visited.push(waiting[i]);
            }
        }
        waiting = new_waiting;
        /*
        if(visited.length == graph.length) {
          console.log("Visited - " + visited.length);
        }
        */
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
                out_link.push(Math.random() * 10);
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
           node_list[s_node][s_link] = Math.random() * 10;
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
    // console.log('#edge '+count_link);
    return node_list;
};

var page_rank = function (graph) {
    var rank_value = [];
    var graph_sum = [];
    var graph_d = [];
    for (var i = 0; i < graph.length; i++) {
        rank_value.push(1.0/graph.length);
        var tmp = 0.0;
        // var divider = 0.0;
        for (var j = 0; j < graph[i].length; j++) {
            tmp += graph[i][j];
        //    if(graph[i][j]>0) {
        //       divider+=1;
        //    }
        }
        graph_sum.push(tmp);
        // console.log(' d('+i+') = '+(tmp/graph.length));
        //if(divider==0) {
        //   graph_d.push(0);
        // } else {
        //   graph_d.push(1.0*tmp/divider);
        //}
        graph_d.push(page_rank_d);
    }
    var diff = 1.0;
    while (diff > page_rank_diff) {
        var new_rank_value = [];
        for (var i = 0; i < rank_value.length; i++) {
            new_rank_value.push(0.0);
        }
        for (var i = 1; i < rank_value.length; i++) {
            for (var j = 0; j < graph.length; j++) {
                if (graph_sum[j] != 0 && graph[j][i]!=0) {
                 //   tmp += page_rank_d * graph[j][i] * rank_value[j] / graph_sum[j];
                   new_rank_value[i] += 1.0*graph_d[j] * graph[j][i] * rank_value[j] / graph_sum[j];
                 //  console.log('new_rank_'+i+'=1.0*'+graph_d[j]+'*'+graph[j][i]+'*'+rank_value[j]+'/'+graph_sum[j]);
                }
            }
            if (graph_sum[i] == 0) {
                new_rank_value[i] += 1.0*graph_d[i]*rank_value[i]; // self-loop
            //    console.log('new_rank_'+i+'=1.0*'+graph_d[i]+'*'+rank_value[i]);
            }
            new_rank_value[0] += 1.0*(1-graph_d[i])*rank_value[i];
        }
        new_rank_value[0] += (1-graph_d[0])*rank_value[0];
        diff = 0.0;
        // var sum_rank = 0.0;
        for (var i = 0; i < rank_value.length; i++) {
        //    console.log("Rank value "+i+" :"+new_rank_value[i]);
            diff += Math.abs(rank_value[i] - new_rank_value[i]);
            rank_value[i] = new_rank_value[i];
        //    sum_rank+=rank_value[i];
        }
    }
    return rank_value;
};

var exploit_rank = function (graph) {
    var nodes = [];
    for (var i = 0; i < graph.length; i++) {
        nodes.push({
            "v": 100,
                "l": 0,
                "p": [],
                "u": false
        });
    }
    nodes[0]["u"] = true;
    var updated = true;
    var step = 0;
    while (updated) {
        //console.log("step " + step);
        step = step + 1;
        updated = false;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i]["u"]) {
                //console.log("explore " + i + " " + nodes[i]["u"]);
                for (var j = 0; j < graph[i].length; j++) {
                    if (graph[i][j] > 0) {
                        var min_v = nodes[i]["v"];
                        if (min_v > graph[i][j]) {
                            min_v = graph[i][j];
                        }

                        if (nodes[j]["v"] == 100 || (min_v >= nodes[j]["v"] && nodes[j]["l"] > (nodes[i]["l"] + 1))) {
                            nodes[j]["v"] = min_v;
                            nodes[j]["l"] = nodes[i]["l"] + 1;
                            nodes[j]["u"] = true;
                            updated = true;
                            //console.log("update " + j + " (" + nodes[j]["v"] + ", " + nodes[j]["l"] + ")");
                        }

                    }
                }
                nodes[i]["u"] = false;
            }
        }
    }
};


// Generate graph 64 nodes
function draw_graph(graph,rank) {
  var str = 'digraph G {\n';
  str+= '   node [shape=circle,width=.25,height=.25,fixedsize=true,fontsize=10];\n';
  str+= '   edge [arrowhead="vee",arrowsize=.5];\n';
  for(var i=0;i<graph.length;i++) {
    for(var j=0;j<graph[i].length;j++) {
      var order = -1;
      if(graph[i][j]>0 || graph[j][i]) {
        for(var k=0;k<rank.length;k++) {
          if(rank[k]==i) {
            order = k;
          }
        }
        str+= '   s'+i+' [label=\"'+order+'\"];\n';
        break;
      }
    }
  }

  for(var i=0;i<graph.length;i++) {
    for(var j=0;j<graph[i].length;j++) {
      if(graph[i][j]>0) {
      //  str+='   s'+i+' -> s'+j+';\n';
      //  str+='   s'+i+' -> s'+j+' [label=\"'+graph[i][j]+'\"];\n';
        if(graph[i][j]==0.1) {
          str+='   s'+i+' -> s'+j+' [color=\"red\"];\n';
        }
        if(graph[i][j]==0.3) {
          str+='   s'+i+' -> s'+j+' [color=\"yellow\"];\n';
        }
        if(graph[i][j]==0.7) {
          str+='   s'+i+' -> s'+j+' [color=\"green\"];\n';
        }
        if(graph[i][j]==1.0) {
          str+='   s'+i+' -> s'+j+' [color=\"black\"];\n';
        }
       
      }
    }
  }
  str+='}\n';
  return str;
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
    var graph = gen_graph(total_node);
    make_attack_graph(graph);
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
