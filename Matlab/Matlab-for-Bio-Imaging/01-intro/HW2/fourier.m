%% Question 3
% DON'T FORGET THE HAND CALCULATIONS
% int( f(x) * exp(-i*2*pi*k*x) ) (-2 to 2)

% k = 1;
% y = 1*exp(-i*2*pi*k*2)/(-i*2*pi*k) - 1*exp(-i*2*pi*k*-2)/(-i*2*pi*k);

clear all, clc, close all

Fs = 2^8;
L = 8*Fs;
t = linspace(-4, 4, L);
y = zeros(1, L);
for i = 1:L
  if (t(i) >= -2 && t(i) <= 2)
    y(i) = 1;
  end
end
subplot(2,1,1), plot(t, y)
title('Signal')
xlabel('time (sec)'), ylabel('real space')

Y = fftshift(fft(y),2);
subplot(2,1,2), plot(t, abs(Y/Fs))
axis([-1 1 -2 5])
title('Fourier Transform of Signal')
xlabel('Frequency'), ylabel('K-Space')

% Useful fun with anonymous functions for stepwise calculations
% f=@(x) ( 0.*and(-4<x, x<-2) + and(-2<=x, x<=2) + 0.*and(2<x, x<4) );
% figure, subplot(2,1)
% plot(f, [-4, 4, 0, 2]),
% title('Signal')
% xlabel('time (sec)'), ylabel('real space')