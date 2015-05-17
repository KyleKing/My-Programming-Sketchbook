% BIOE404 Project
% Kyle King, Shiri Brodsky, Kristina Dziki
% 11-17-2014

%% Import data

% Boilerplate
clc, clear all, close all

% Pick File
% [Name,Path] = uigetfile('*.xlsx');
% filename = strcat(Path,Name);

% Shorter file call method
Name = 'Shiri Data.xlsx';
currentFolder = pwd;
filename = strcat(currentFolder, '/', Name);

% filename = '/Users/kyleking/Documents/Developer/__Matlab/Matlab-BioMechanics/Project/Shiri Data.xlsx';
Shiri_Data = xlsread (filename); %Takes data from excel sheet

% Parse data
t = Shiri_Data(:,1);
Ax = Shiri_Data(:,2); Ay = Shiri_Data(:,3);
Bx = Shiri_Data(:,4); By = Shiri_Data(:,5);
Cx = Shiri_Data(:,6); Cy = Shiri_Data(:,7);

% % Plot all
% figure
% subplot(2, 2, 1), hold all, plot(At, Ax), plot(At, Ay)
% subplot(2, 2, 2), hold all, plot(Bt, Bx), plot(Bt, By)
% subplot(2, 2, 3), hold all, plot(Ct, Cx), plot(Ct, Cy)

%% Data Clean Up

% Find vector components of BC
x = Cx - Bx;
y = Cy - By;

% % Plot to see what is going on
% figure, hold all
% plot(t, x), plot(t, y)

% Find angle of lower arm from horizontal
thetas = atan(y./x);
% plot(t, thetas)

% Initialize variables
sum_vel = 0; sum_acc = 0; vel(1,1) = 0;

%% Find the angular velocity and acceleration
for i = 2:length(thetas)
  % Find change in angle and time
  dt = t(i) - t(i-1);
  dthetas = thetas(i - 1) - thetas(i);
  vel(i,1) = dthetas/dt; % Find the angular velocity

  acc(i,1) =  vel(i,1) - vel(i-1,1); % Find the angular acceleration

  % take summation of both values for average later
  sum_vel = sum_vel + vel(i);
  sum_acc = sum_acc + acc(i);
end

% take averages
avg_vel = sum_vel/(i-1); % rad/s
avg_acc = sum_acc/(i-1); % rad/s

% Initialize point of reference for origin condition
% Arm info
length_arm = 0.22; % m
COM_arm = (1/2)*length_arm; % meters - estimation supported by reference
mass_EH = 1.127; % in kg


%% Update with new mass - show calculations lol
I = 0.00491; % in kg*m^2


% Racket
mass_racket = 0.275; % kilogram
length_racket = 0.69; % meter
COM_racket = (2/3)*length_racket;
% Total mass of arm with racket
mass_net = mass_EH + mass_racket;
Fw = [0, -mass_net*9.81, 0]; % N


%% Non-permanent variables, Super need to be replaced real quick y'all
r_mcl = [0.005, 0.02, 0];
u_mcl = [sqrt(2)/2, sqrt(2)/2, 0];



%% Test impact of end angle in swing on inter segmental force
for theta = 90:-1:0
  count = 91-theta; % Counter variable
  angle_range(count) = theta; % index theta for x-axis

  % Calculate COM and new position vector for new theta angle
  com_net = ( COM_arm*mass_EH + (length_arm+COM_racket)*mass_racket ) / mass_net;
  com_loc = [cosd(theta), sind(theta), 0].*com_net;

  % Calculate components of acceleration
  atang(count, :) = cross(-com_loc, [0, 0, avg_acc]);
  anorm(count, :) = -com_loc.*norm((avg_acc*angle_range(count)).^2);
  atotal(count, :) = atang(count, :) + anorm(count, :);

  % Solve for inter segmental moment
  M_net = [0, 0, I*avg_acc];
  M_arm_racket_w = cross(com_loc, Fw);
  Intersegmental_Moment_about_Elbow = (M_net) - M_arm_racket_w; %N-m
  F_mcl = Intersegmental_Moment_about_Elbow/cross(r_mcl, u_mcl);

  % Solve for inter segmental force at the elbow
  F_jrf = (mass_net*atotal(count, :)) - Fw - F_mcl; %N

  % Store data in arrays for graphing
  force_elbow_reactions(count) = norm(F_jrf);
  moments(count) = norm(Intersegmental_Moment_about_Elbow);
  F_mcl_graph(count) = norm(F_mcl);

  % [com_loc, M_arm_racket_w]

end

% Plot results
figure, subplot(2,2,1), hold all
plot(angle_range(2:end), force_elbow_reactions(2:end))
title('Inter-segmental Force at Elbow as Function of \theta')
xlabel('\theta (degrees above horizontal)'), ylabel('Force (N)')

subplot(2,2,2), plot(angle_range, moments)
title('Inter segmental Moment at Elbow as Function of \theta')
xlabel('\theta (degrees above horizontal)'), ylabel('Moment (N*m)')


theta_step = 0;
for t = 0:15
  % Oh, it is a linear equation!
  count = t+1;
  velocity(count) = avg_acc*t;
  theta_step(count+1) = velocity(count)*180/pi*1; % current velocity * conversion factor (deg/rad) * time step (1 sec)
  theta_time(count) = theta_step(count+1) + theta_step(count);
end

subplot(2,2,3), plot(flip(angle_range), avg_acc*angle_range)
title('Sample Graph of Velocity')
xlabel('\theta'), ylabel('rotational velocity')

subplot(2,2,4), plot(angle_range(2:end), F_mcl_graph(2:end))
title('Fourth Data Set')
xlabel('\theta (degrees above horizontal)'), ylabel('F_m_c_l (N)')

% % Tabulate data
% tM = table(angle_range', force_elbow_reactions', moments');
% tM.Properties.VariableUnits = {'*', 'N', 'Nm'};
% tM.Properties.VariableNames{'Var1'} = 'Theta';
% tM.Properties.VariableNames{'Var2'} = 'Fjre';
% tM.Properties.VariableNames{'Var3'} = 'Mjre';
% disp(tM)