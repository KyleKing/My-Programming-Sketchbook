%% Question 4
clear all
disp(['Question 4'])

% Part a:
% Proton - Neutron - Electron
MassT = 6*1.007276 + 6*1.008665 + 6*0.000548; % (u - unified atomic mass units)
MassActual = 12; % (u)
MassDefect = abs(MassActual - MassT); % (u)
disp(['The Mass Defect = ', num2str(MassDefect), 'u'])
% Part b:
% c = 299792458; % (m/s)
% E = MassDefect*c^2; % (u*c^2)
conversionFactor = 931; % (MeV/u*c^2)
BindingEnergy = MassDefect*conversionFactor; % (MeV)  [E = mc^2]
disp(['The Binding Energy = ', num2str(BindingEnergy), ' MeV'])


%% Question 5
clear all
disp(['Question 5'])

% N = N0*exp(-lambda*t)
% Half life is where: N/N0 = 1/2
% Solve for Lambda = -t*log(1/2)
% X:
lambdaX = -log(.5)/28; % hr^-1
disp(['lambdaX = ', num2str(lambdaX), ' per hour'])
% Y:
lambdaY = -log(.5)/68; % day^-1
disp(['lambdaY = ', num2str(lambdaY), ' per day'])