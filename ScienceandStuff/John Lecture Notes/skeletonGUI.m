function skeletonGUI()

% Structure to store object handles
h = struct();

% Create the main window
hwindow = figure;%("Property1",Value1,...
%   "Property2",Value2,...
%   "Property3",Value3,...);

% Create an axis
h.ax = axes('Parent',hwindow);%,'Position',[Xorigin Yorigin Xwidth Yheight],...
%     'Property1',Value1,...
%     'Property2',Value2);

% Create a text box for conveying instructions
h.talk = uicontrol('Parent',hwindow,'Units','Normalized',...
    'Style','Text',...
    'Position',[0.05 0.93 0.9 0.06],...
    'String','Hello World');

% Create a button to change the text
h.button1 = uicontrol('Parent',hwindow,'Units','Normalize',...
    'Style','PushButton',...
    'Position',[0.01 0.67 0.485 0.05],...
    'String','Why?');

% Create another button to plot something
h.button2 = uicontrol('Parent',hwindow,'Units','Normalize',...
    'Style','Checkbox',...
    'Position',[0.01 0.4 0.485 0.05],...
    'String','Plot');

% Put something on the axes
h.p = pcolor(h.ax,peaks);
h.p.Visible = 'off';

h.button1.Callback = {@GUI_Callbacks,h};
h.button2.Callback = {@GUI_Callbacks,h};


function GUI_Callbacks(hObject,eventdata,h)

switch hObject
  case h.button1
    why
    h.talk.String = 'Check the console';
  case h.button2
    switch h.button2.Value
      case 1
        h.p.Visible='on';
      case 0
        h.p.Visible='off';
    end
end