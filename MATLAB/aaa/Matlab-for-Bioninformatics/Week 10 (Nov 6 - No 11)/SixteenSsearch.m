function sequences = SixteenSsearch(accessionN)
% Matlab Project: Write program to automatically download all of the 16s sequences given an accession number for a bacterial genome
%
% See also

  % In class example
  % URL = 'ajlhdfkjhsdf'
  % str1 = urlread(URL)

  % Efetch: Entrez Fetch Utilities
  % http://www.mathworks.com/help/bioinfo/examples/accessing-ncbi-entrez-databases-with-e-utilities.html
  % Guide: http://www.ncbi.nlm.nih.gov/books/NBK25497/
  % http://www.ncbi.nlm.nih.gov/books/NBK25498/


  % Search for statr of possibly relevant sequences
  % Check that the DNA has 16s associated with its name?
  % Retrieve sequences into array, sequences


%% USEFUL: http://www.mathworks.com/help/matlab/matlab_prog/regular-expressions.html strfind....
% http://www.mathworks.com/help/matlab/ref/regexpi.html



% baseURL = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
% eutil = 'esearch.fcgi?';
% dbParam = 'db=nuccore';
% termParam = '&term=A/chicken/Hong+Kong/915/97+OR+A/chicken/Hong+Kong/915/1997';
% usehistoryParam = '&usehistory=y';
% esearchURL = [baseURL, eutil, dbParam, termParam, usehistoryParam]

  % assemble the URL
  base = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
  addon = $base . 'efetch.fcgi?db=nucleotide&id=$gi_list&rettype=acc';
  URL = [base, addon];

  sequences = urlread(URL);

  return sequences;
end


% Problem: DataFile - too larger to manipulate...


% http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=nucleotide&term=$NM_009417$NM_009417&usehistory=y



% Store as a TXT file in FASTA Format
% see program in canvas (\r instead of \n - carriage return is clearer)
% Show the test worked. I.E. Publish