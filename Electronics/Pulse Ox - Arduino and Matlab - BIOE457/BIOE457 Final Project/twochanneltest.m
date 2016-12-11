port = '/dev/cu.usbmodem1411';

s = initializeSerial_v2(port);
fopen(s);
channels = 1;
data(1,:) = getSerialData_v2(s,channels);
h = plot(1,data(:,1),1,data(:,2));

i = 1;
test = 1;
while test
    data(i,:) = getSerialData_v2(s,channels);
    set(h(1),'xdata',1:i,'ydata',data(:,1));
    set(h(2),'xdata',1:i,'ydata',data(:,2));
    drawnow;
    if (data(i,1) < 0)
        test = false;
    end
    i = i + 1;
    if i > 1e6
        i = 1;
        clear data;
    end
end