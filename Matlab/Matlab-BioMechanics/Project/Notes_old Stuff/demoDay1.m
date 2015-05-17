clc, clear all, close all % boilerplate


% Parse and import data

% Pick File
[Name, Path] = uigetfile('.txt');
filename = strcat(Path, Name);
% filename = '/Users/kyleking/Documents/Developer/__Matlab/Matlab-Physiology/Lab 3/data.txt';
fileID = fopen(filename,'r');

% Format data to be read
formatSpec = '%f%f%f';
sizeA = [3 Inf];
A = fscanf(fileID,formatSpec,sizeA); % Read data
fclose(fileID); % close file


% For loop
origin = 90; % point of reference for origin condition
for theta = 1:90
  current_angle = origin - theta;


  %% Replace with accurate data and location (remove /2 later on)
  weight_arm = [0, -30, 0];



  % Calculate position vectors based on new theta
  arm_direction = [sind(current_angle), cosd(theta), 0];



  %% Add calculation for arm moving



  % Solve for known moments
  Moment_of_weight = cross((arm_direction/2), weight_arm);

  % Solve for force at the joint
  force_elbow_reaction = -(arm_direction.*weight_arm)/2;

  % Store data in arrays for graphing
  angle_range(theta) = current_angle; % index theta for x-axis
  moments(theta) = norm(Moment_of_weight);
  force_elbow_reactions(theta) = norm(force_elbow_reaction);
end

% Tabulate data
tM = table(angle_range', force_elbow_reactions', moments');
% tM.Properties.VariableUnits = {'*', 'N', 'N'};
tM.Properties.VariableNames{'Var1'} = 'Theta';
tM.Properties.VariableNames{'Var2'} = 'Fjre';
tM.Properties.VariableNames{'Var3'} = 'Mjre';
disp(tM)

% Plot results
figure(1), hold all, plot(angle_range, moments), plot(angle_range, force_elbow_reactions),...
 legend('Moment at elbow', 'Joint Reaction Force at Elbow'),...
    title('Force Compared to Angle of\theta')
  xlabel('\theta (degrees)'),  ylabel('Force (N)')