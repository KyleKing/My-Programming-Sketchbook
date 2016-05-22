clc, clear all % boilerplate

% Lengths
Lhk = 0.58; % in m
Lka = 0.52; % in m

% Weights
Whk = [0, -80, 0]; % in N
Wka = [0, -40, 0]; % in N

for theta = 1:1:60

  % translate length into vector
  Rhk = [Lhk*sind(theta), -Lhk*cosd(theta), 0];
  Rka = [Lka*sind(theta), -Lka*cosd(theta), 0];

  % calculate moment created by Weights at hip
  Mhk = cross((Rhk.*(1/2)), Whk);
  Mka = cross((Rhk + Rka.*(2/3)), Wka); % for Mh
  % calculates moment for hip moment forces
  Mh(theta, :) = -(Mhk+ Mka);

  % calculate moment created by Weights at knee
  kMka = cross((Rka.*(2/3)), Wka); % for Mk
  % calculates moment for knee moment forces
  Mk(theta, :) = -kMka.*[1, 1, 1];

  % Solve for part A
  if (theta == 30)
    partA = Mh(theta, :);
  end

  % Solve for part B - cheater scenario
  if (theta == 60)
    cheaterTheta = theta - 5;
    cheaterRka = [Lka*sind(cheaterTheta), -Lka*cosd(cheaterTheta), 0];
    cheaterMka = cross((Rhk + cheaterRka.*(2/3)), Wka);
    cheaterMh = [0, 0, -(Mhk(3) + cheaterMka(3))];
  end
end

% Calculate reaction forces
Fh = -(Whk + Wka);
Fk = -Wka;


% Display answer to Part A
disp(['Answer to Part A:' 10 'The Moment around H is ' num2str(partA(1)) 'i + ' num2str(partA(2)) 'j + ' num2str(partA(3))...
    'k (Nm)' 10 'The Reaction Force at H is ' num2str(Fh(1)) 'i + ' num2str(Fh(2)) 'j + ' num2str(Fh(3)) 'k (N)'])
disp(['The Moment around K is ' num2str(Mk(30, 1)) 'i + ' num2str(Mk(30, 2)) 'j + ' num2str(Mk(30, 3)) 'k (Nm)' 10 'The Reaction Force at K is '...
    num2str(Fk(1)) 'i + ' num2str(Fk(2)) 'j + ' num2str(Fk(3)) 'k (N)'])

% Display Answer to Part B
disp([10 'Answer to Part B:' 10 'The intersegmental force at the hip, then at the knee:' 10])
theta = linspace(1,60,60);

% Plot both lines on the same graph with labels and a legend
figure(1), hold all, plot(theta, Mh(:, 3)), plot(theta, Mk(:, 3)), legend('Moment Force at the Hip (H)', 'Moment Force at the Knee (K)'),...
    title('Moment Force Compared to Angle of\theta')
  xlabel('\theta (degrees)'),  ylabel('Moment Force (Nm)')

% Tabulate data
tM = table(theta', Mh(:, 1), Mh(:, 2), Mh(:, 3), Mk(:, 1), Mk(:, 2), Mk(:, 3));
tM.Properties.VariableUnits = {'*', 'Nm', 'Nm', 'Nm', 'Nm', 'Nm', 'Nm'};
tM.Properties.VariableNames{'Var1'} = 'Theta';
tM.Properties.VariableNames{'Var2'} = 'i_hip';
tM.Properties.VariableNames{'Var3'} = 'j_hip';
tM.Properties.VariableNames{'Var4'} = 'k_hip';
tM.Properties.VariableNames{'Var5'} = 'i_knee';
tM.Properties.VariableNames{'Var6'} = 'j_knee';
tM.Properties.VariableNames{'Var7'} = 'k_knee';
disp(tM)

% Display answer to Part C
disp(['Answer to Part C:' 10 'The new Moment around H is ' num2str(Mh(60, 3) - cheaterMh(3)) ...
    ' Nm less than when compared to the non-cheating moment' 10 'The Reaction Force at H is unaffected and is still '...
    num2str(Fh(1)) 'i + ' num2str(Fh(2)) 'j + ' num2str(Fh(3)) 'k (N)' 10])