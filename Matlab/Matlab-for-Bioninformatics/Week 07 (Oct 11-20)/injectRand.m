%
%
% Notes for InjectRandDNA.m
%
%





% clc, clear all, close all

% % set number of exhaustive loops to limit time of search
% % loopEnd = 999999;
% loopEnd = 5000;

% % Set intial values of minimum loop length before checking for ideal percent identity
% minLoop = 12;
% if minLoop >= loopEnd
%   disp('Min loop is greater than loopEnd and the function wont evaluate when the loop hits the ideal percent index')
% end
% idealPercentIdent = 100;

% %
% % Get Random Sequence
% %

% % Establish set of bases
% P='GATC';

% L = 500; % Length of sequence desired
% seq = notRandDNA(L, 0.25, 0.25); % Return random sequence with equal likelihood of each base
% preSeq = seq; % store initial sequence for later calculations


% N = 200; % number of random base mutations
% % Fix issue if N is greater than length of sequence
% if N >= L
%   N = L;
% end
% randBinary = zeros(L, 1); % Initialize random binary list of L length
% mutationSpots = ceil(L.*rand(N,1)); % round up to avoid zero case

% % Generate a random string of 1 or 0 for length of sequence with max of N number of mutations
% for j = 1:N
%   randBinary(mutationSpots(j)) = 1;
% end


% % Initialize
% lasthit = 0;

% for x = 1:loopEnd % Loop through X number of times

%   %
%   % Inject random mutations set number of times
%   %

%   for countMut = 1:L % sort through length of sequence
%     if randBinary(countMut) == 1 % If random integer = 1, make a mutation
%       r = randi([1 4], 1, 1); % Generate one random base
%       seq(countMut) = P(r); % store new base over existing base
%       % disp(['test ' num2str(countMut)]) % for testing
%     end
%   end

%   %
%   % Measure Identity
%   %

%   sumIdentity = 0; % Initialize

%   for countIde = 1:L % sort through length of sequence
%     if preSeq(countIde) == seq(countIde) % See if nucleotide is identitcal
%       sumIdentity = sumIdentity + 1; % store in a counter of identical nucleotides
%     end
%   end

%   % Calculate the percent Identity
%   perIdentity = (sumIdentity/L)*100;
%   R(x) = perIdentity;
%   t(x) = x;
%   % disp([num2str(perIdentity) '%'])

%   %
%   % Run analysis
%   %

%   % Check to see if percent identity is aboce ideal and if lapsed enough loops
%   if (perIdentity >= idealPercentIdent && x >= minLoop)
%     disp([num2str(perIdentity) '% on loop ' num2str(x) ', ' num2str(x-minLoop) ' loops past minLoops and ' num2str(lasthit) ' loops since last hit'])
%     % break % End for loop because search was successful
%     lasthit = x;
%   end

%   % Check to see if ran whole loop without success
%   if x == loopEnd
%     disp(['Final percent identity: ' num2str(perIdentity) '% after ' num2str(x) ' loops'])
%     if lasthit == 0
%         disp(['Never returned to ideal percent identity of ' num2str(idealPercentIdent) '%'])
%     end
%   end
% end

% plot(t, R, 'o')