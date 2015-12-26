clc, clear all, close all
URL='http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nucleotide&id=5&rettype=fasta'
% str1=urlread(URL)
URL='http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nucleotide&id=5&rettype=ft'
% str2=urlread(URL)
URL='http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nucleotide&id=NC_000913&seq_start=1&seq_stop=1000000&rettype=ft'
str3=urlread(URL);
L=length(str3)
strfind(str3,'16S ribosomal')
str4=str3(107000:107300)
i=regexpi(str4,'\n[0-9]*\t[0-9]*\trRNA')
str4(i:i+30)