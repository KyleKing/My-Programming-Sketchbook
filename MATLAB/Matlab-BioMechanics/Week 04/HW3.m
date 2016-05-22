% Kyle King
% BIOE404
% Section 0103
% 9-29-2014

clc, clear all % boilerplate
warning('off');

% Global Variables
Grav = 9.8; % m/s^2 Gravity

%
% Declare values
%

% Alter time value
step = 0.01; % time step
for t = 0.2 : step : 0.4;
  count = (single(t/step) - 19);

  %
  % Upper Leg
  %
  Iulh = 0.25; % kg/m^2
  Aul = [0, 0, 0]; % rad/s^2
  Wul = [0, 0, 4]; % rad/s
  Oul = 0; % wrt vertical

  Rul = [0, -.58, 0]; % m
  Fulw = [0, -75, 0]; % N
  Rulw = [0, -0.26, 0]; % m

  %
  % Lower Leg
  %
  Illk = 0.2; % kg/m^2
  % Calculate the new angular velocity given new time duration
  Ooll = -90 * pi/180;
  Ofll = -15 * pi/180;
  AlphaLL = [0, 0, (((Ofll - Ooll)*2)/t^2)]; % rad/s^2
  Wll = AlphaLL*t; % rad/s
  Oll = 15; % wrt vertical

  Lll = .50; % m
  Rll = -Lll*[sind(Oll), cosd(Oll), 0];
  Fllw = [0, -45, 0]; % N
  Rllw = [-0.3*sind(Oll), -0.3*cosd(Oll), 0]; % m

  % Find the force of the patella tendon (Fpt) at:
  syms Fjrh Fiskx Fisky Fiskz Fpt;
  Ollpt = 45; % degrees wrt horizontal
  Rkpt = 0.05; % m
  % The inter-segmental force at the knee (Fisk)
  % The joint reaction force at the hip (Fjrh)

  %
  %
  % Start at the lower leg
  %
  %

  % Find Normal and Tangential acceleration of the upper leg
  Atangk = cross(-Rul, Aul);
  Anormk = -Rul.*(norm(Wul))^2;
  % Combine to find the translating motion of the knee
  Ak = Atangk + Anormk;
  % Find Normal and Tangential acceleration of the lower leg
  Atangll = cross(-Rllw, AlphaLL);
  Anormll = -Rllw.*(norm(Wll))^2;
  % Combine to find the translating motion of the knee
  Allnt = Atangll + Anormll;

  % Net angular acceleration on the lower leg
  All = Ak + Allnt;

  % Moment forces created affecting K
  nMllk = Illk*AlphaLL;
  Mwll = cross(Rllw, Fllw); % Find moment due to weight
  Mfpt = [0, 0, Rkpt*Fpt]; % using given perpendicular direction and symbolic force

  % Solve for the net moment of the lower leg at point K
  tempFpt = solve(nMllk == Mwll + Mfpt, Fpt); tempFpt = double(tempFpt); % Decrease precision
  Fpt = [tempFpt*cosd(Ollpt), tempFpt*sind(Ollpt), 0]; % put into vector form given angle wrt horizontal

  % Solve for the net forces of the lower leg at point K
  nFll = (norm(Fllw)/Grav).*All;
  aFisk = [Fiskx, Fisky, Fiskz]; % Use an (a) array format

  % Solve for the three directions of the inter-segmental force at the knee
  for i = 1:3
    solFisk(i) = solve(nFll(i) == Fpt(i) + Fllw(i) + aFisk(i), aFisk(i));
    tempFisk(i) = solFisk(i);
  end
  Fisk = double(tempFisk); % Clean up the numbers

  %
  %
  % Evaluate the upper leg
  %
  %
  Mh = cross(Rul, Fisk);
  Fjrh = Fisk - Fulw;

  % Log data for plotting
  FptLog(count) = norm(Fpt);
  FjrhLog(count) = norm(Fjrh);
  FiskLog(count) = norm(Fisk);
  T(count) = t; % Save time values for plotting
end

%
%
% Report
%
%
% Plot results
figure(1), hold all, plot(T, FptLog), plot(T, FjrhLog), plot(T, FiskLog),...
 legend('Quadriceps Force (Fq)', 'Inter-Segmental Force at the Hip (Fjrh)', 'Joint Reaction Force at the Knee (Fisk)', 'Location', 'SouthWest'),...
    title('Force Compared to Kicking Time Duration')
  xlabel('time (second) '),  ylabel('Force (N)')

% Tabulate data
tM = table(T', FptLog', FjrhLog', FiskLog');
% tM.Properties.VariableUnits = {'*', 'N', 'N'};
tM.Properties.VariableNames{'Var1'} = 'Seconds';
tM.Properties.VariableNames{'Var2'} = 'Fpt';
tM.Properties.VariableNames{'Var3'} = 'Fjrh';
tM.Properties.VariableNames{'Var4'} = 'Fisk';
disp(tM)

