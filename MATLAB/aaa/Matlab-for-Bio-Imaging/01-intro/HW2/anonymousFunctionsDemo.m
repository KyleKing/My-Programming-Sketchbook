% Useful fun with anonymous functions for stepwise calculations
f=@(x) ( 0.*and(-4<x, x<-2) + and(-2<=x, x<=2) + 0.*and(2<x, x<4) );
figure, subplot(2,1)
plot(f, [-4, 4, 0, 2]),
title('Signal')
xlabel('time (sec)'), ylabel('real space')