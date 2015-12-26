% BIOE340 Lab Lecture
% Determine Mean QRS Axis add the three vectors of each lead amd they should add to -55 mV for healthy tissue


% From lab, open the excel file and get name and path then store data in "a"
[Name, Path] = uigetfile('.xls')
filename=strcat(Path, Name);
a = xlsread(filename)

t = a(:,1); % Time
Lone=a(:, 2); % Lead 1
Ltwo=a(:, 3); % Lead 2
Lthr=a(:, 4); % Lead 3

% Plot the three leads on the same graph with labels and a legend
figure(1), plot(t, Lone, t, Ltwo, t, Lthr), legend('Lead 1', 'Lead 2','Lead 3'),
    title('Data Points'), xlabel('\theta (degrees)'),  ylabel('Moment Force (Nm)')

maxVolt = max(Lone)
R=[];
Rt=[];
for i= 1:length(Lone)
  if Lone(i) > maxVolt-0.2*maxVolt
    R=[R, Lone(i)];
    Rt = [Rt t(i)];
  end
end
% plot(

% sort out points that don't make sense

% angle=degtorad()
% figure
% compass(voltOne, angle) % plot in circle



% Plot easily across subplots

% figure
% plot(t,ECG_data); grid on
% findpeaks(-ECG_data,t,'Annotate','extents')

% Specify a minimum excursion in first plot
ax(1) = subplot(2,1,1);
findpeaks(ECG_data,t,'Annotate','extents','WidthReference','halfheight') % findpeaks(Lone,'threshold',5)


ax(2) = subplot(2,1,2);

% link and zoom in to show the changes
linkaxes(ax(1:2),'xy');

% [pks,locs] = findpeaks(ECG_data,t);
% text(locs+.02,pks,num2str((1:numel(pks))')), grid on
