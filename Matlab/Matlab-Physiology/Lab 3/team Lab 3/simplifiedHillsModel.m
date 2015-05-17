function [P,Lse,Lce] = simplifiedHillsModel(L,t)
% Take length and time data from lab and generate and expected curve
%
% See also trial1.m

  % % For testing
  % L = 30
  % t = linspace(0, 5, 10);

  % Given Constants from Lab 3 Presentation
  a = (380*0.098);
  b = 0.325;
  P0 = a/0.257;
  alpha = P0/0.05;
  Lse0 = 0.3*L;
  Lce0 = L-Lse0;

  % Initialize Data with constants for for loop
  Lse = linspace(Lse0, Lse0, length(t));
  Lce = linspace((1 - Lse0), (1 - Lse0), length(t));
  P = zeros(length(t), 1);

  % Use counter variable j
  for j = 1:(length(t)-1)
    % Solve for lengths
    Lse(j) = Lse0 + P(j)/alpha;
    Lce(j) = L - Lse(j);
    dL = 0; % always constant
    % dL = L(j+1) - L(j);
    % Get time step
    dt = t(j+1) - t(j);
    % Find force using given equation
    dP = -alpha*dt*((b*(P(j) - P0))/(P(j) + a));
    % dP = alpha*dt*((dL/dt) + (b*((P(j) - P0)/(P(j) + a))));
    P(j+1) = P(j) + dP;
  end

  % One more step
  j = j+1;
  Lse(j) = Lse0 + P(j)/alpha;
  Lce(j) = L - Lse(j);

end