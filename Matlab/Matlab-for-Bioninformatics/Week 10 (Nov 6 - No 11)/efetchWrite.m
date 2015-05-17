clc, clear all, close all

% Open the file and get name and path to open and write file
% [Name, Path] = uigetfile('.txt');
% filename = strcat(Path, Name);
filename = '/Users/kyleking/Documents/Developer/__Matlab/Matlab-for-Bioninformatics/Week 10 (Nov 6 - No 11)/efetchTest.txt';
fid=fopen(filename,'w');

% % Using multiple ID's to fetch information
% URL = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=sequences&id=703491539,312836839,34577063&rettype=fasta&retmode=text';

% % Using terms:
% URL = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=sequences&term=16s+rRNA&rettype=acc&retmode=text';

% #1 Return matching values to the text search
% URL = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=nucleotide&rettype=acc&retmode=text&term=16s+rRNA';
% Imporove #1 terms
URL = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=nucleotide&rettype=acc&retmode=text&term=16s+rRNA+OR+16s+ribosomal+RNA+NOT+Methyltransferase';

% % Invalid db? Sequences? not getting Acc#'s....
% URL='http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nucleotide&id=5&rettype=fasta&term=16s+ribosomal';

% % Given Length
% URL='http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nucleotide&id=NC_000913&seq_start=1&seq_stop=1000000&rettype=ft';

% #2 Select Feature of GID from #1
% URL='http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nucleotide&id=706607355&rettype=fasta';
% #2, but with more reative search
ID = '706607358,706607355,706607354';
% ID = '706607355';
% ID = '706607354';
URL=['http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nucleotide&id=' ID '&rettype=fasta'];

str3 = urlread(URL);

% Do manipulation
% L=length(str3)
% strfind(str3,'16S ribosomal')
% str4=str3(107000:107300)
% i=regexpi(str4,'\n[0-9]*\t[0-9]*\trRNA')
% str4(i:i+30)

% Write to file
fprintf(fid, '%s\n', [str3]);
fclose(fid);


% &strand=1 plus strand (2 for negative strand)