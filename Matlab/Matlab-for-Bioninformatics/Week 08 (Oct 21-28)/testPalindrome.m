function [finalTable] = testPalindrome(seq, displayIt)
% Finds palindromes
%
% See also

  % clc, clear all % boilerplate

  % % for testing with known # of palindromes
  % seq = 'AAAAAAAAGGTTTTTTTTTT';
  % N = length(seq);

  % % Get a random starting sequence for the real deal
  % N = 100; % Length of sequence
  % seq = rseq(N);

  N = length(seq)
  revseq = complement(seq); % Take the reverse complement

  %
  % Search for a Palindrome
  %

  % Initialize counters
  matches = 0;
  aTable = zeros(N, 5); % for length and location storage

  % Loop for seq
  for i = 1:N
    % Loop for revseq
    for j = 1:N
      % Initialize length counter
      lengthMatch = 1;

      % Check for a match
      if seq(i) == revseq(j)
        % If match is found
        matches = matches + 1; % trigger a match!
        % disp('trigger')

        % Use K to extend the match section
        k = 1;
        while k < N+1
          if (i+k > N || j+k > N)
            % If past max length of the sequence
            aTable(matches, :) = [i, j, (i+k-1), (j+k-1), lengthMatch];
            % disp('Done-max')
            k = N+1;
          elseif seq(i+k) == revseq(j+k)
            % If match is found, extend the count
            lengthMatch = lengthMatch + 1;
            % disp([seq(i+k) ' and ' revseq(j+k) ' at ' num2str(i+k) ' and ' num2str(j+k)]) % for testing
            k = k+1;
          else
            % If no match, then end the count
            aTable(matches, :) = [i, j, (i+k-1), (j+k-1), lengthMatch];
            % disp('Done-no Match')
            k = N+1;
          end
        end

      end

    end
  end

  %
  % Find maximum plaindrome by sorting through aTable
  %

  % Initialize counters
  aTableMax = max(aTable(:, 5));
  finalTable = zeros(1, 5);
  finalMatches = 0;

  % sort through table to see where the maxes are:
  for l = 1:matches
    if aTable(l, 5) == aTableMax
      finalMatches = finalMatches + 1;
      finalTable(finalMatches, :) = aTable(l, :);
    end
  end

  if displayIt == 1
    % Display results
    lengthFinal = length(finalTable(:,1));
    disp(['Found ' num2str(lengthFinal) ' maximum length palindromes of ' num2str(aTableMax) ' bp' 13])
    disp(['Parsed as: Seq_Start RevSeq_Start Seq_Final RevSeq_Final Length_of_Match' 13])
    disp(finalTable)
    for count = 1:lengthFinal
      disp([{seq(finalTable(count, 1):finalTable(count, 3)), seq((N - finalTable(count, 2)) : (N - finalTable(count, 4)))}])
    end
    % disp([13 'to view palindromes, use start/final points with seq(Seq_Start:Seq_Final) and/or revseq(RevSeq_Start:RevSeq_Final)'])
  end
end