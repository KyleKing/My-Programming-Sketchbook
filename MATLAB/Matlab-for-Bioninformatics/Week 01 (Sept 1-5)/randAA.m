function seq = rseq_dna( N ) %create random protein sequence

  % P='AVLIFWMPDEGSTCYNQKRH'; % The Amino Acids
  P={'Gly','Ala','Val','Leu','Ile','Met','Phe','Trp','Pro','Ser','Thr','Cys','Tyr','Asn','Gln','Asp','Glu','Lys','Arg','His'}; % The Amino Acids
  r = randi([1,20],1,N); % generate a random array of N length with integers between 1-4
  seq = P(r); % Use the random array to pick random bases for the random DNA seq
end