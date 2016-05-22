% BIOE404 Project
% Kyle King, Shiri Brodsky, Kristina Dziki
% 11-17-2014

clc, clear all, close all % boilerplate

%
%% Import data
%

% % Pick File
% [Name, Path] = uigetfile('.csv');
% filename = strcat(Path, Name);
filenameA = '/Users/kyleking/Documents/Developer/__Matlab/Matlab-BioMechanics/Project/A.csv';
A = csvread(filenameA, 1, 0);
filenameE = '/Users/kyleking/Documents/Developer/__Matlab/Matlab-BioMechanics/Project/E.csv';
E = csvread(filenameE, 1, 0);
filenameB = '/Users/kyleking/Documents/Developer/__Matlab/Matlab-BioMechanics/Project/B.csv';
B = csvread(filenameB, 1, 0);

%
%% Parse data
%

At = A(:,1); Ax = A(:,2); Ay = A(:,3);
Et = E(:,1); Ex = E(:,2); Ey = E(:,3);
Bt = B(:,1); Bx = B(:,2); By = B(:,3);

% % Plot all
% figure
% subplot(2, 2, 2), hold all, plot(At, Ax), plot(At, Ay)
% subplot(2, 2, 1), hold all, plot(Et, Ex), plot(Et, Ey)
% subplot(2, 2, 3), hold all, plot(Bt, Bx), plot(Bt, By)

%
%% Data Clean Up
%

% Average times sets
t = (Et + At + Bt)./3;
% Find distance in x and y
x = Bx - Ex;
y = By - Ey;

% % Plot the line of each arm...doesn't work lol
% figure, hold all
% for j = 1:length(t)
%   plot([Ex, Bx], [Ey, By])
% end



%%
%% Smooth Data - polyfit and data - fluctuation #lab2
%%

% % See what is going on
% figure, hold all
% plot(t, x), plot(t, y)

% Find angle of lower arm from horizontal
theta = atan(y./x);
% plot(t, theta)

% Find the angular velocity and acceleration
sum_vel = 0; sum_acc = 0; vel(1,1) = 0;
for i = 2:length(theta)
  % Find change in angle and time
  dt = t(i) - t(i-1);
  dtheta = theta(i - 1) - theta(i);
  vel(i,1) = dtheta / dt;% Find the angular velocity

  dvel(i,1) =  vel(i,1) - vel(i-1,1); % Find the angular acceleration
  acc(i,1) = dvel(i,1) / dt;

  sum_vel = sum_vel + vel(i);
  sum_acc = sum_acc + acc(i);
end

avg_vel = sum_vel/(i-1); % rad/s
avg_acc = sum_acc/(i-1); % rad/s

% % See what is going on
% figure, hold all
% plot(t, vel), plot(t, acc)


% For loop
origin = 90; % point of reference for origin condition
for theta = 1:90
  current_angle = origin - theta;




  %% Replace with accurate location?????
  mass_EH = 0.854;
  weight_arm = [0, -mass_EH, 0].*9.81; % Newtons




  % Calculate position vectors based on new theta
  arm_direction = [sind(current_angle), cosd(theta), 0];

  avg_vel = sum_vel/(i-1); % rad/s
  avg_acc = sum_acc/(i-1); % rad/s

  % %% Add calculation for arm moving
  % % Calculate the intersegmental force and moment at the elbow
  % mass_EH=0.854; % in kg
  % I=0.003719 % in kg*m^2
  % Intersegmental_Moment_about_Elbow=(I*avg_acc)-Moment_of_weight;
  % Intersegmental_Force_at_Elbow=(mass_EH*avg_acc)-weight_arm;

  % Solve for known moments
  Moment_of_weight = cross((arm_direction/2), weight_arm);

  % Solve for force at the joint
  force_elbow_reaction = -(arm_direction.*weight_arm)/2;

  % Store data in arrays for graphing
  angle_range(theta) = current_angle; % index theta for x-axis
  moments(theta) = norm(Moment_of_weight);
  force_elbow_reactions(theta) = norm(force_elbow_reaction);
end

% % Tabulate data
% tM = table(angle_range', force_elbow_reactions', moments');
% % tM.Properties.VariableUnits = {'*', 'N', 'N'};
% tM.Properties.VariableNames{'Var1'} = 'Theta';
% tM.Properties.VariableNames{'Var2'} = 'Fjre';
% tM.Properties.VariableNames{'Var3'} = 'Mjre';
% disp(tM)

% % Plot results
% figure, hold all, plot(angle_range, moments), plot(angle_range, force_elbow_reactions),...
%  legend('Moment at elbow', 'Joint Reaction Force at Elbow'),...
%     title('Force Compared to Angle of\theta')
%   xlabel('\theta (degrees)'),  ylabel('Force (N)')