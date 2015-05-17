Fs = 1000;                    % Sampling frequency
T = 1/Fs;                     % Sample time
L = 1000;                     % Length of signal
t = (0:L-1)*T;                % Time vector

% Generate a 50 Hz sinusoidal signal
x1 = 0.7*sin(2*pi*50*t);
figure(1)
plot(Fs*t(1:50),x1(1:50), '-ro') %"help plot"
title('50 Hz Sinusoidal Signal')
xlabel('time (milliseconds)')

% Generate a 120 Hz sinusoidal signal
x2 = sin(2*pi*120*t);
figure(2)
plot(Fs*t(1:50),x2(1:50), '-b*')
title('120 Hz Sinusoidal Signal')
xlabel('time (milliseconds)')

y = x1 + x2 + 2*randn(size(t));     % Sinusoids plus noise
figure(3)
plot(Fs*t(1:50),y(1:50), '--gs')
title('Signal Corrupted with Zero-Mean Random Noise')
xlabel('time (milliseconds)')

