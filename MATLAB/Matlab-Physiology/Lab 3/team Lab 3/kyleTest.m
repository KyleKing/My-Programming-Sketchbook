clc, clear all, close all

% For testing
L = [0.056, 0.054, 0.052, 0.050, 0.048, 0.046, 0.044, 0.042, 0.044, 0.046, 0.048, 0.050, 0.052, 0.054, 0.056, 0.058, 0.052, 0.058, 0.052, 0.058]
t = linspace(0, 2, 20);

[P,Lse, Lce] = simplifiedHillsModelLSE(L, t);

plot(t, P)