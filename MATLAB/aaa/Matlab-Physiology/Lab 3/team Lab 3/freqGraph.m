%% Frequency vs Max Force of Contraction

hz = [0.5,1,2,3,4,5,10,15,20,30];
max = [2.601, 2.697, 2.753, 3.101, 3.319, 9.133, 9.010, 9.876, 6.429, 7.042];

plot(hz, max)
title('Experiment 2: Frequency vs Max Force')
xlabel('Stimulation Frequency (Hz)'), ylabel('Force (g)')