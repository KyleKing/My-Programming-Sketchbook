function [perIdentity, seq, preSeq] = InjectRandDNA(N,L)
% InjectRandDNA takes number of substitutions and number of bases and
% generates random substitutions in a random sequence.
%
%   See also rseq.m

  % % Testing
  % clc, clear all, close all
  % L = 500; % Length of sequence desired
  % N = 200; % number of random base mutations

  % Get Random Sequence
  seq = rseq(L);
  preSeq = seq; % store initial sequence for later calculations

  % Fix issue if number of mutations is greater than length of sequence
  if N >= L
    N = L;
  end

  %
  % Generate the locations to be mutated
  %
  randBinary = zeros(L, 1); % Initialize random binary list of L length
  mutationSpots = ceil(L.*rand(N,1)); % round up to avoid zero case
  % Generate a random string of 1 or 0 for length of sequence with max of N number of mutations
  for j = 1:N
    randBinary(mutationSpots(j)) = 1;
  end

  %
  % Inject random mutations set number of times
  %
  for countMut = 1:L % sort through length of sequence
    if randBinary(countMut) == 1 % If random integer = 1, make a mutation
      seq(countMut) = rseq(1); % store new base over existing base
      % disp(['test ' num2str(countMut)]) % for testing
    end
  end

  %
  % Measure Identity
  %
  sumIdentity = 0; % Initialize
  for countIde = 1:L % sort through length of sequence
    if preSeq(countIde) == seq(countIde) % See if nucleotide is identical
      sumIdentity = sumIdentity + 1; % store in a counter of identical nucleotides
    end
  end

  %
  % Calculate the percent Identity
  %
  perIdentity = (sumIdentity/L)*100;
  % disp([num2str(perIdentity) '%'])
end