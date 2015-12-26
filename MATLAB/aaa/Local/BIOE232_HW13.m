clc, close all, clear all
plotType = 'xo';
%% Question 1
% Import CSV data
M = csvread('num1.csv', 1);
P = M(:, 1); x1 = M(:, 2); y1 = M(:, 3);
figure, hold all, plot(x1, P, 'x:'), plot(y1, P, '--')
title('HW13: Q1(a) Pxy diagram for 2-Methyl-1-propanol (1) and Octane (2)')
xlabel('x1, y1'), ylabel('P (kPa)')
legend('x1', 'y1')


% Part 2: where 2-Methyl-1-propanol (1) and Octane (2)
% Find the saturated pressures based on the Antione Equation
Psat = []; T = 373.15; % K
A = [6.49183, 6.04394];
B = [1270.273, 1351.938];
C = [-97.885,  -64.030];
for n = 1:2
    Psat(n) = 10^(A(n)-B(n)/(T+C(n)));
    disp(['Psat' num2str(n) ' = ' num2str(Psat(n))])
end

% Find x2 and y2 based off of x1 and y1, where x1 + x2 = 1
x(:, 1) = x1; x(:, 2) = 1 - x(:, 1);
y(:, 1) = y1; y(:, 2) = 1 - y(:, 1);

% Solve for gamma from Modified Raoult's Law:
% gamma(i) = (y(i)*P(i))/(x(i)*Psat(i))
figure, hold all
for i = 1:2
  gammaVal(:,i) = (y(:, i).*P)./(x(:, i).*Psat(i));
  plot(x(:, 1), reallog(gammaVal(:, i)), plotType(i))
end
title('HW13: Q1(b) ')
xlabel('x1'), ylabel('ln(gamma)')
legend('Gamma 1', 'Gamma 2')

% Export list of values for grader
T1 = table(gammaVal(:,1), gammaVal(:,2), 'VariableNames',{'Gamma1', 'Gamma2'})


%% Question 2
clear all
plotType = 'xo';
% Import CSV data
M = csvread('num2.csv', 1);
x = M(:, 1); P = M(:, 2:3);

% Assume ideal gas
% P1 + P2 = (y1 + y2)*P
Ptot = P(:, 1) + P(:, 2);
figure, hold all
for i = 1:2
  y(:, i) = P(:, i)./Ptot;
end
plot(x(:, 1), Ptot, 'x'), plot(y(:, 1), Ptot, 'o:')
title('HW13: Q2(a) ')
xlabel('x1, y1'), ylabel('P (Torr)')
legend('P-x1', 'P-y1')

% Find x2 based off of x1, where x1 + x2 = 1
x(:, 2) = 1 - x(:, 1);

% Solve for gamma from Modified Raoult’s Law:
% gamma(i) = (y(i)*P(i))/(x(i)*Psat(i))
figure, hold all
Psat = [P(length(x), 1), P(1, 2)];
for i = 1:2
  disp(['Psat' num2str(i) ' = ' num2str(Psat(i))])
  gammaVal(:,i) = (y(:, i).*Ptot)./(x(:, i).*Psat(i));
  plot(x(:, 1), gammaVal(:, i), plotType(i))
end
title('HW13: Q2(b) ')
xlabel('x1'), ylabel('Gamma Coefficient')
legend('Gamma 1 - x1', 'Gamma 2 - x1')

% Export list of values for grader
T2 = table(y(:, 1), Ptot, gammaVal(:,1), gammaVal(:,2), 'VariableNames',{'y1', 'Ptotal', 'Gamma1', 'Gamma2'})