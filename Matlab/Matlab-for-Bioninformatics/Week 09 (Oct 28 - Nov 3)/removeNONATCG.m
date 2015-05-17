function [seq] = removeNONATCG(seq)
% Removes end space
%
% See also

  % remove end spaces
  lenSeq = length(seq);
  % Find start:
  i = 1;
  while i < lenSeq
    if (seq(i) == 'A' | seq(i) == 'T' | seq(i) == 'C'| seq(i) == 'G')
      I = i;
      i = lenSeq;
    end
    i = i + 1;
  end

  % Find end:
  n = I;
  while n <= lenSeq
    if (seq(n) ~= 'A' && seq(n) ~= 'T'&& seq(n) ~= 'C'&& seq(n) ~= 'G')
      N = n;
      n = length(seq);
    elseif n == lenSeq
      N = n;
    end
    n = n + 1;
  end

  seq = seq(I:N);



  % Alternatively, write two while loops that remove whitespaces by two different count variables, the output and the input

end