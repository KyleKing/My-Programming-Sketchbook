fid=fopen('test2.txt','w');

for i=1:10000
  fprintf(fid,'Kyle ');
%   A = rseq_dna(10000);
%   fprintf(fid,'%s\n\n',A);
end

fclose(fid);


% Read the entire csv file:
% filename = 'csvlist.dat';
% M = csvread(filename)