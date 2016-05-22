clc, close all, clear all
base = 'AATCCCAATACCCTGATATATGCTTCATACCGTATGGCTCGAGCATTACGCGCATGATATCCTCTCGTCGTGACCCGAACTATGTGACAACTCAGATTGATC';

for i = 1:floor(100/11)
%     disp(i)
%     disp((i-1)*11+1)
%     disp(i*11)
    seq = base(((i-1)*11+1):i*11)
    GC(i) = length(seq(seq=='C' | seq=='G'))/length(seq);
end
% disp(GC)
plot(GC)