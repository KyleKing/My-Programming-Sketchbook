function skeletonGUI()

% Structure to store object handles
h = struct();
im = imread('heart.gif');

% Create the main window
hwindow = figure('Name','Da Bomb Diggity');

% Create an axis
h.ax = axes('Parent',hwindow,'Position',[0.06 0.08 0.65 0.75]);

h.talk = uicontrol('Parent',hwindow,'Units','Normalized',...
    'Style','Text','FontSize',20,'FontName','Impact','HorizontalAlignment','Center',...
    'Position',[0.00 0.9 1 0.1],...
    'String','Arbitrarily Constant''s Final Project!');

% Create a text box for conveying average ratio
h.ratiotalk = uicontrol('Parent',hwindow,'Units','Normalized',...
    'Style','Text','HorizontalAlignment','Right',...
    'Position',[0.76 0.4 0.15 0.06],...
    'String','Average Signal Ratio:');

h.pulsetalk = uicontrol('Parent',hwindow,'Units','Normalized',...
    'Style','Text','HorizontalAlignment','Right',...
    'Position',[0.76 0.6 0.15 0.06],...
    'String','Average Pulse:');

h.peakstalk = uicontrol('Parent',hwindow,'Units','Normalized',...
    'Style','Text','HorizontalAlignment','Right',...
    'Position',[0.76 0.5 0.15 0.06],...
    'String','Number of Peaks:');
% 
% h.gif = gifplayer('heart.gif',0.1);

pulseOx

function pulseOx()
port = '/dev/cu.usbmodem1411';

s = initializeSerial_v2(port);
fopen(s);
channels = 2;
data(1,:) = getSerialData_v2(s,channels);
p = plot(1,data(:,1),1,data(:,2));
xlim([0 10]);
% ylim([0 5]);
title('Arduino Serial Out: 10Hz sampling')
xlabel('t')
ylabel('V')
legend('Red LED','IR LED');
i = 1;
test = 1;
while test
    if i == 1
        tic
    end
    data(i,:) = getSerialData_v2(s,channels);
    set(p(1),'xdata',[1:i]./28,'ydata',data(:,1));
    set(p(2),'xdata',[1:i]./28,'ydata',data(:,2));
    drawnow;
    if data(i,1) < 0
        test = false;
    end
    i = i + 1;
    t = toc;
    if t > 10
        rats = data(:,2)./data(:,1);
        rats(~isfinite(rats))=0;
        ratio = mean(rats);
        ratio = round(ratio,3);
        i = 1;
        
        h.ratavg = uicontrol('Parent',hwindow,'Units','Normalized',...
            'Style','Text','HorizontalAlignment','Left',...
            'Position',[0.92 0.4 0.06 0.06],'String',num2str(ratio));
        
        [pks,locs] = findpeaks(data(:,2),4);
        
        avg = length(locs)*6;
        
        h.pulseavg = uicontrol('Parent',hwindow,'Units','Normalized',...
            'Style','Text','HorizontalAlignment','Left',...
            'Position',[0.92 0.6 0.06 0.06],'String',num2str(avg));
        
        h.peaks = uicontrol('Parent',hwindow,'Units','Normalized',...
            'Style','Text','HorizontalAlignment','Left',...
            'Position',[0.92 0.5 0.06 0.06],'String',num2str(length(locs)));
        
        clear data
    end
    
end

fclose(s)
end



end