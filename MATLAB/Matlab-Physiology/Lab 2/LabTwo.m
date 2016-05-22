% Kyle King
% BIOE340 - Section 0102
% Lab Assignment #2
% 10-02-2014

clc, clear all, close all % Boilerplate

%
%
% Part 1 - Read the data file (comma separated or excel file format) into MATLAB and store the values
%
%

% Open the excel file and get name and path then store data in "a"
[Name, Path] = uigetfile('.xls');
filename = strcat(Path, Name);
a = xlsread(filename);

% Parse the data
t = a(:,1); % Time
Lone = a(:, 2); % Lead 1
% Lone = Lone(1:400); % shorten the vector to one second for ease of calculations
Ltwo = a(:, 3); % Lead 2
Lthr = a(:, 4); % Lead 3
aVR = a(:, 5); % aVR
aVL = a(:, 6); % aVL
aVF = a(:, 7); % aVF
% ECG = a(:, 8); % ECG

% Plot of only one lead
% hold all, figure(1), plot(t(1:300), Lone(1:300))
hold all, figure(1), plot(t, Lone)
% % Test plot of three leads with labels and a legend
% hold all, figure(1), plot(t, Lone, t, Ltwo, t, Lthr), legend('Lead 1', 'Lead 2','Lead 3'),
    % title('Data Points'), xlabel('\theta (degrees)'),  ylabel('Moment Force (Nm)')

%
%
% 2. Identify and report key features of the mean ECG signal, including:
%
%

% From lab...
% maxVolt = max(Lone)

%
% a. Measured heart rate;
%

%
% words
%







% Intialize time spread of consecutive points in past and future of "current point"
lengthView = 9;
miniPeakFilter = 0.03;
peakName = 1;
lenR = 1;
store = 0;

for j = 1:lengthView
  tmpPast(j) = [Lone(j)];
  tmpFuture(j) = [Lone(j+lengthView+1)];
  timePast(j) = [t(j)];
  timeFuture(j) = t(j+lengthView+1);
end
tmpCurrent = Lone(lengthView+1);
timeCurrent = t(lengthView+1);

R = []; % Initialize R as a vector of max
Rt = []; % Initialize Rt max with time vector
% for i = (2*lengthView+1):300
offset = (2*lengthView+1);
for i = offset:length(Lone)

  % Initialize Averages
  sumPast = 0;  sumFuture = 0;
  heightPast = 0; widthPast = 0; heightFuture = 0; widthFuture = 0;
  % Initialize check value for Q peak
  check = 0;

  for k = 1:lengthView
    sumPast = sumPast + tmpPast(k);
    sumFuture = sumFuture + tmpFuture(k);
  end
  avgPast = sumPast/k;
  avgFuture = sumFuture/k;

  % Compare averages with current value
  if (tmpCurrent > avgPast && tmpCurrent > avgFuture && tmpCurrent > tmpPast(length(tmpPast)) && tmpCurrent > tmpFuture(1) && abs((tmpCurrent-tmpFuture(length(tmpFuture))))  > miniPeakFilter && abs((tmpCurrent- tmpPast(1))) > miniPeakFilter)
    % disp([num2str((i-lengthView)) ' ' num2str(t(i-lengthView)) ' ' num2str(i) ' Peak'])
    store = 1;

  elseif (tmpCurrent < avgPast && tmpCurrent < avgFuture && tmpCurrent < tmpPast(length(tmpPast)) && tmpCurrent < tmpFuture(1) && abs((tmpCurrent-tmpFuture(length(tmpFuture))))  > miniPeakFilter && abs((tmpCurrent- tmpPast(1))) > miniPeakFilter)
    store = 1;

  else
    % Find the Q wave, may need to add better info based on previous points
    for count = 2:(lengthView)
      if (tmpFuture(count) > tmpFuture(count-1) && peakName(lenR) == 1)
        %  && tmpPast(count) < tmpPast(count-1)
        check = check + 1;
      end
      if check == lengthView - 1;
        store = 1;
      end
    end
  end

  % optimize the process by only running these scripts if the store value is triggered
  if store == 1

    % Store data
    R = [R, Lone(i-lengthView)];
    Rt = [Rt, t(i-lengthView)];
    lenR = length(R);

    %
    % Find slope
    %
    % Calculate given the vertical and horizontal displacement
    for z = 0:(lengthView-1)
      heightPast = heightPast + tmpPast(lengthView-z);
      widthPast = widthPast + timePast(lengthView-z);
      heightFuture = heightFuture + tmpFuture(lengthView-z);
      widthFuture = widthFuture + timeFuture(lengthView-z);
    end
    % Average over the # of points
    heightPast = heightPast/lengthView;
    heightFuture = heightFuture/lengthView;
    % Calculate slope values
    slopePast = heightPast/widthPast;
    slopeFuture = heightFuture/widthFuture;

    runningMaxLone = max(Lone(offset:i));
    runningMinLone = min(Lone(offset:i));
    if (Lone(i-lengthView) >= 0.3*runningMinLone && Lone(i-lengthView) <= 0.3*runningMaxLone)
      disp('P')
      peakName(lenR) = [1];
    elseif (Lone(i-lengthView) <= 0.001*runningMaxLone && Lone(i-lengthView) >= 0.7*runningMinLone)
      disp('Q')
      peakName(lenR) = [2];
    elseif Lone(i-lengthView) >= 0.7*runningMaxLone
      disp('R')
      peakName(lenR) = [3];
    elseif Lone(i-lengthView) <= 0.7*runningMinLone
      disp('S')
      peakName(lenR) = [4];
    elseif (Lone(i-lengthView) >= 0.4*runningMaxLone && Lone(i-lengthView) <= 0.7*runningMaxLone)
      disp(['T' 13])
      peakName(lenR) = [5];
    else
      disp('unknown')
      peakName(lenR) = [9];
    end

    % display data for tuning
    lastR = R(lenR);
    lastRt = Rt(lenR);
    firstTimePoint = Lone(i-lengthView-lengthView);
    % slopePast
    % slopeFuture
  end


  % Shift the time values forward to next i value
  tmpTmpFuture = tmpFuture(1);
  for l = 2:lengthView
    tmpPast(l-1) = tmpPast(l);
    tmpFuture(l-1) = tmpFuture(l);
    timePast(l-1) = t(l);
    timeFuture(l-1) = t(l+1+lengthView);
  end
  tmpPast(lengthView) = tmpCurrent;
  tmpCurrent = tmpTmpFuture;
  tmpFuture(lengthView) = Lone(i);
  timePast(lengthView) = t(i);

  % Reset values for next loop
  store = 0; heightPast = 0; heightFuture = 0;
end

% plot(Rt, R)
plot(Rt, R, 'o')
hold off

% Heart Rate between peaks



% b. Indicate the QRS complex and T and P wave on a graphical representation of the data;
% c. Maximum and minimum voltage;
% d. Average P-Q, P-R or Q-T interval.

% plot(....

% sort out points that don't make sense