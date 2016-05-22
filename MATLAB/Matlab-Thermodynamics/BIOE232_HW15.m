clc, clear all, close all
% Declare Variables in rows
H2O = [1, 3.470, 1.450e-3, 0, 0.121e5];
CH2CH2 = [1, 1.424, 14.394e-3, -4.392e-6, 0];
CH3CH3 = [-1, 1.131, 19.225e-3, -5.561e-6, 0];
O2 = [-0.5, 3.639, 0.506e-3, 0, -0.227e5];
% Sort by column
all = [H2O', CH2CH2', CH3CH3', O2'];
u = all(1,:); A = all(2,:); B = all(3,:); C = all(4,:); D = all(5,:);

% Integrate in two steps. First, the positive part:
T = 1100; part1 = 0;
for i = 1:4
  part1 = part1 + u(i) * ( A(i)*T + (B(i)*T^2)/2 + (C(i)*T^3)/3 - D(i)/T );
end
% Then the negative part:
T = 298; part2 = 0;
for i = 1:4
  part2 = part2 + u(i) * ( A(i)*T + (B(i)*T^2)/2 + (C(i)*T^3)/3 - D(i)/T );
end
% Sum and find delta H_1100
answer = 8.314*(part1 - part2) -104860