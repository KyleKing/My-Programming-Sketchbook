% clc, clear all, close all
% Strcuts - just like objects with dot notation
% zombies = struct('moreZombies', struct('AdditionalZombies', struct('EVENMOREZOMBIES', 12)))


% GUI
function FollowAlongGUI()

% global h

hwindow = figure;
h = struct('window',hwindow);
h.ax = axes('Parent',h.window);

% get(h.ax)
% set(h.ax)
h.ax.YScale = 'log';
% s = set(h.ax);
% s.Units

old = h.ax.Position;
h.ax.Position = [old(1)+0.4, old(2), old(3)/2, old(4)];

delete(h.ax)
h.ax = axes('Parent',h.window,'Position',[0.53 0.11 0.3875 0.8150]);
% []

h.button1 = uicontrol('Parent',h.window,'Units','Normalized',...
    'Style','PushButton','Position',[0.01 0.67 0.485 0.05],...
    'String','Why?'); % A button
h.button2 = uicontrol('Parent',h.window,'Units','Normalized',...
    'Style','Checkbox','Position',[0.01 0.4 0.485 0.05],...
    'String','Plot'); % A checkbox
h.talk = uicontrol('Parent',h.window,'Units','Normalized',...
    'Style','Text','Position',[0.05 0.93 0.9 0.06],...
    'String','Hello World'); % A text box

% Let's put something on the axis, but keep it from being visible for now.
h.p = pcolor(h.ax,peaks);
h.p.Visible = 'off';

h.button1.Callback = {@GUI_Callbacks,h};
h.button2.Callback = {@GUI_Callbacks,h};

[h.button2.Callback,h.button1.Callback] = deal({@GUI_Callbacks,h});

function GUI_Callbacks(hObject,eventdata,h)
switch hObject
    case h.button1
        why
        h.talk.String = 'Check the console';
    case h.button2
        switch h.button2.Value
            case 1
                h.p.Visible = 'on';
            case 0
                h.p.Visible = 'off';
        end
end


% Last notes:
% Using an edit box, receive the edited text off of h.talk.String
% Then eval, because it is a string and you want a function:
% eval('a = ' h.talk.String ';')

% Build Front Rnd
% Define Callbacks
% Functinos