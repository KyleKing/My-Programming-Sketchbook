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
% Declare constants
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
disp('Part A.')
%
% Pre, t = -1 s
% Solve for local in terms of global then normalize
ipre = M2pre - M1pre; ipre = ipre/norm(ipre)
jpre = M3pre - M1pre; jpre = jpre/norm(jpre)
kpre = cross(ipre, jpre) % Already a unit vector
% During, t = 0
idur = M2dur - M1dur; idur = idur/norm(idur)
jdur = M3dur - M1dur; jdur = jdur/norm(jdur)
kdur = cross(idur, jdur)
% After, t = 1 s
iaft = M2aft - M1aft; iaft = iaft/norm(iaft)
jaft = M3aft - M1aft; jaft = jaft/norm(jaft)
kaft = cross(iaft, jaft)


%
% Part B. Find the Orientation Matrices (M)
disp('Part B.')
%
% Pre, t = -1 s
preM = [ipre' jpre' kpre']
% During, t = 0
durM = [idur' jdur' kdur']
% After, t = 1 s
aftM = [iaft' jaft' kaft']


%
% Part C. Calculate the rotation matrices governing the angular motion between data points (t-1 and t0, t0 and t+1).
disp('Part C.')
%
% Start in 𝐑𝟏𝟐 ∙ 𝐌𝟏 = 𝐌𝟐 form then divide (transpose, since Orientation Matrix)
% t-1 and t0
Rpredur = durM*transpose(preM)
% t0 and t1
Rduraft = aftM*transpose(durM)


%
% Part D. In global coordinates, calculate the angular velocity vectors of the forearm (by finding the change in forearm angle per time increment) between t-1 and t0 and between t0 and t+1.
disp('Part D.')
%
% Declare vars
syms angleNumber;
% Normalize each column of the orientation matrix
% Only considering the change in the linear motion of the arm (i.e. j dimension)
jpreM = preM(:,2)./norm(preM(:,2));
jdurM = durM(:,2)./norm(durM(:,2));
jaftM = aftM(:,2)./norm(aftM(:,2));
% Take the dot product of columns of original
tempWpredur = dot(jpreM, jdurM);
tempWduraft = dot(jdurM, jaftM);
% Solve for the angle using the theorem for dot product
% Note: magnitude of vectors will be one anyway
thetapre = solve(tempWpredur == cos(angleNumber), angleNumber);
thetaaft = solve(tempWduraft == cos(angleNumber), angleNumber);
% Then divide by time (r/s) and only want positive angle
rWpredur = double(thetapre(1)./frameRate);
rWduraft = double(thetaaft(1)./frameRate);

% Cross the j-unit-vectors to find the direction of omega
tempWpredur = cross(jpreM, jdurM)/norm(cross(jpreM, jdurM));
tempWduraft = cross(jdurM, jaftM)/norm(cross(jdurM, jaftM));

% Multiply the magnitude of omega by the direction
Wpredur = tempWpredur*rWpredur
Wduraft = tempWduraft*rWduraft


%
% Part E. Now calculate the angular acceleration vector (again, in global coordinates) of the forearm using the angular velocities. Take the direction of the angular acceleration vector to be the average directions of the angular velocities.
disp('Part E.')
%
% Find average of the velocities and normalize to get acceleration direction
Adir = (tempWpredur + tempWduraft)./(2);
Adir = Adir/norm(Adir);
% Find acceleration magnitude
Amag = abs((rWpredur-rWduraft)/(t0 - ti));
% Find the acceleration
A = Adir.*Amag


%
% Part F. Suppose you are interested in the tangential acceleration of the pitcher’s hand at t0 due to the angular motion of the forearm only. Calculate the tangential acceleration vector with respect to the global coordinate system. Transform the tangential acceleration vector into its expression in the local coordinate system at t0.
disp('Part F.')
% find the tangential acceleration by using the cross product or rxA, but first transform the unit vector of r along the j dimension at t0
Atang = cross(jdurM.*(-0.4), A);
% Transform back into local coordinates with a transposed Orientation Matrix
Atangdur = transpose(durM)*Atang


% Unused
% % Angular Rotational Matrices
% syms rPsi rTheta rPhi;
% Ri = [1, 0, 0; 0, cos(rPhi), -sin(rPhi); 0, sin(rPhi), cos(rPhi)];
% Rj = [cos(rTheta), 0, sin(rTheta); 0, 1, 0; -sin(rTheta), 0, cos(rTheta)];
% Rk = [cos(rPsi), -sin(rPsi), 0;  sin(rPsi), cos(rPsi), 0; 0, 0, 1];

% Rot = Rk*Rj*Ri;