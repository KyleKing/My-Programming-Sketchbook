clc, clear all, close all

% t = linspace(0,0.0002, 10000);
% null = linspace(0,0,10000);
% plot(t, 20+6*cos(2*pi*50*t)-t*1500*100, t, null)
% axis tight

% warning('off','all')

syms t
TimeToHit = solve('2*20+2*6*cos(2*pi*50*(t+0.020))-(t+0.020)*1500*100 = 0', t);

disp('Time to return = ')
disp(TimeToHit)
disp('seconds')