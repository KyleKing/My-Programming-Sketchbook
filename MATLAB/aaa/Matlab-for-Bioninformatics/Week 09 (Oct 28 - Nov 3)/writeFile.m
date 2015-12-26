fid=fopen('\\Client\G$\BIOE489D Bioinformatics\Test.txt','w')

for i=1:10
    A=rseq_dna(100)
    fprintf(fid,'%s\n\n',A)
end

fclose(fid)