% Question 2
% AIR Toolbox?
% http://www.imm.dtu.dk/~pcha/AIRtools/
% And files in downloads folder

% Back Projection:
  % Predict assuming each step is the same (i.e. assume that the mu is substituted with 4*mu0)
    % Start with vertical (BP_v)
    % Repeat for diagonal (BP_d)
    % Then repeat for horizontal (BP_h)
  % Sum each BP coordinate

% horizontal, the diagonal, and the vertical projections

clc, clear all
close all

detector_h = [0.3, 0.5, 0.1];

BP_func = @(x,a) ones(1,3).*-(log(x)/a);
BP_h = [];
for i = 1:3
  BP_h = [BP_h; BP_func(detector_h(i),3)];
end

BP_hv = @(b) exp(-BP_h(1,b) - BP_h(2,b) - BP_h(3,b))/4;
del_n_hv = @(a) -log(BP_hv(a)/detector_h(a)).*ones(3,1);
del_n_M = [];
for i = 1:3
  del_n_M = [del_n_M, del_n_hv(i)];
end

BP_est = BP_h + del_n_M;


% Part Two!

detector_d = [0.2, 0.3, 0.4, 0.3, 0.2];




% Part Three!

detector_v = [0.2, 0.6, 0.3];

BP_vh = @(b) exp(-BP_est(b,1) - BP_est(b,2) - BP_est(b,3))/4;
del_n_vh = @(a) -log(BP_vh(a)/detector_v(a)).*ones(1,3);
del_n_M = [];
for i = 1:3
  del_n_M = [del_n_M; del_n_vh(i)];
end

BP_est

BP_est = BP_est + del_n_M



% detector_v = [0.2, 0.6, 0.3];
% BP_v = [];
% for i=1:3
%   % mu_temp = -(log(detector_v(i))/3);
%   mu_temp = BP_func(detector_v(i),3);
%   BP_v = [BP_v, ones(3,1).*mu_temp];
% end

% detector_d = [0.2, 0.3, 0.4, 0.3, 0.2];
% BP_d = zeros(3,3);
% BP_d(1,3) = BP_func(detector_d(1),1);
% BP_d(3,1) = BP_d(1,3);
% BP_d(1,2) = -(log(detector_d(2))/2);
% BP_d(2,3) = BP_d(1,2);
% BP_d(2,1) = BP_d(1,2);
% BP_d(3,2) = BP_d(1,2);
% BP_d(1,1) = -(log(detector_d(3))/3);
% BP_d(2,2) = BP_d(1,1);
% BP_d(3,3) = BP_d(1,1);

% BP_est = BP_v + BP_d + BP_h;


% % Iterative reconstruction
%   % Then compare with detector values
%   % if less than or more than, find the difference in terms of mu and apply a back projected constant to vary the quality
%   % Subtract the set quantities and find the new predicted term
% detector_BP(1) = exp(-BP_est(1,1) - BP_est(1,2) - BP_est(1,3));
% detector_BP(2) = exp(-BP_est(2,1) - BP_est(2,2) - BP_est(2,3));
% detector_BP(3) = exp(-BP_est(3,1) - BP_est(3,2) - BP_est(3,3));
% difference = detector_h - detector_BP_h


% Mean Square Error
  % Find the error (subtract the recorded and predicted value)
  % Square the above value
  % Sum each squared error
  % Then divide by four (or whatever number of values for average)
% If low enough, stop and provide results


% Notes:
% x+y in real space
% Transform into k space with u+v
% Fourier transform = int(int( f(x,y) * exp(-i*2*pi*(u*x+v*y)) ));
% x = r*cos(theta)
% y = r*sin(theta)
% Where theta is angle from x axis of radius with length r
% And dx dy === abs(r)*dr dtheta
% Fourier transform in polar = int(int( f(r,theta) * exp(-i*2*pi*(u*r*cos(theta)+v*r*sin(theta))) )); from 0-pi and -inf to inf
% Just a notation change

% Projection Theorem:
  % With angle of CT detector, take fourier transform you get the slice of the entire fourier transform in the kspace
  % Each slice is added to a k space diagram, then an inverse transform is taken and the image can be reconstructed

% Interpolation -> artifacts
  % oversampled near center, but less defined towards exterior
  % tricky to convert to cartesian coordinates -> use filtered BP (really fourier conversion)
  % CT Raw data -> one line of sinogram is converted to fourier k-space
  % abs(k) creates a spike that suppresses information in the center and in comparison increases proportion of samples in exterior
  % Additionally high frequency space may have additional noise. Apply hamming window to further compress high frequency component and suppress noise


% Bone is great for X-ray
% Angiography with contrast agent
% Diagnose tumor in lung easily (should be clear ~mostly air)
% Colonoscopy - fiber optic cable for lower GI track...
% But with CT -> can make a virtual tour with a colonsocopy!

% Benchmarking for imaging quality:
  % Diagnostic Accuracy, Prevalence

% Biopsy (Disease)
%    + -
% + a,b
% - c,d
% Diagnosis (Test)


  % Sensitivity -> correct positive diagnosis (a/a+c)
  % Specificity -> correct negative diagnosis (i.e remove what should be removed) (b/b+d)


  % ROC - Receiver Operator Curve
