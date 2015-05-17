% % Manually pick file
%[Name, Path] = uigetfile('.xls');
%filename = strcat(Path, Name);

clc, clear all, close all

% Set current working directory
currentFolder = pwd;

%% Experiment 1 Data
% Plot max force versus stimulation force
figure
% Import file
filename = strcat(currentFolder,'/Lab Data/Single Pulse/recordedPeaks.csv');
Exp1 = csvread(filename, 1, 0);

% Store time, force and voltage from experiment 1 dataset
V1 = Exp1(:, 1);
F1 = Exp1(:, 2);

disp(['Max Force = ' num2str(max(F1))])

% Plot peaks for first experiment
hold all,
plot(V1, F1)
title('Experiment 1: Force Versus Stimulation Voltage')
xlabel('Stimulation Votage (mV)'), ylabel('Force (g)')


figure, hold all
% Import file
filename = strcat(currentFolder,'/Lab Data/Single Pulse/singlepulse',num2str(1),'.xls');
Exp1_1 = xlsread(filename);
% Store time, force and voltage from experiment 1 dataset with truncated values
tF_1 = Exp1_1(2:25, 1); F1_1 = Exp1_1(2:25, 2);
tV_1 = Exp1_1(1:25, 1); V1_1 = Exp1_1(1:25, 3);

% Import Next file
filename = strcat(currentFolder,'/Lab Data/Single Pulse/singlepulse',num2str(5),'.xls');
Exp1_5 = xlsread(filename);
tF_5 = Exp1_5(2:25, 1); F1_5 = Exp1_5(2:25, 2);
tV_5 = Exp1_5(1:25, 1); V1_5 = Exp1_5(1:25, 3);

% Plot peaks for the force generated
line(tF_1, F1_1,'LineStyle','-', 'Marker', 'none', 'Color', 'g')
line(tF_5, F1_5,'LineStyle','-', 'Marker', 'none', 'Color', 'b')

ax1 = gca; % get current axes
ax1.YColor = 'b';
set(ax1, 'xtickLabel', '');
ylabel('Stimulation Voltage (mV)')

ax1_pos = ax1.Position; % position of first axes
ax2 = axes('Position',ax1_pos, 'XAxisLocation','bottom', 'YAxisLocation','right', 'XColor','k', 'YColor','g', 'Color', 'none');

line(tV_1, V1_1,'Parent',ax2,'LineStyle','-', 'Marker', 'none', 'Color', 'g')
line(tV_5, V1_5,'Parent',ax2,'LineStyle','-', 'Marker', 'none', 'Color', 'b')

title('Experiment 1: Sample Peaks'), xlabel('Time (s)'), ylabel('Force (g)')

legend('Lower Voltage', 'Higher Voltage')
