function [cleanStr2, cleanExtStr2] = cleanString(str2)
% cleanString truncates a long string into a shorter, prettier output
%
%   See also complement.m

  % Manipulate the length of the string
  lenStr2 = length(str2);
  lines = lenStr2/30; % arbitrary number that looked good for max width
  % Round the sequence
  ceilLines = ceil(lines);
  flrLines = floor(lines);

  %
  %
  % Truncate sequence into 30 bp shorter sequences
  %
  %

  % If seq chunk is less than 30, run extension to avoid range issues
  extension = lenStr2 - 30*flrLines; % Find remainder of dividing by 30
  if (extension ~= 0)
    jlastLast = 30*flrLines + 1; % find start of last 30 base chunk
    cleanExtStr2 = str2(jlastLast:(flrLines*30 + extension)); % store it
  else
    cleanExtStr2 = ''; % empty second header is divisible in 30 base chunks
  end

  % If seq chunk is = to 30, run standard analysis
  if flrLines >= 1 % Check to see if the sequence is longer than 30 characters
    jlast = 1; % initialize counter variable
    for i=1:flrLines
      % For each 30 base chunk (i)
      tempStr2 = str2(jlast:i*30); % length(tempStr2) % for testing
      cleanStr2(i, :) = tempStr2; % save short sequence as new line
      jlast = jlast + 30; % shift to next 30 base string
    end
  else % If not > 30 characters, just display the extension sequence
    cleanStr2 = cleanExtStr2; % Swap short sequence to first header
    cleanExtStr2 = ''; % then empty second header
  end
end