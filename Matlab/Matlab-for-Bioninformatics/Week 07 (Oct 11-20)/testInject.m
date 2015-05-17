clc, clear all, close all

%
%
% Variables to alter settings
%
%

L = 100; % Length of sequence desired
N = 80; % number of random base mutations
minLoop = 12; % Number of loops before checking for Ideal Percent (i.e. return to original or close)
idealPercentIdent = 100; % Idea percent identity
loopEnd = 10000; % set number of exhaustive loops to limit time of search

% Set initial values of minimum loop length before checking for ideal percent identity
if minLoop >= loopEnd
  disp('Min loop is greater than loopEnd and the function wont evaluate when the loop hits the ideal percent index')
end

%
% Exhaustively loop through Injecting Random Mutations in DNA
%
lasthit = 0; % Initialize
for x = 1:loopEnd % Loop through X number of times

  %
  % The only part that matters
  %
  [perIdentity, seq, preSeq] = InjectRandDNA(N,L);

  % Store values for histogram
  t(x) = x;
  R(x) = perIdentity;

  %
  % Run analysis
  %
  % Check to see if percent identity is above ideal and if lapsed enough loops
  if (perIdentity >= idealPercentIdent && x >= minLoop)
    disp([num2str(perIdentity) '% on loop ' num2str(x) ', ' num2str(x-minLoop) ' loops past minLoops and ' num2str(lasthit) ' loops since last hit'])
    % break % End for loop because search was successful
    lasthit = x;
  end

  %
  % If done with loop print out final stats
  %
  if x == loopEnd
    disp(['Final percent identity: ' num2str(perIdentity) '% after ' num2str(x) ' loops'])
    % Check for success
    if lasthit == 0
        disp(['Never returned to ideal percent identity of ' num2str(idealPercentIdent) '%'])
    end
  end
end

%
% Plot in histogram format
%

% plot(t, R, 'o')
hist(R, 10)