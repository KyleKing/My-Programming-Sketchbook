function seq = notRandDNA (N, g_cont, c_cont)
% notRandDNA creates a controllable GC content in an otherwise random DNA string
%   seq = notRandDNA (N)  Calculates a random DNA string
%   seq = notRandDNA (N, g_cont) Calculates a nonrandom DNA string with given GC content
%   seq = notRandDNA (N, g_cont, c_cont) Calculates a nonrandom DNA string with specific G and specific C content
%
%   See also randDNA, calcGC, and check.m

  switch nargin
  case 3
    if (g_cont+c_cont)<=1
      seq='';
      P='GATC';
      at_cont = (1-(g_cont+c_cont))/2; % figure out how much weight to allocate to A/T
      weight=[g_cont at_cont at_cont c_cont]; % given user preferences, assign g/c weight
      net=sum(weight);  weight=weight/net; % Normalize weights so that add up to 1 more closely
      cweight(1)=weight(1); % set base cumulative weight
      for i=2:4
        cweight(i)=cweight(i-1)+weight(i); % Cumulative weights allow for sorting by creating an increasing linear trend
      end
      for i=1:N % N bases in seq
        num=rand; % random number between 0 and 1
        for j=1:4 % 4 bases
          if num<cweight(j) % check to see which bases the random number corresponds to
            seq=[seq P(j)]; % extend seq by one base randomly
            break
          end
        end
      end % missing from original code
    else
      disp('Desired % G content plus % C content must be less than 1')
    end
  case 2
    if (g_cont)<=1
      seq='';
      P='GATC';
      at_cont = (1-g_cont)/2; % figure out how much weight to allocate to A/T
      weight=[g_cont at_cont at_cont g_cont]; % given user preferences, assign g/c weight
      net=sum(weight);  weight=weight/net; % Normalize weights so that add up to 1 more closely
      cweight(1)=weight(1); % set base cumulative weight
      for i=2:4
        cweight(i)=cweight(i-1)+weight(i); % Cumulative weights allow for sorting by creating an increasing linear trend
      end
      for i=1:N % N bases in seq
        num=rand; % random number between 0 and 1
        for j=1:4 % 4 bases
          if num<cweight(j) % check to see which bases the random number corresponds to
            seq=[seq P(j)]; % extend seq by one base randomly
            break
          end
        end
      end % missing from original code
      GC_cont = g_cont*100;
      disp(['This is a nonrandom DNA string with GC content = ' num2str(GC_cont) '%'])
    else
      disp('Desired % G content must be less than 1')
    end
  case 1
    seq = randDNA(N);
    disp('This is a random DNA string, add % G content and/or % C content for nonrandom string')
  otherwise
    disp('Give me an input: # of bases, % G content, and/or % C content')
end
