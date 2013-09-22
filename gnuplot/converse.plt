set title "ExploitRank"
set terminal postscript enhanced 
set logscale y
set xlabel "Iteration"
set ylabel "T1 Norm"
set output "iteration.ps"
set key top left 
plot 'iteration_diff.dat' using 1:2 title ''  with linespoints
