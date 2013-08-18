var link_exists = 0.5;
var page_rank_d = 0.85;
var page_rank_diff = 0.00001;
var link_factor = 0.5;
var total_node = 2048;

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
        if(visited.length == graph.length) {
          console.log("Visited - " + visited.length);
        }
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
    console.log('#edge '+count_link);
    return node_list;
};

var page_rank = function (graph) {
    var rank_value = [];
    var graph_sum = [];
    for (var i = 0; i < graph.length; i++) {
        rank_value.push(1 / graph.length);
        var tmp = 0.0;
        for (var j = 0; j < graph[i].length; j++) {
            tmp += graph[i][j];
        }
        graph_sum.push(tmp);
    }
    var diff = 1.0;
    while (diff > page_rank_diff) {
        var new_rank_value = [];
        for (var i = 0; i < rank_value.length; i++) {
            var tmp = 0.0;
            for (var j = 0; j < graph.length; j++) {
                if (graph_sum[j] != 0) {
                    tmp += page_rank_d * graph[j][i] * rank_value[j] / graph_sum[j];
                }
            }
            if (graph_sum[i] == 0) {
                tmp += page_rank_d * rank_value[i];
            }
            new_rank_value.push(tmp);
        }
        new_rank_value[0] = 1 - page_rank_d;
        diff = 0.0;
        for (var i = 0; i < rank_value.length; i++) {
            //    console.log("Rank value "+i+" :"+new_rank_value[i]);
            diff += Math.abs(rank_value[i] - new_rank_value[i]);
            rank_value[i] = new_rank_value[i];
        }
        //console.log(diff);
    }
    //console.log("end");
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

    /*
    for (var i = 0; i < graph.length; i++) {
        var str = "
                            " + i + ": (" + path[i]["
                            v "] + ", " + path[i]["
                            l "] + ", [";
        for (var j = 0; j < path[i]["
                            p "].length; j++) {
            str += path[i]["
                            p "][j] + ", ";
        }
        str += "])";
        console.log(str);
    }
    */
};

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
*/
var iteration = 10;
var time_p = 0.0;
var time_e = 0.0;
for (var i = 0; i < iteration; i++) {
    var graph = gen_graph(total_node);
    make_attack_graph(graph);
    
    var s_time = (new Date()).getTime();
    page_rank(graph);
    var e_time = (new Date()).getTime();
    time_p+= (e_time - s_time);    

    s_time = (new Date()).getTime();
    exploit_rank(graph);
    e_time = (new Date()).getTime();
    time_e+= (e_time - s_time);
}
console.log("PageRank-based "+time_p/iteration);
console.log("Exploit-based "+time_e/iteration);
