set title "ExploitRank"
set terminal postscript enhanced 
set xlabel "Graph Size"
set ylabel "Running Time"
set output "attack_graph.ps"
set key top left 
f1(x) = a1*x**b1
a1 = 1; b1 = 1;
fit f1(x) 'r_time.dat' using ($1+$2):($3) via a1, b1
plot 'r_time.dat' using ($1+$2):($3) title ''  with linespoints, \
  a1*x**b1 title 'x**1.1'
