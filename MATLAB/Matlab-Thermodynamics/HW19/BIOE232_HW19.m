%% Question 1
clc, close all, clear all
Ka = 5.1E-7;
pKa = -log10(Ka);
pH = linspace (0, 14, 14);
ratio = 1/(1+10.^(pKa - pH));

figure, plot(pH, ratio)
title('HW19: Q1 The ratio of C_b/C_total versus pH')
xlabel('pH'), ylabel('Ratio of C_b/C_total')