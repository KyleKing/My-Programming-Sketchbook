function [P,Lse,Lce] = simplifiedHillsModel(L,t)
% Take length and time data from lab and generate and expected curve
%
% See also trial1.m and ...

  % % For testing
  % L = linspace(24, 24, 10);
  % t = linspace(0, 5, 10);

  % Account for single L-value
  if length(L) == 1
    L = linspace(L,L,length(t));
  end

  % Given Constants from Lab 3 Presentation
  a = (380*0.098);
  b = 0.325;
  P0 = a/0.257;
  vm = P0 * b / a;
  alpha = P0/0.1;
  Lse0 = 0.3;

  % Initialize Data with constants for for loop
  % Lse = linspace(Lse0, Lse0, length(t));
  % Lce = linspace((1 - Lse0), (1 - Lse0), length(t));

  Lse = zeros(length(t), 1);
  Lce = zeros(length(t), 1);
  P = zeros(length(t), 1);

  % Use counter variable j
  for j = 1:(length(t)-1)
    % Solve for lengths
    Lse(j) = Lse0 + P(j)/alpha;
    Lce(j) = L(j) - Lse(j);
    dL = L(j+1) - L(j);
    % Get time step
    dt = t(j+1) - t(j);
    % Find force using given equation
    dP = alpha*dt*((dL/dt) + (b*((P(j) - P0)/(P(j) + a))));
    P(j+1) = P(j) + dP;
  end

  % One more step
  j = j+1;
  Lse(j) = Lse0 + P(j)/alpha;
  Lce(j) = L(j) - Lse(j);

  % % Play with plotting
  % figure
  % subplot(1, 2, 1), plot(t, P), legend('P')
  % subplot(1, 2, 2), hold all, plot(t, Lse), plot(t, Lce), legend('Lse','Lce')
  % plot(t, L)
end