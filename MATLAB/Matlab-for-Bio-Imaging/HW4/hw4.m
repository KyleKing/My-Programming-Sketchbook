% Homework 4
% Kyle King
% BIOE420 - 0101
clc, clear all, close all
disp('Question 3')

% Set Variables
T13 = 760; % ms
T23 = 77; % ms
alpha = pi/3;
Mo = 1; % Note, Mo is the relaxation position and can be treated as 100 percent = 1
t = linspace(0,1000, 1000); % ms

% Functions from notes:
Mz3 = Mo*(1 + (cos(alpha)-1)*exp(-t/T13)); % Longitudal - Mz
Mxy3 = Mo*sin(alpha)*exp(-t/T23); % Transverse - Mxy

% Plot above functions
% h = figure;
figure, hold all, plot(t, Mz3,'.', t, Mxy3, '.-')

% Plot time of interest and display value
tarray = [100, 1000];
bump = [0,0.05];

disp('Longitudal - Mz')
for (i = 1:2) % Sort through both time points
  str = ['\leftarrow '  num2str(Mz3(tarray(i))*100) ' % Mo'];
  text(tarray(i), Mz3(tarray(i)), str) % Plot text
  disp(['Percent relaxation at t = ' num2str(tarray(i)) 'ms is ' num2str(Mz3(tarray(i))*100) '%'])
end

disp('Transverse - Mxy')
for (i = 1:2) % Sort through both time points
  str = ['\leftarrow '  num2str(Mxy3(tarray(i))*100) ' % Mo'];
  text(tarray(i), Mxy3(tarray(i)), str) % Plot text
  disp(['Percent relaxation at t = ' num2str(tarray(i)) 'ms is ' num2str(Mxy3(tarray(i))*100) '%'])
end


disp('Question 4')
% Set Variables
T14 = 510; % ms
T24 = 67; % ms

% Functions from notes:
Mz4 = Mo*(1 + (cos(alpha)-1)*exp(-t/T14)); % Longitudal - Mz4
Mxy4 = Mo*sin(alpha)*exp(-t/T24); % Transverse - Mxy4

% Plot above functions
plot(t, Mz4, '-', t, Mxy4)
title('Q3 and Q4: Modulation Transfer Function')
xlabel('Time (ms)'), ylabel('% Mo')
legend('Longitudal - Mz3', 'Transverse - Mxy3','Longitudal - Mz4', 'Transverse - Mxy4', 'Location', 'NorthWest')

% Plot time of interest and display value
% Use variables declared above
disp(' ') % Line Break
disp('Longitudal - Mz4')
for (i = 1:2) % Sort through both time points
  str = ['\leftarrow '  num2str(Mz4(tarray(i))*100) ' % Mo'];
  text(tarray(i), Mz4(tarray(i)), str) % Plot text
  disp(['Percent relaxation at t = ' num2str(tarray(i)) 'ms is ' num2str(Mz4(tarray(i))*100) '%'])
end
disp('Transverse - Mxy4')
for (i = 1:2) % Sort through both time points
  str = ['\leftarrow '  num2str(Mxy4(tarray(i))*100) ' % Mo'];
  text(tarray(i), Mxy4(tarray(i)) - bump(i), str) % Plot text
  disp(['Percent relaxation at t = ' num2str(tarray(i)) 'ms is ' num2str(Mxy4(tarray(i))*100) '%'])
end

% differencexy = Mxy4 - Mxy3;
% differencez = Mz4 - Mz3;
% figure, plot(t, differencez, t, differencexy)

% syms t
% diff(exp(-t/T23) - exp(-t/T24))

% log(T13/T14)/(1/T14 - 1/T13)
% log(T23/T24)/(1/T24 - 1/T23)
