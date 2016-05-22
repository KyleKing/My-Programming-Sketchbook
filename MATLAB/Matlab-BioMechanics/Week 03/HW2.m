% Constants at origin position (theta = 90)
clc, clear all % boilerplate

% For loop
originTheta = 90; % point of reference for origin condition
for theta = 0:1:45
  thetaIndex = theta + 1;

  % Known Forces
  Fw = [0, -30, 0]; % weight
  % find cable force in vectors
  thetaCable = 30; % always constant
  FcableSet = 100;
  Fcable = [sind(thetaCable), cosd(thetaCable), 0].*FcableSet;

  % Given position vectors
  ret = [-2, 14, 0]; % always constant
  reo = [-2.5, -3, 0];
  rehSet = [35, 0, 0];
  rewSet = (2/3).*rehSet;

  % recalculate position vectors based on new theta
  reh = [sind(theta), -cosd(theta), 0].* norm(rehSet);
  rew = [sind(theta), -cosd(theta), 0].* norm(rewSet);
  % Using extra angle, map the change in theta to recalculate the position vector reo
  phi = (180/pi) * atan(reo(1)/reo(2));
  deltaTheta = originTheta-theta; % Find change in theta form origin
  % find new reo based on changing theta and constructed angle, phi
  reonew = norm(reo).*[-sind(phi + deltaTheta), -cosd(phi + deltaTheta), 0];
  rot = ret - reonew; % find direction of tricep muscle (-reonew = roenew)

  % Solve for known moments
  Mw = cross(rew, Fw);
  Mcable = cross(reh, Fcable);

  % Manually solve for Ft and sub it out of the Mtricep force
  % solving this symbolically didn't work inside the for loop, this manual effort is a workaround
  Mft = cross(reonew, rot/norm(rot)); % all multiplied by Ft
  for i = 1:3
    if (Mft(i) == 0) % because NaN is no fun #dividingByZero
      Ftricep(i) = 0;
    else
      Ftricep(i) = (Mw(i) + Mcable(i)) / Mft(i);
    end
  end

  FtricepNew = Ftricep(3).*(reonew/norm(reonew));

  % Solve for force at the joint
  Fjrfe = Fw + FtricepNew + Fcable;

  % Store data in arrays for easier graphing
  FtricepLOG(thetaIndex) = norm(Ftricep); % index normalized tricep force for plot
  FjrfeLOG(thetaIndex) = norm(Fjrfe); % index rxn force for plot
  thetaLOG(thetaIndex) = theta; % index theta for x-axis
end

% Tabulate data
tM = table(thetaLOG', FtricepLOG', FjrfeLOG');
% tM.Properties.VariableUnits = {'*', 'N', 'N'};
tM.Properties.VariableNames{'Var1'} = 'Theta';
tM.Properties.VariableNames{'Var2'} = 'Fjrfe';
tM.Properties.VariableNames{'Var3'} = 'Ft';
disp(tM)

% Plot results
figure(1), hold all, plot(thetaLOG, FtricepLOG), plot(thetaLOG, FjrfeLOG),...
 legend('Force by Tricep at O (Ft)', 'Joint Reaction Force at the Elbow (Fjrfe)'),...
    title('Force Compared to Angle of\theta')
  xlabel('\theta (degrees)'),  ylabel('Force (N)')