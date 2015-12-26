% Acquire data from Arduino
close all;
clear all;
clc;
port = '/dev/cu.usbmodem1411';

s = initializeSerial_v2(port);
fopen(s);
channels = 2;
data(1,:) = getSerialData_v2(s,channels);
h = plot(1,data(:,1),1,data(:,2));
xlim([0 10]);
i = 1;
test = 1;
while test
    if i == 1
        tic
    end
    data(i,:) = getSerialData_v2(s,channels);
    set(h(1),'xdata',[1:i]./10,'ydata',data(:,1));
    set(h(2),'xdata',[1:i]./10,'ydata',data(:,2));
    drawnow;
    if data(i,1) < 0
        test = false;
    end
    i = i + 1;
    t = toc;
    if t > 10
        i = 1;
        clear data;
    end
end
    title('Arduino Serial Out: 1Hz sampling')
    xlabel('t')
    ylabel('V')
    legend('Red LED','IR LED');
fclose(s)