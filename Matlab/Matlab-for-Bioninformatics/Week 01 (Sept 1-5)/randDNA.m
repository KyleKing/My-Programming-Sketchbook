function seq = randDNA(N)
% randDNA create random dna sequence
%
%   See also check.m, notRandDNA, and calcGC

  % seq='';
  P='GATC';
  % weight=[.25 .25 .25 .25];
% This block of code can be replaced with: cweight = linspace(0.25,1,4); % Creates array from .25 -> 1 over 4 steps
  % norm=sum(weight);
  % weight=weight/norm; %Normalize weights so that add up to 1 more closely
  % cweight(1)=weight(1); %Cumulative weights make the algorithim simpler
  % for i=2:4
  %   cweight(i)=cweight(i-1)+weight(i); % Creates array from .25 -> 1
  % end
% Furthermore this snippet can be circumvented by using a random array and piping it into the bases string to generate a new random seq
  % for i=1:N % N bases
  %   num=rand; %random number between 0 and 1
  %   for j=1:4 %20 amino acids
  %     if num<cweight(j)
  %       seq=[seq P(j)]; %extend seq by one base randomly
  %     break
  %   end
  % end
  r = randi([1 4],1,N);
  seq = P(r);
end



% Cleaned up code:

% function seq = rseq_dna( N ) %create random dna sequence

%   P='GATC'; % The four bases of DNA
%   r = randi([1,4],1,N); % generate a random array of N length with integers between 1-4
%   seq = P(r); % Use the random array to pick random bases for the random DNA seq

% end