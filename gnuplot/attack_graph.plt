#set title "ExploitRank"
set terminal postscript eps enhanced "Palatino" 24 
set xlabel "Size of Attack Model"
set ylabel "Running Time (milliseconds)"
set output "attack_graph.ps"
set grid ytics lt 0 lw 1  
set grid xtics lt 0 lw 1  
set xtics ("0" 0, "100,000" 100000, "200,000" 200000, "300,000" 300000, "400,000" 400000, "500,000" 500000)
set ytics ("0" 0, "10,000" 10000, "20,000" 20000, "30,000" 30000, "40,000" 40000, "50,000" 50000)
set key top left 
f1(x) = a1*x**b1
a1 = 1; b1 = 1;
fit f1(x) 'r_time.dat' using ($1+$2):($3) via a1, b1
plot [0:510000] [0:54000]'r_time.dat' using ($1+$2):($3) title ''  with linespoints, \
  a1*x**b1 title 'O(n)^{1.1}'
