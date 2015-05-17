function [storage, loss, delta] = storeloss(stressA, strainA, spacing, period)
% stressA/strainA are the max stress or strain respectively (amplitude)
% spacing is the time distance between the stress and strain curve, used to calculate delta
% Period if the time between peaks
%
% Also see HW7.m
  delta = 2*pi*(spacing/period);
  % Storage modulus = E', G' = (stress)/(strain)*cosine(delta)
  storage = (stressA/strainA)*cos(delta);
  % Loss modulus = E', G' = (stress)/(strain)*sine(delta)
  loss = (stressA/strainA)*sin(delta);
end