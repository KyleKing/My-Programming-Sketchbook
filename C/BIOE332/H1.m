K = 1 ./ (2.*a.*b.^3 + (2/3).*b + (4/3).*b.^4 - 4.*b.^3) ;

% a = 0.1:0.01:0.4;
% b = 0.6:0.01:0.9;
% plot3(a, b, K)

figure
subplot(2,2,1)
a = 0.1:0.01:0.4;
b = 0.6;
plot(a, K)
title('Varying a from .1:0.4, with b constant = 0.6')
xlabel('a')
ylabel('K(a, b)')
 
subplot(2,2,2)
b = 0.9;
plot(a, K)
title('Varying a from .1:0.4, with b constant = 0.9')
xlabel('a')
ylabel('K(a, b)')

subplot(2,2,3)
a = 0.1;
b = 0.6:0.01:0.9;
plot(b, K)
title('Varying b from 0.6:0.9, with a constant = 0.1')
xlabel('b')
ylabel('K(a, b)')

subplot(2,2,4)
a = 0.4;
plot(b, K)
title('Varying b from 0.6:0.9, with a constant = 0.4')
xlabel('b')
ylabel('K(a, b)')