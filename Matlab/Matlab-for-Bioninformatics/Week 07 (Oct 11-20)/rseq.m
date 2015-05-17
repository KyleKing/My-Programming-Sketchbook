function seq = rseq( N )
%create random protein sequence
%weights from Table 3-2 in Pevsner

seq='';
% P='GALKSVTPEDRNFQIHCYMW';
P='GATC';
weight = [0.25, 0.25, 0.25, 0.25];
% weight=[.089 .087 .085 .081 .070 .065 .058 .051 .050 .047];
% weight=[weight .041 .040 .040 .038 .037 .034 .033 .030 .015 .010];
norm=sum(weight);
weight=weight/norm;    %Normalize weights so that add up to 1 more closely
cweight(1)=weight(1);  %Cumulative weights make the algorithim simpler

for i=2:length(P)
   cweight(i)=cweight(i-1)+weight(i); %Cumulative weights make the algorithim simpler
end

for i=1:N              %N amino acids
    num=rand;          %random number between 0 and 1
    for j=1:length(P)         %20 amino acids
        if num<cweight(j)
            seq=[seq P(j)];   %extend seq by one amino acid randomly
            break
    end
end

end