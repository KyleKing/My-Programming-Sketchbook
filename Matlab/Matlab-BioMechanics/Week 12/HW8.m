% % Kyle King
% % HW8
% % BIOE404
% % Section 0103
% % 12-05-2014

clc, clear all % boilerplate

% Given Global Constants
r = 4;                   % Radius (mm)
h = 4;                   % h=Height (mm)
area = pi*r^2;         % Area of plug
Ha = 2;                 % 2 MPa
orig_Ko = 1e-15;      % m^4/N-s
Ko = orig_Ko*(1e12); % convert to mm^4/N-s

%% Part A.
disp(['Part A:'])
% Set constants based on problem-statement
F = 75;                 % N
stressApp = F/area;    % N/mm^2
interval = 20000;      % s
time = 0:interval;      % time array
strt = 0;                % Only for Creep Calculation
estMax = 5;             % Hint from TA for summation estimation

% Find Uj based on top surface using creep function file
Xjt = h; % top
[ut_a] = linearBiphasicModelCreep(time, h, stressApp, Ha, Ko, strt, Xjt, estMax);

% Find Uj based on mid-height surface
Xjm = h/2; % mid-height
[um_a] = linearBiphasicModelCreep(time, h, stressApp, Ha, Ko, strt, Xjm, estMax);

% Plot them
figure, hold all, plot(time, ut_a), plot(time, um_a)
xlabel('Time (s)'), ylabel('Displacement (mm)'), title('Displacement versus time of top surface and the mid-height of the specimen'), legend('Top Surface Displacement','Mid-Height Displacement')

% Evaluate the difference in displacements at t = 500s
t_eval = 500;
FiveHundredComp = ut_a(t_eval) / um_a(t_eval);
if (FiveHundredComp ==  2)
    disp('As expected in a uniform material, the displacement of the top is twice the displacement at the mid-height.')
else
    disp(['The displacement of the top surface is NOT twice the displacement at the mid-height.' 10 'This means that the material is not uniform. The actual displacement comparison is a factor of ' num2str(FiveHundredComp)])
end

%% Part B.
disp([10 'Part B:'])
% Set constant K0's based on problem-statement
Ko_b = [Ko*10, Ko, Ko/10];

figure, hold all
for i = 1:length(Ko_b)
    % Calculate Creep and plot
    [uj] = linearBiphasicModelCreep(time, h, stressApp, Ha, Ko_b(i), strt, Xjt, estMax);
    plot(time, uj)
end
xlabel('Time (s)'), ylabel('Displacement (mm)'), title('Displacement With Variable Ko'), legend('Ko = 1e-14 m^4/N-s','Ko = 1e-15 m^4/N-s (Normal)','Ko = 1e-16 m^4/N-s')

disp(['The larger the K0 value, the faster the tissue deforms, as seen on the graph. K0 represents fluid permeability, ' 10 'which determines how closely the tissue resembles a dashpot. The closer K0 is to 0, the faster the fluid ' 10 'permeates the tissue and the faster the tissue compresses. This means that a K0 value of 0 would resemble ' 10 'a perfect dashpot with no fluid permeability, while a K0 closer to 1 would more closely represent a spring.'])

%% Part C.
disp([10 'Part C:'])
% Set constants based on problem-statement
t0 = 2; % s
t = [500, 5000]; % s
vo = 1/t0; % mm/s
strt = 1;

figure, hold all
for i = 1:length(t)
    % Calculate the relaxation
    [uj, Xj] = linearBiphasicModelRelax(t0, t(i), vo, h, Ha, Ko, strt, estMax);
    plot(Xj, uj)
    % Store values for part D
    uj_c(i, :) = uj; Xj_c(i, :) = Xj;
end
xlabel('Height (mm)'), ylabel('Displacement Uj (mm)'), title(['Stress Relaxation at Various Heights']), legend('t = 500 s', 't = 5,000 s')
% Answer to question
disp(['The material has reached equilibrium at 5,000 s because the slope is constant meaning that the displacement' 10 'is evenly shared between each section of the material. Over time, the displacement in the top section has ' 10 'evenly distributed throughout the material. Whereas at t = 500 s, the displacement is disproportionately  ' 10 'limited to only the top section.'])


%% Part D.
disp([10 'Part D:' 10 'The predicted stress that would be measured at the top of the specimen at: '])
% Calculate Stress Applied at the top for both time points
for i = 1:length(t)
    % rate of change of displacement and position at top (end)
    du_t = uj_c(i, end) - uj_c(i, end-1);
    dx_t = Xj_c(i, end) - Xj_c(i, end-1);
    % Find stress applied
    stressApp_td(i) = Ha*(du_t/dx_t);
    disp(['t = ' num2str(t(i)) 's is ' num2str(stressApp_td(i)) ' MPa'])
end

figure, hold all
for i = 1:length(t)
    for j = 2:length(uj_c)
        % rate of change of displacement and position at pointer value j
        du_m(i, j) = uj_c(i, j) - uj_c(i, j-1);
        dx_m(i, j) = Xj_c(i, j) - Xj_c(i, j-1);
        % Find stress applied
        stressApp_d(i) = Ha*(du_m(i, j)/dx_m(i, j));
        % Calculate fluid pressure based on top pressure
        fluidPress(i, j) = stressApp_td(i) - stressApp_d(i);
    end
    plot(Xj_c(i, 2:end), fluidPress(i, 2:end))
    xlabel('Height (mm)'), ylabel('Fluid Pressure (MPa)'), title(['Fluid Pressure with Respect to Depth'])
end
legend('t = 500 s', 't = 5,000 s', 'location', 'SouthEast')