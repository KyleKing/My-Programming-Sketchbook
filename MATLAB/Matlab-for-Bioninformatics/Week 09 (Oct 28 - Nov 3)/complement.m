function [str2, str1] = complement(str1)
% complement find the reverse complement of the given nucleotide string as str2
% str1 is the input string
% str2 is the reverse complement
%

  % % For testing:
  % clc, clear all
  % str1 = ['ACCCCCCGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'];


  %
  % For given sequence, take the complement and store in reverse order
  %

  % Remove end spaces
  str1 = removeNONATCG(str1);
  % Capitalize
  str1 = upper(str1);

  % Find length of input sequence
  lenStr1 = length(str1);

  % For length of given sequence
  for i = 1:lenStr1
    % Check for nucleotide base and store pair in tmp data structure
    if str1(i) == 'C'
      tmp = 'G';
    elseif str1(i) == 'G'
      tmp = 'C';
    elseif str1(i) == 'A'
      tmp = 'T';
    elseif str1(i) == 'T'
      tmp = 'A';
    else
      % If no nucleotide is detected or protein sequence is run. Return error code:
      disp('Double check that this a DNA sequence (in all CAPS) and remove any non-ACTG characters. Please!')
      return % end
    end

    % Make the reverse complement by filling in the string backwards (i.e. Final position - current)
    tmpPos = lenStr1 - i + 1; % '+1' is added to make the math work
    str2(tmpPos) = tmp; % Write to reverseComlement
  end

  % % Display original string
  % disp([13 'Given string:' 13])
  % disp(str1)

  % % Display output of string manipulation
  % disp([13 'The reverse complement is:' 13])
  % disp(str2)

  return % end
end