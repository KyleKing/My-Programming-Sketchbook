% Kyle King
% BIOE404
% Section 0103
% 10-03-2014

clc, clear all % boilerplate

% % Global Variables
% iglo = [1,0,0];
% jglo = [0, 1, 0];
% kglo = [0,0,1];

%
% Declare values
%
rua = [0, -0.40, 0]; % m in local j direction

frameRate = 1/10; % 10 hz

ti = -frameRate;
M1pre =[100.0, 150.0, -250.0];
M1dur = [115.0, 155.0, -244.0];
M1aft = [128.0, 152.0, -251.0];

t0 = 0;
M2pre =[100.0, 150.0, -253.0];
M2dur = [114.6, 156.7, -246.4];
M2aft = [126.0, 154.3, -251.4];

tf = frameRate;
M3pre =[101.5, 147.4, -250.0];
M3dur = [116.2, 152.9, -245.7];
M3aft = [128.5, 152.0, -254.0];

%
% Part A:  Write local coordinate axis vectors at each of the data points.
%
% Pre, t = -1 s
% Solve for local in terms of global then normalize
ipre = M2pre - M1pre; ipre = ipre/norm(ipre);
jpre = M3pre - M1pre; jpre = jpre/norm(jpre);
kpre = cross(ipre, jpre); % Already a unit vector
% During, t = 0
idur = M2dur - M1dur; idur = idur/norm(idur);
jdur = M3dur - M1dur; jdur = jdur/norm(jdur);
kdur = cross(idur, jdur);
% After, t = 1 s
iaft = M2aft - M1aft; iaft = iaft/norm(iaft);
jaft = M3aft - M1aft; jaft = jaft/norm(jaft);
kaft = cross(iaft, jaft);

%
% Part B. Find the Orientation Matrices (M)
%
% Pre, t = -1 s
preM = [ipre' jpre' kpre']
% During, t = 0
durM = [idur' jdur' kdur']
% After, t = 1 s
aftM = [iaft' jaft' kaft']

%
% Part C. Calculate the rotation matrices governing the angular motion between data points (t-1 and t0, t0 and t+1).
%
% Start in 𝐑𝟏𝟐 ∙ 𝐌𝟏 = 𝐌𝟐 form then divide (transpose, since Orientation Matrix)
% t-1 and t0
Rpredur = durM*transpose(preM);
% t0 and t1
Rduraft = aftM*transpose(durM);

%
% Part D. In global coordinates, calculate the angular velocity vectors of the forearm (by finding the change in forearm angle per time increment) between t-1 and t0 and between t0 and t+1.
%
syms rPsi rTheta rPhi;


% !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
% Do for just the vector in the forearm direction
% !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

% Discussion notes (solve for velocity of lower limb:
% Solve before the loop
NpreM = norm(preM); NdurM = norm(durM); NaftM = norm(aftM);

for i = 1:3
  tempWpredur = dot(preM(:, i), durM(:, i));
  tempWduraft = dot(durM(:, i), aftM(:, i));
  solpre = solve(tempWpredur == abs(NpreM*NdurM)*cos(rTheta), rTheta);
  solaft = solve(tempWduraft == abs(NdurM*NaftM)*cos(rTheta), rTheta);
  posNWpre(i) = solpre(1);
  negNWpre(i) = solpre(2); % Not relevant
  posNWaft(i) = solaft(1);
  negNWaft(i) = solaft(2); % Not relevant
end

NWpre = double([posNWpre; negNWpre]);
NWaft = double([posNWaft; negNWaft]);

% Becuase leg is moving in j direction (i.e. i=2)
i = 2; % j-column
tempWpredur = cross(preM(:, i)', durM(:, i)');
Wpredur = tempWpredur.*NWpre(1,2)
tempWduraft = cross(durM(:, i)', aftM(:, i)');
Wduraft = tempWduraft.*NWaft(1,2)

% Find average of the velocities to find the acceleration direction
Adir = (tempWpredur + tempWduraft);
Adir = Adir./(2);
Adir = Adir/norm(Adir);

% Find acceleration magnitude
Amag = (norm(NWaft(1, :)) - norm(NWpre(1, :)))/(tf - ti);

% Find the acceleration
A = Adir.*Amag


% Angular Rotational Matrices
% Ri = [1, 0, 0; 0, cos(rPhi), -sin(rPhi); 0, sin(rPhi), cos(rPhi)];
% Rj = [cos(rTheta), 0, sin(rTheta); 0, 1, 0; -sin(rTheta), 0, cos(rTheta)];
% Rk = [cos(rPsi), -sin(rPsi), 0;  sin(rPsi), cos(rPsi), 0; 0, 0, 1];

% !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
% Rot = Ri*Rj*Rk; Why won't I get the right result? Rot = dot(dot(Ri,Rj),Rk)

% Solve for angles
% solve([-0.259, -0.966, 0; 0.966, -0.259, 0; 0, 0, 1] == Rk, [rPsi, rPhi, rTheta])
% Also not able to find the angle :(
% !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
% Calculate the angle....

%
% Part E. Now calculate the angular acceleration vector (again, in global coordinates) of the
  % forearm using the angular velocities. Take the direction of the angular acceleration vector
  % to be the average directions of the angular velocities.
%



%
% Part F. Suppose you are interested in the tangential acceleration of the pitcher’s hand at t0 due to
  % the angular motion of the forearm only. Calculate the tangential acceleration vector with respect to
  % the global coordinate system. Transform the tangential acceleration vector into its expression in the
  % local coordinate system at t0.
%


% Atang = cross(-rua, alphaua)




%
% Report
%
% Plot results
% figure(1), hold all, plot(T, FptLog), plot(T, FjrhLog), plot(T, FiskLog),...
%  legend('Quadriceps Force (Fq)', 'Inter-Segmental Force at the Hip (Fjrh)', 'Joint Reaction Force at the Knee (Fisk)', 'Location', 'SouthWest'),...
%     title('Force Compared to Kicking Time Duration')
%   xlabel('time (second) '),  ylabel('Force (N)')

% Tabulate data
% tM = table(T', FptLog', FjrhLog', FiskLog');
% tM.Properties.VariableUnits = {'*', 'N', 'N'};
% tM.Properties.VariableNames{'Var1'} = 'Seconds';
% tM.Properties.VariableNames{'Var2'} = 'Fpt';
% tM.Properties.VariableNames{'Var3'} = 'Fjrh';
% tM.Properties.VariableNames{'Var4'} = 'Fisk';
% disp(tM)