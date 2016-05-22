%Script to evaluate statistics of random DNA sequence generation

clear                       %erase all variables in workspace

%Initialize several variables
sum=0;                      %used in mu calculation
sd1=0;                      %used in sigma calculation
sd2=0;                      %used in sigmas calculation

%Input several constants
N=10000;                    %Number of random samples
Nb=20;                      %Number of bins in histogram
%Note: It is tempting to try using a larger value for Nb but the rule of
%thumb is that the number of bins should be N^0.33. Values larger
%than this usually degrade the histogram due to random fluctuations
Nl=300;                     %Number of bases in each random sequence

%Create random sequences and compute statistics
for i=1:N
    a=rseq_dna(Nl);         %Create random sequences
    ct=GC_ct(a);            %Compute GC content
    dd(i)=ct;               %Store data in array
    sum=sum+ct;             %Prepare for mu calculation
    sd1=sd1+ct;             %Prepare for sigma calculation
    sd2=sd2+ct^2;           %Prepare for sigma calculation
end

mu=sum/N                    %Compute mu
sigma=1/N^0.5*(N*mu^2-2*mu*sd1+sd2)^0.5    %Compute sigma

%Create histogram from random sample GC content
hist(dd,Nb)
h=findobj(gca,'Type','patch')   %handle of histogram plot
set(h,'FaceColor',[0 .5 1],'EdgeColor','w')  %change colors of bars on plot

hold                        %hold plot to allow overlay of normal distribution
xx=linspace(0,1,100);       %Create independent variable for normal pdf (probability density function)
pdf=1/(sigma*(2*pi)^0.5)*exp(-(xx-mu).^2/(2*sigma^2));  %Calculate pdf using mu and sigma from random samples
plot(xx,pdf*(max(dd)-min(dd))/Nb*N,'k')  %Plot pdf with scaling
hold                        %toggle hold
xlabel('GC content')
ylabel('pdf * bin width * N')
%y positions below work for N = 10000
text(.7,1300,['N =' num2str(N)])
text(.7,1200,['Nb =' num2str(Nb)])
text(.7,1100,['Nl =' num2str(Nl)])
text(.7,1000,['\mu =' num2str(mu)])
text(.7,900,['\sigma =' num2str(sigma)])