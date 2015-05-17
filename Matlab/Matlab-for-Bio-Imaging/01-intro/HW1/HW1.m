% Homework 1
% Kyle King
% BIOE420 - 0101
clc, clear all, close all

% Question 4
disp('Question 4')
  % Part A
    % 1. Plot LSF
      % Given parameters
      alpha = 3; % rad/cm
      x = linspace(-pi/3, pi/3, 1E6);

      % Calculate piecewise function
      nonZeroRange = find(abs(alpha*x) <= pi/2);
      LSF(nonZeroRange) = cos(alpha*x(nonZeroRange));
      ZeroRange = find(abs(alpha*x) > pi/2);
      LSF(ZeroRange) = 0;

      figure
      subplot(2, 2, 1), hold all, plot(x, LSF)
      title('Q4-A: Line Spread Function')
      xlabel('Position (cm)'), ylabel('Amplitude')

    % 2. Determine spatial resolution in cm
      [SpatialResolution, events] = fwhm(x, LSF);
      disp(['Spatial Resolution = ' num2str(SpatialResolution) ' cm'])
      % Plot fwhm
      [~,centerIndex] = max(LSF);
      plot(x(centerIndex), LSF(centerIndex), 'b+')
      plot(x(events), LSF(events), 'r+')
      plot([x(events(1)); x(events(2))], [LSF(events(1)); LSF(events(2))], 'r-');
      str = ['\leftarrow Width = ' num2str(SpatialResolution) ' cm'];
      text(x(events(2)), LSF(events(2)), str)

clear all

  % Part B
    % 1. Plot LSF
      % Given parameters
      x = linspace(-5, 5, 1E6);
      LSF =(1/(2*pi))*exp(-(x.^2)/2);

      subplot(2, 2, 2), hold all, plot(x, LSF)
      title('Q4-B: Line Spread Function')
      xlabel('Position (cm)'), ylabel('Amplitude')

    % 2. Determine spatial resolution in cm
      [SpatialResolution, events] = fwhm(x, LSF);
      disp(['Spatial Resolution = ' num2str(SpatialResolution) ' cm'])
      % Plot fwhm
      [~,centerIndex] = max(LSF);
      plot(x(centerIndex), LSF(centerIndex), 'b+')
      plot(x(events), LSF(events), 'r+')
      plot([x(events(1)); x(events(2))], [LSF(events(1)); LSF(events(2))], 'r-');
      str = ['\leftarrow Width = ' num2str(SpatialResolution) ' cm'];
      text(x(events(2)), LSF(events(2)), str)

clear all

% Question 5
disp('Question 5')
  % 1. Plot MTF
    % Given parameters
    u = linspace(0, pi/6, 1E6);
    MTF = exp(-2*pi^2*u.^2);

    subplot(2, 2, 3), hold all, plot(u, MTF)
    title('Q5: Modulation Transfer Function')
    xlabel('Spatial Frequency (Hz)'), ylabel('% Contrast')

  % 2. Determine the output contrast of two input signals
    % Calculate frequency of the signal
    fun{1} = 'f(x) = 2 + sin(pi*x)'; % = 2 + sin(2*pi*f1*x)
    f(1) = 1/2;
    fun{2} = 'f(x) = 5 + cos(x)'; %  = 5 + cos(2*pi*f2*x)
    f(2) = 1/(2*pi);

    % Plot Contrast on MTF plot
    contrast = exp(-2*pi^2*f.^2);
    plot(f, contrast, 'r+')
    for (i = 1:2)
      str = ['\leftarrow '  fun{i}];
      text(f(i), contrast(i), str)
      disp(['Contrast of Signal ' num2str(i) ' is = ' num2str(contrast(i)*100) '%'])
    end