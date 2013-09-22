var page_rank_d = 0.85;
var page_rank_diff = 0.00001;

var page_rank = function (graph) {
  var rank_value = [];
  var graph_sum = [];
  var graph_d = [];
  var iteration = 0;
  for (var i=0;i<graph.length;i++) {
    rank_value.push(1.0/graph.length);
    var tmp = 0.0;
    for (var j = 0; j < graph[i].length; j++) {
      tmp += graph[i][j];
    }
    graph_sum.push(tmp);
    graph_d.push(page_rank_d);
  }
  var diff = 1.0;
  while (diff > page_rank_diff) {
    var new_rank_value = [];
    for (var i=0;i<rank_value.length;i++) {
      new_rank_value.push(0.0);
    }
    for(var i=0;i<rank_value.length;i++) {
      for(var j=0;j<graph.length;j++) {
        if(graph_sum[j]!=0 && graph[j][i]!=0) {
          new_rank_value[i]+=graph_d[j]*graph[j][i]*rank_value[j]/graph_sum[j];
        }
      }
      if (graph_sum[i]==0) {
        new_rank_value[i]+=graph_d[i]*rank_value[i];
      } 
      new_rank_value[0]+=(1-graph_d[i])*rank_value[i];
    }
    
    diff = 0.0;
    var sum_rank = 0.0;
    for (var i=0;i<rank_value.length;i++) {
      diff+=Math.abs(rank_value[i]-new_rank_value[i]);
      rank_value[i]=new_rank_value[i];
    }
    iteration++;
    // console.log(iteration+'\t'+diff.toFixed(5));
  }

  var sum_rank = 0.0;
  for(var i=0;i<rank_value.length;i++) {
    sum_rank += rank_value[i];
  }

  // console.log(sum_rank);
  // console.log(iteration);
  // console.log(rank_value);
  return rank_value;
};


var rank_order = function(rank_value) {
  var order = [];
  var c_order = 0;
  for(var i=0;i<rank_value.length;i++) {
    order.push(0);
  }
  for(var i=0;i<rank_value.length;i++) {
    var idx = -1;
    var max = -1;
    var order_list = [];
    for(var j=0;j<rank_value.length;j++) {
      if(rank_value[j]>0 && rank_value[j] > max) {
        max=rank_value[j];
        order_list = [];
        order_list.push(j);
      } else {
        if(rank_value[j] == max) {
          order_list.push(j);
        }
      }
    }
    for(var j=0;j<order_list.length;j++) {
       rank_value[order_list[j]] = 0;
       order[order_list[j]] = c_order;
    }
    c_order+=order_list.length;
  }
  return order;
}


exports.page_rank = page_rank;
exports.rank_order = rank_order;
