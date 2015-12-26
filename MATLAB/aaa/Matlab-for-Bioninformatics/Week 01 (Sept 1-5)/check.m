% check.m calculates percent GC content of given (N) number of random DNA strings
%
%   See also randDNA, notRandDNA, and calcGC

sum = 0;
N=10000;
for i=1:N
  a=randDNA(100);
  ct=calcGC(a);
  sum = sum + ct;
end
avg = sum/N;
