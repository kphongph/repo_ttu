set title "ExploitRank"
set terminal postscript eps enhanced "Palatino" 16
set xlabel "Graph Size"
set ylabel "Running Time (milliseconds)"
set output "attack_graph.ps"
set key top left 
f1(x) = a1*x**b1
a1 = 1; b1 = 1;
fit f1(x) 'r_time.dat' using ($1+$2):($3) via a1, b1
plot 'r_time.dat' using ($1+$2):($3) title ''  with linespoints, \
  a1*x**b1 title 'O(n)^{1.1}'
