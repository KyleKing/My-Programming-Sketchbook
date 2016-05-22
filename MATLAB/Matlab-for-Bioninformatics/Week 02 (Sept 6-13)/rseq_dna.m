function seq = rseq_dna( N ) %create random dna sequence

  P='GATC'; % The four bases of DNA
  r = randi([1,4],1,N); % generate a random array of N length with integers between 1-4
  seq = P(r); % Use the random array to pick random bases for the random DNA seq

end