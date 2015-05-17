function [seq, filename] = sansInvisibles(seq)
% Removes any invisible characters
%
% See also

  i = 1;
  j = 1;
  lenSeq = length(seq);

  while i < lenSeq
    if (seq(i) == 'A' | seq(i) == 'T' | seq(i) == 'C'| seq(i) == 'G')
      tmpSeq(j) = seq(i);
      j = j+1;
      i = i+1;
    elseif (seq(i) ~= 'A' && seq(i) ~= 'T'&& seq(i) ~= 'C'&& seq(i) ~= 'G')
      i = i+1;
    end
  end
  seq = tmpSeq;

end