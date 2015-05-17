%% creep test
filename = '/Users/kyleking/Documents/Developer/__Matlab/Matlab-BioMechanics/Week 11/BIOE404-F14-HW7data.csv';
A=csvread(filename, 1, 0);
healthy=A(:,2);
unhealthy=A(:,3);
time=A(:,1);
plot(time,healthy)
hold on
plot(time, unhealthy, 'r')
hold off
title('healthy and unhealthy cartilage tissue strain');
xlabel('time seconds');
ylabel('strain');

curvefit(time, healthy, unhealthy)

%% #2 

% a) the time scales of test 1 and test 2 differ, as test 1 has cyclic
% loading, positive and negative directions every 1.25 seconds. Test 2 on
% the other hand has a period of 0.6 seconds. Therefore, even though the
% specimen may be the same, the rate of load application indicates that
% test 2 was done at a much faster pace than test 1. Test 2 has double the
% frequency of test 1.

% b) Storage modulus = E' G' = (stress)/(strain)*cosine(delta) 
% Loss modulus = E'' G'' = (stress)/(strain)*sine(delta) 
% where delta = the phase shift between stress and strain. A perfectly 
% elastic sample will have a delta = 0 while a perfectly viscous sample 
% will have a delta = pi/2. 
%
%
%
% test 1
% storage modulus = E' G' = (6MPa)/(0.03) * cosine(2*pi / 6) = 100MPa
% loss modulus = E'' G'' = (6MPa)/(0.03) * sine(2*pi / 6) = 173.2MPa
%
%
% test 2
% storage modulus = E' G' = (12MPa)/(0.03) * cosine(pi / 6) = 346.41 MPa
% loss modulus = E'' G'' = (12MPa)/(0.03) * sine(pi / 6) =  200MPa
%
% c)  test 1 has a greater viscous contribution, while test 2 has a greater
% elastic contribution.