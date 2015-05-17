% Acquire data from Arduino
close all; clear all; clc;

% Set port for particular computer
% port = 'COM4';
port = '/dev/cu.usbmodem1421';



s = initializeSerial_v3(port);
fopen(s);
channels = 2;
data(1,:) = getSerialData_v3(s,channels)
h = plot(1,data(:,1), 1,data(:,2), 1,37);
legend('Temperature', 'Output (1/10)', 'SetPoint', 'Location', 'Southwest');
i = 1;
test = 1;
while test
    data(i, :) = getSerialData_v3(s,channels);
    set(h(1),'xdata',1:i,'ydata',data(:,1));
    set(h(2),'xdata',1:i,'ydata',data(:,2));
    set(h(3),'xdata',1:i,'ydata',linspace(37, 37, i));
    drawnow;
    if data(i,1) < 0
        test = false;
    end
    i = i + 1;
    if i > 1e6
        i = 1;
        clear data;
    end
end
fclose(s)