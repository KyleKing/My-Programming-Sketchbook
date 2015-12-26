function [s,test] = initializeSerial(port)

port_test = instrfind('Port', port);
% Test to see if the port is already occupied in matlab and clear it.
if ~isempty(port_test)
    delete(port_test);
end


test = true;
% While loop attempts to open the specified port, and requests a new one if
% the port was incorrect
while test
    try 
        s = serial(port); %assigns the object s to serial port
        test = false;
    catch e
        port = input('Try a new COM port, please input the port here (i.e. ''COM3'':');
    end
end


% Setup serial communication parameters
set(s, 'InputBufferSize', 256); 
set(s, 'FlowControl', 'Hardware');
set(s, 'BaudRate', 9600);
set(s, 'Parity', 'none');
set(s, 'DataBits', 8);
set(s, 'StopBit', 1);
set(s, 'Timeout',10);
set(s,'Requesttosend','off');
% Display success statement to the command window
disp(['Port: ' get(s,'Name') ' Setup Done!!']);