function gc_cont = calcGC(seq)
% calcGC calculates percent GC content of random DNA string
%
%   See also randDNA, notRandDNA, and check.m

  L = length(seq);
  ict=0;
  for i=1:L
    if (seq(i) == 'G'| seq(i) == 'C')
      ict = ict+1;
    end
  end
  gc_cont = ict/L;
  % disp(['Final GC Content = ' num2str(gc_cont)]); % use ASCII code to insert things like tabs (i.e. 9 = tab)
end