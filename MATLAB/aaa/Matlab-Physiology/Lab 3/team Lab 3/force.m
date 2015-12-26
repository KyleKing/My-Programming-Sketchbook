function [ P ] = force( Tfin )
%UNTITLED2 Summary of this function goes here
%   Detailed explanation goes here

t = [0:1000:Tfin];
L = ones(length(t));

P = zeros(length(t));

for j = 1:length(t)-1
    dt = (t(j+1)-t(j));
    dL = (l(j+1)-L(j));
    dP = dL/dt;
    P(j+1) = P(j) + dP;
end

Lse = 0;
Lce = 0;

% Lse(j) =
% Lce(j) =



end

