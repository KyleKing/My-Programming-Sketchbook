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

[Name,Path]= uigetfile('*.xlsx')%opens browser file, allows you to read what you want
%Save data on excel for ECG
filename=strcat(Path,Name);
Shiri_Data_Version2=xlsread (filename); %Takes data from excel sheet

%% Parse data
%

At = Shiri_Data_Version2(:,1); Ax = Shiri_Data_Version2(:,2); Ay = Shiri_Data_Version2(:,3);
Bt = Shiri_Data_Version2(:,1); Bx = Shiri_Data_Version2(:,4); By = Shiri_Data_Version2(:,5);
Ct = Shiri_Data_Version2(:,1); Cx = Shiri_Data_Version2(:,6); Cy = Shiri_Data_Version2(:,7);

%Plot all
% figure
% subplot(2, 2, 1), hold all, plot(At, Ax), plot(At, Ay)
% subplot(2, 2, 2), hold all, plot(Bt, Bx), plot(Bt, By)
% subplot(2, 2, 3), hold all, plot(Ct, Cx), plot(Ct, Cy)

%
%% Data Clean Up
%
% Average times sets
t = (At + Bt + Ct)./3;
% Find distance in x and y
x = Cx - Bx;
y = Cy - By;

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
  vel(i,1) = dtheta/dt;% Find the angular velocity

  acc(i,1) =  vel(i,1) - vel(i-1,1); % Find the angular acceleration

  sum_vel = sum_vel + vel(i);
  sum_acc = sum_acc + acc(i);
end

avg_vel = sum_vel/(i-1); % rad/s
avg_acc = sum_acc/(i-1); % rad/s


% For loop
origin = 90; % point of reference for origin condition
for theta = 1:90
  current_angle = origin - theta;


  %% Replace with accurate data and location (remove /2 later on)
  weight_arm = [0, -30, 0];



  % Calculate position vectors based on new theta
  arm_direction = [sind(current_angle), cosd(theta), 0];

  %%
  %%
  %%
  %%

  % Solve for known moments
  Moment_of_weight = cross((arm_direction/2), weight_arm);

  % Solve for force at the joint
  force_elbow_reaction = -(arm_direction.*weight_arm)/2;

  % Store data in arrays for graphing
  angle_range(theta) = current_angle; % index theta for x-axis
  moments(theta) = norm(Moment_of_weight);
  force_elbow_reactions(theta) = norm(force_elbow_reaction);
end

 %% Add calculation for arm moving
  %Calculate the intersegmental force and moment at the elbow
mass_EH=0.854; % in kg
I=0.003719; % in kg*m^2
Intersegmental_Moment_about_Elbow=(I*avg_acc)-Moment_of_weight %N-m?
Intersegmental_Force_at_Elbow=(mass_EH*avg_acc)-weight_arm %N


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