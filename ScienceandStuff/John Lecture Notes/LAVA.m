function LAVA()
% LAVA processes a greyscale image stored in a txt or csv file. Written for
% analyzing Atomic Force Microscopy images, LAVA enables the user to
% separate individual features in the image which stand above an averaged
% background. It also enables the user to sort these features relative to a
% set of up to five templates. The templates themselves can either be
% entered explicitly, chosen from within the image, or automatically chosen
% from the volume distribution by means of Lloyd's algorithm to create a
% small set of volumes which are representative of the distribution as a
% whole.

close all
clear all

global fgcolor bgcolor units methods nums message fresh ran cbv tempmethods
global mc oc undolist
% addpath('Supporting Functions')
% addpath('Icons')

scrsz=get(0,'ScreenSize');
bgcolor = [0 0 0];
fgcolor = [1 1 1];
units = {'km','m','mm','um','nm','pm'};
methods = {'Riemann Sum','Spherical Cap'};
tempmethods = {'Automatically select templates',...
                  'Manually select templates',...
                  'Manually enter templates'};
nums = {'1','2','3','4','5'};
message = {'Averaged Background:','','Total Features:','','Features Included:',''};
fresh = 1;
ran = 0;
cbv = 0;
undolist = [];

% Create the main window
hwindow = figure('Visible','on',...
    'Position',[0 0 scrsz(3) scrsz(4)-50],...
    'Name','LAVA: Lloyd''s Algorithm-based Volumetric Analysis',...
    'Color',bgcolor,'MenuBar','none');

% Structure to store object handles
h = struct();

% Create two axes for original and mask images
h.original = axes('Parent',hwindow,'Position',[0.02 0.33 0.35 0.55],...
    'XAxisLocation','top','XColor',fgcolor,...
    'YAxisLocation','right','YColor',fgcolor,'YDir','reverse');
oc = colorbar('Peer',h.original,'Location','WestOutside');

h.mask = axes('Parent',hwindow,'Position',[0.63 0.33 0.35 0.55],...
    'XAxisLocation','top','XColor',fgcolor,...
    'YColor',fgcolor,'YDir','reverse');

h.r.cover = uicontrol('Parent',hwindow,'Units','Normalize',...
    'Style','Text','BackgroundColor',bgcolor',...
    'Position',[0.94 0.32 0.06 0.57],...
    'Visible','off');

mc = colorbar('Peer',h.mask);

% Create a text box for conveying instructions
h.talk = uicontrol('Parent',hwindow,'Units','Normalized',...
    'Style','Text',...
    'Position',[0.05 0.93 0.9 0.06],...
    'BackgroundColor',bgcolor,...
    'ForegroundColor',fgcolor,...
    'FontSize',30,...
    'String','Welcome to LAVA');

% %Propaganda
% h.icon = axes('Parent',hwindow,'Position',[0 0.93 0.035 0.07]);
% imshow('Icon.png','Parent',h.icon)
% h.su = axes('Parent',hwindow,'Position',[0.965 0.93 0.035 0.07]);
% imshow('SU logo red.jpg','Parent',h.su)

% Get z-axis units
%     h.zb = uicontrol('Parent',hwindow,'Units','Normalized',...
%         'Style','Push Button',... 'Position',[0 0.3075 0.05 0.025],...
%         'BackgroundColor',bgcolor,... 'ForegroundColor',fgcolor,...
%         'String','Z-Axis:');
%     h.zu = uicontrol('Parent',hwindow,'Units','Normalized',...
%         'Style','PopUpMenu',... 'Position',[0.05 0.3125 0.03 0.025],...
%         'BackgroundColor',bgcolor,... 'ForegroundColor',fgcolor,...
%         'String',units,... 'Value',5);
    h.zu = uicontrol('Parent',hwindow,'Units','Normalized',...
        'Style','Text',...
        'Position',[0.029 0.29 0.03 0.025],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String',units{5},...
        'Value',5);

% Display volume units
    h.vu = uicontrol('Parent',hwindow,'Units','Normalized',...
        'Style','Text',...
        'Position',[0.9425 0.29 0.03 0.025],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','nm^3');

% Create a panel to contain central uicontrol fields
h.c.box = uipanel('Parent',hwindow,'Units','Normalized',...
    'Position',[0.41 0.33 0.175 0.55],...
    'BackgroundColor',bgcolor);

    % Get scan width
    h.c.widthb = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','Text',...
        'Position',[0.01 0.945 0.45 0.05],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','Scan Width:');
    h.c.widthv = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','Edit',...
        'Position',[0.485 0.95 0.3 0.04],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'Max',1,'Min',0,...
        'String','1',...
        'Value',1);

%     h.c.widthu = uicontrol('Parent',h.c.box,'Units','Normalize',...
%         'Style','Popupmenu',... 'Position',[0.81 0.95 0.18 0.05],...
%         'BackgroundColor',bgcolor,... 'ForegroundColor',fgcolor,...
%         'String',units,... 'Value',4);

    h.c.widthu = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','Text',...
        'Position',[0.81 0.95 0.18 0.05],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String',units{4},...
        'Value',4);

    % Get scan height
    h.c.heightb = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','Text',...
        'Position',[0.01 0.885 0.45 0.05],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','Scan Height:');
    h.c.heightv = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','Text',...
        'Position',[0.485 0.89 0.3 0.04],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','1',...
        'Value',1);
    h.c.heightu = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','Text',...
        'Position',[0.81 0.895   0.18 0.05],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String',units{get(h.c.widthu,'Value')});

    % Get threshold height
    h.c.backgroundb = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','Text',...
        'Position',[0.01 0.825 0.45 0.05],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','Cut-off Height:');
    h.c.backgroundv = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','Edit',...
        'Position',[0.485 0.83 0.3 0.04],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'Max',1,'Min',0);
    h.c.backgroundu = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','Text',...
        'Position',[0.81 0.82 0.18 0.05],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String',units(get(h.zu,'Value')));

    % Get tolerance for each template set
    h.c.varianceb = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','Text',...
        'Position',[0.01 0.765 0.45 0.05],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','Max Variance:');
    h.c.variancev = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','Edit',...
        'Position',[0.485 0.77 0.3 0.04],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'Max',1,'Min',0,...
        'String','30');
    h.c.varianceu = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','Text',...
        'Position',[0.81 0.76 0.18 0.05],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','%');

    % Get method of volume calculation
    h.c.volume = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','PushButton',...
        'Position',[0.01 0.67 0.485 0.05],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','Volume:');
    h.c.method = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','PopUp',...
        'Position',[0.505 0.675 0.485 0.05],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String',methods);

    % Get number of templates to be used
    h.c.numtempb = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','Text',...
        'Position',[0.01 0.58 0.785 0.05],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','Number of Templates:');
    h.c.numtempv = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','Popup',...
        'Position',[0.81 0.595 0.18 0.04],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String',nums);

    % Get method of template selection
    h.c.howtemp = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','PopUpMenu',...
        'Position',[0.01 0.50 0.98 0.04],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String',tempmethods);

    % Display or enter template volumes
    h.c.temp1 = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','Text',...
        'Position',[0.01 0.40 0.98 0.04],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor',...
        'Max',1,'Min',0);
    h.c.temp2 = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','Text',...
        'Position',[0.01 0.35 0.98 0.04],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor',...
        'Visible','off',...
        'Max',1,'Min',0);
    h.c.temp3 = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','Text',...
        'Position',[0.01 0.30 0.98 0.04],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor',...
        'Visible','off',...
        'Max',1,'Min',0);
    h.c.temp4 = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','Text',...
        'Position',[0.01 0.25 0.98 0.04],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor',...
        'Visible','off',...
        'Max',1,'Min',0);
    h.c.temp5 = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','Text',...
        'Position',[0.01 0.20 0.98 0.04],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor',...
        'Visible','off',...
        'Max',1,'Min',0);

    % Perform sorting of features by templates
    h.c.run = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','Pushbutton',...
        'Position',[0.01 0.095 0.98 0.07],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','Sort Features',...
        'FontSize',12,...
        'FontWeight','Bold');

    % Allow for patch removal
    h.c.remove = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','Text',...
        'Position',[0.01 0.01 0.485 0.05],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','Remove Patches');
    h.c.undo = uicontrol('Parent',h.c.box,'Units','Normalize',...
        'Style','Text',...
        'Position',[0.505 0.01 0.485 0.05],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','Undo Remove');

% Create panels underneath the two axes to contain radio buttons
h.l.box = uibuttongroup('Parent',hwindow,'Units','Normalized',...
    'Position',[0.066 0.29 0.304 0.025],...
    'BackgroundColor',bgcolor);

    h.l.buttono = uicontrol('Parent',h.l.box,'Units','Normalized',...
        'Style','RadioButton',...
        'Position',[0 0 0.17 1],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','Original');

    h.l.button5 = uicontrol('Parent',h.l.box,'Units','Normalized',...
        'Style','RadioButton',...
        'Position',[0.93 0 0.07 1],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','5',...
        'Visible','off');

    h.l.button4 = uicontrol('Parent',h.l.box,'Units','Normalized',...
        'Style','RadioButton',...
        'Position',[0.83 0 0.07 1],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','4',...
        'Visible','off');

    h.l.button3 = uicontrol('Parent',h.l.box,'Units','Normalized',...
        'Style','RadioButton',...
        'Position',[0.73 0 0.07 1],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','3',...
        'Visible','off');

    h.l.button2 = uicontrol('Parent',h.l.box,'Units','Normalized',...
        'Style','RadioButton',...
        'Position',[0.63 0 0.07 1],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','2',...
        'Visible','off');

    h.l.button1 = uicontrol('Parent',h.l.box,'Units','Normalized',...
        'Style','RadioButton',...
        'Position',[0.53 0 0.07 1],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','1',...
        'Visible','off');

h.r.box = uibuttongroup('Parent',hwindow,'Units','Normalized',...
    'Position',[0.63 0.29 0.304 0.025],...
    'BackgroundColor',bgcolor);

    h.r.buttonm = uicontrol('Parent',h.r.box,'Units','Normalized',...
        'Style','RadioButton',...
        'Position',[0 0 0.13 1],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','Mask');

    h.r.buttonh = uicontrol('Parent',h.r.box,'Units','Normalized',...
        'Style','RadioButton',...
        'Position',[0.16 0 0.21 1],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','Histogram');

    h.r.button5 = uicontrol('Parent',h.r.box,'Units','Normalized',...
        'Style','RadioButton',...
        'Position',[0.93 0 0.07 1],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','5',...
        'Visible','off');

    h.r.button4 = uicontrol('Parent',h.r.box,'Units','Normalized',...
        'Style','RadioButton',...
        'Position',[0.83 0 0.07 1],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','4',...
        'Visible','off');

    h.r.button3 = uicontrol('Parent',h.r.box,'Units','Normalized',...
        'Style','RadioButton',...
        'Position',[0.73 0 0.07 1],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','3',...
        'Visible','off');

    h.r.button2 = uicontrol('Parent',h.r.box,'Units','Normalized',...
        'Style','RadioButton',...
        'Position',[0.63 0 0.07 1],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','2',...
        'Visible','off');

    h.r.button1 = uicontrol('Parent',h.r.box,'Units','Normalized',...
        'Style','RadioButton',...
        'Position',[0.53 0 0.07 1],...
        'BackgroundColor',bgcolor,...
        'ForegroundColor',fgcolor,...
        'String','1',...
        'Visible','off');

% Allow for standard file operations The filename in which to save the
% data.
h.savefile = uicontrol('Parent',hwindow,'Units','Normalized',...
    'Style','Edit',...
    'Position',[0.086 .11 .2 .03],...
    'BackgroundColor',bgcolor,...
    'ForegroundColor',fgcolor);


% Allow user to browse for a separate path in which to place the new file.
h.browse = uicontrol('Parent',hwindow,'Units','Normalized',...
    'Style','pushbutton',...
    'Position',[0.086 .06 .1 .03],...
    'BackgroundColor',bgcolor,...
    'ForegroundColor',fgcolor,...
    'String','Browse',...
    'Fontsize',12);

% Save data in the displayed file.
h.save = uicontrol('Parent',hwindow,'Units','Normalized',...
    'Style','pushbutton',...
    'Position',[.186 .06 .1 .03],...
    'BackgroundColor',bgcolor,...
    'ForegroundColor',fgcolor,...
    'String','Save',...
    'Fontsize',12);

% Start a new analysis
h.new = uicontrol('Parent',hwindow,'Units','Normalized',...
    'Style','pushbutton',...
    'Position',[0.086 .16 .2 .03],...
    'BackgroundColor',bgcolor,...
    'ForegroundColor',fgcolor,...
    'String','New',...
    'Fontsize',12);

% Open a previous analysis
h.open = uicontrol('Parent',hwindow,'Units','Normalized',...
    'Style','pushbutton',...
    'Position',[.186 .16 .1 .03],...
    'BackgroundColor',bgcolor,...
    'ForegroundColor',fgcolor,...
    'String','Open',...
    'Fontsize',12,...
    'Visible','Off');

% Display current file
h.current = uicontrol('Parent',hwindow,'Units','Normalized',...
    'Style','Edit',...
    'Position',[0.086 .21 .2 .03],...
    'BackgroundColor',bgcolor,...
    'ForegroundColor',fgcolor,...
    'Fontsize',12,...
    'Fontweight','bold',...
    'Visible','Off');

% Open menu to select options
h.preferences = uicontrol('Parent',hwindow,'Units','Normalized',...
    'Style','pushbutton',...
    'Position',[.29 .15 .10 .03],...
    'BackgroundColor',bgcolor,...
    'ForegroundColor',fgcolor,...
    'String','Preferences',...
    'Fontsize',12,...
    'Visible','off');

% A table for showing information about each set
cnames = {'Tag','Height','Footprint','Volume','Deviation','Overlap'};
h.info = uitable(hwindow,'Units','Normalize',...
    'Position',[0.63 0.03 0.304 0.25],...
    'BackgroundColor',bgcolor,...
    'ForegroundColor',fgcolor,...
    'ColumnName',cnames,...
    'Visible','off');

% Message box
h.message = uicontrol('Parent',hwindow,'Units','Normalized',...
    'Style','Text',...
    'Position',[0.41 0.03 0.175 0.225],...
    'BackgroundColor',bgcolor,...
    'ForegroundColor',fgcolor,...
    'FontSize',16,...
    'String',message);


% Callbacks have to be set at the end of the function so the handle
% structure h contains the full set of object handles
set(h.zu,'Callback',{@GUI_Callbacks,h});

set(h.c.widthv,'Callback',{@GUI_Callbacks,h});
set(h.c.heightv,'Callback',{@GUI_Callbacks,h});
set(h.c.backgroundv,'Callback',{@GUI_Callbacks,h});
set(h.c.variancev,'Callback',{@GUI_Callbacks,h});
set(h.c.volume,'Callback',{@GUI_Callbacks,h});
set(h.c.method,'Callback',{@GUI_Callbacks,h});
set(h.c.numtempv,'Callback',{@GUI_Callbacks,h});
set(h.c.howtemp,'Callback',{@GUI_Callbacks,h});
set(h.c.run,'Callback',{@GUI_Callbacks,h});
set(h.c.remove,'Callback',{@GUI_Callbacks,h});
set(h.c.undo,'Callback',{@GUI_Callbacks,h});

set(h.l.buttono,'Callback',{@GUI_Callbacks,h});
set(h.l.button5,'Callback',{@GUI_Callbacks,h});
set(h.l.button4,'Callback',{@GUI_Callbacks,h});
set(h.l.button3,'Callback',{@GUI_Callbacks,h});
set(h.l.button2,'Callback',{@GUI_Callbacks,h});
set(h.l.button1,'Callback',{@GUI_Callbacks,h});

set(h.r.buttonm,'Callback',{@GUI_Callbacks,h});
set(h.r.buttonh,'Callback',{@GUI_Callbacks,h});
set(h.r.button5,'Callback',{@GUI_Callbacks,h});
set(h.r.button4,'Callback',{@GUI_Callbacks,h});
set(h.r.button3,'Callback',{@GUI_Callbacks,h});
set(h.r.button2,'Callback',{@GUI_Callbacks,h});
set(h.r.button1,'Callback',{@GUI_Callbacks,h});

set(h.browse,'Callback',{@GUI_Callbacks,h});
set(h.save,'Callback',{@GUI_Callbacks,h});
set(h.new,'Callback',{@GUI_Callbacks,h});
set(h.open,'Callback',{@GUI_Callbacks,h});
set(h.preferences,'Callback',{@GUI_Callbacks,h});
end


function GUI_Callbacks(hObject,eventdata,h)
% GUI_Callbacks contains callback routines for all objects produced by GUI.

global Z current image_size pixel_size fgcolor bgcolor units methods nums
global message fresh ran separated mask original cbv templates CCC byvolume
global STATS backgroundavg each ticklocations barticks logcolor rnglog minlog
global Matches volumes tempmethods tags range mc oc undolist

switch hObject
    case h.zu
    case h.c.widthv
        % Set the height to same value as the width
        set(h.c.heightv,'String',get(h.c.widthv,'String'))
        set(h.c.widthv,'Value',str2double(get(h.c.widthv,'String')))
        height = get(h.c.widthv,'Value');
        set(h.c.heightv,'Value',height)
        image_size = height;
        [~,N] = size(Z);
        pixels = N;
        pixel_size = image_size/pixels;

        if fresh == 0
            set(h.original,'XLim',[0,image_size],'YLim',[0,image_size])
            set(original,'XData',[pixel_size,image_size],'YData',[pixel_size,image_size])

            if get(h.r.buttonm,'Value') == 1
                set(h.mask,'XLim',[0,image_size],'YLim',[0,image_size])
                set(mask,'XData',[pixel_size,image_size],'YData',[pixel_size,image_size])
            end
        end

        plotright(separated,h)
        if cbv == 1
            set(h.talk,'String','Press Volume to update feature volumes')
        end

    case h.c.heightv
    case h.c.backgroundv
        % Set color-by-volume to FALSE
            cbv = 0;
        % Display the thresholded image using this value, as with "New"
        % button
        lowerlim = str2double(get(h.c.backgroundv,'String'));
        current = Z.*(Z>=lowerlim);

        background = Z.*(Z<lowerlim);

        backgroundavg = mean(nonzeros(background));
        message{2} = [num2str(backgroundavg) get(h.zu,'String')];
        set(h.message,'String',message)

        current = imopen(current,strel('disk',2));

        % bwconncomp is used to identify contiguous pixels, i.e. individual
        % features. It returns a matrix where each feature is represented
        % by an arbitrary tag number instead of height data.
            CCC = bwconncomp(current);
            separated = labelmatrix(CCC);
            Props = {'Area','MajorAxisLength','MinorAxisLength','PixelList','PixelValues'};
            STATS = regionprops(CCC,current,Props);

            message{4} = num2str(CCC.NumObjects);
            set(h.message,'String',message)

        axes(h.mask)
        mask = image([pixel_size,image_size],[pixel_size,image_size],label2rgb(separated,prism(4096)));
        set(h.mask,'Position',[0.63 0.33 0.304 0.55],...
            'XAxisLocation','top','XColor',fgcolor,...
            'YColor',fgcolor,'YDir','reverse');
        xlabel(units{get(h.c.widthu,'Value')})
        ylabel(units{get(h.c.widthu,'Value')})
        set(h.vu,'Visible','Off')
        set(h.r.cover,'Visible','on')
        set(h.r.buttonm,'Value',1)

    case h.c.variancev
    case h.c.volume
        % Do nothing if no file has been loaded yet
        if isempty(Z)
            set(h.talk,'Load an image')
            return
        end

        % Color-code features by volume
            cbv = 1;
        % The volume of each feature is collected for comparison against
        % the template features' volumes. Height (above the averaged
        % background) and footprint data is collected as well for
        % convenient access by the statistical data output portion later
        % on. All data is in nm. each(particle,1): Tag each(particle,2):
        % Height each(particle,3): Footprint each(particle,4): Volume
        each = zeros(CCC.NumObjects,4);
        each(:,1) = 1:CCC.NumObjects;
        switch get(h.c.method,'Value')
            case 1
                for e = 1:CCC.NumObjects
                    each(e,2) = max(STATS(e).PixelValues)-backgroundavg;
                    each(e,3) = STATS(e).Area*(pixel_size*1000)^2;
                    % The volume of each feature is calculated explicitly,
                    % in a Riemann sum of pixel values, a departure from
                    % the accepted method of assuming that proteins adopt a
                    % spherical-cap shape.
                    each(e,4) = sum(STATS(e).PixelValues-backgroundavg)*(pixel_size*1000)^2;
                end
            case 2
                for e = 1:CCC.NumObjects
                    each(e,2) = max(STATS(e).PixelValues)-backgroundavg;
                    each(e,3) = STATS(e).Area*(pixel_size*1000)^2;
                    % Each protein is approximated as a spherical cap, the
                    % volume of which being V = (pi*h/6)*(3r^2+h^2), where
                    % the radius is taken as half the average of the major
                    % and minor axes.
                    diameter1 = STATS(e).MajorAxisLength;
                    diameter2 = STATS(e).MinorAxisLength;
                    radius = ((diameter1+diameter2)/4)*(pixel_size*1000);
                    each(e,4) = (pi*each(e,2)/6)*(3*radius^2+each(e,2)^2);
                end
        end

        % The various particles in the image are sorted by their volume,
        % and then displayed with a colormap representing their volumes.

        volumes = each(:,4);
        tags = each(:,1);
        [volumes, IX] = sort(volumes);
        tags = tags(IX);
        byvolume = cast(separated,'double');


        % The remaining particles are colorcoded by volume on a logarithmic
        % scale. The log10 of each particle is scaled to fall between 2 and
        % 64 (colorscale value of 1 corresponds to a volume of 0 - i.e.,
        % the background)

        logvolumes = log10(volumes);
        minlog = min(logvolumes);
        rnglog = max(logvolumes)-minlog;
        logvolumes64 = 1+63*(logvolumes-minlog)/rnglog;

        % Replace the tag value on the mask for each particle with its
        % scaled volume.
        for i = 1:length(tags)
            byvolume(byvolume==tags(i)) = logvolumes64(i);
        end

        % Set the colormap to jet, but with 0 set to white and the largest
        % bin to black.
        colormap jet(64)
        logcolor = colormap;
        logcolor(1,:) = [1 1 1];
        logcolor(end,:) = [0 0 0];

        ticklocations = [10 20 30 40 50 60];
        tickvalues = 10.^((ticklocations-1)/63*rnglog+minlog);

        barticks = cell(1,1);
        for b = 1:length(ticklocations)
            barticks{b} = sprintf('%-10.2g',tickvalues(b));
        end

        plotright(separated,h)

        [logcolor(round(logvolumes64),:) logvolumes64 tags]


    case h.c.method
    case h.c.numtempv
        % Make visible the correct number of templates
            for tem = 1:get(h.c.numtempv,'Value')
                eval(['set(h.c.temp' num2str(tem) ',''Visible'',''On'')'])
            end
            for tem = get(h.c.numtempv,'Value')+1:5
                eval(['set(h.c.temp' num2str(tem) ',''Visible'',''Off'')'])
            end
    case h.c.howtemp
        switch get(h.c.howtemp,'Value')
            case 1 % Automatic: Make the template boxes text

                set(h.c.temp1,'Style','Text','String','')
                set(h.c.temp2,'Style','Text','String','')
                set(h.c.temp3,'Style','Text','String','')
                set(h.c.temp4,'Style','Text','String','')
                set(h.c.temp5,'Style','Text','String','')
                set(h.talk,'String','Template volumes will be chosen automatically')
            case 2 % Select: Make the template boxes text
                set(h.c.temp1,'Style','Text','String','')
                set(h.c.temp2,'Style','Text','String','')
                set(h.c.temp3,'Style','Text','String','')
                set(h.c.temp4,'Style','Text','String','')
                set(h.c.temp5,'Style','Text','String','')

                if cbv == 0
                    set(h.talk,'String','Run Volume calculation first, then re-select option')
                    return
                end

                % Show the mask image.
                    % Check if image has been loaded yet
                    if fresh == 1
                        return
                    end

                    set(h.r.buttonm,'Value',1)

                    axes(h.mask)

                    set(h.r.buttonm,'Value',1)
                    set(h.vu,'Visible','on')
                    set(h.r.cover,'Visible','off')
                    mask = image([pixel_size,image_size],[pixel_size,image_size],byvolume);
                    set(h.mask,'Position',[0.63 0.33 0.35 0.55],...
                        'XAxisLocation','top','XColor',fgcolor,...
                        'YColor',fgcolor,'YDir','reverse');
                    xlabel(units{get(h.c.widthu,'Value')})
                    ylabel(units{get(h.c.widthu,'Value')})
                    colormap(logcolor)
                    mc = colorbar('Peer',h.mask,'YTick',ticklocations,'YTickLabel',barticks);

                % Allow selection of templates
                    for tem = 1:get(h.c.numtempv,'Value')
                        set(h.talk,'String','Select particles to act as templates from either image')
                        [x,y] = ginput(1);
                        while x <= 0 || x > get(h.c.widthv,'Value') || y <= 0 || y > get(h.c.heightv,'Value')
                            set(h.talk,'String','Selection out of range. Select a particle within the image')
                            [x,y] = ginput(1);
                        end
                        [ypixels,xpixels] = size(Z);
                        X = round(x/image_size*xpixels);
                        Y = round(y/image_size*ypixels);
                        while byvolume(Y,X) == 0
                            set(h.talk,'String','No particle selected. Re-select a template.')
                            [x,y] = ginput(1);
                            [ypixels,xpixels] = size(Z);
                            X = round(x/image_size*xpixels);
                            Y = round(y/image_size*ypixels);
                        end

                        % Convert the scaled volume data back
                        vol = 10^((byvolume(Y,X)-2)/62*rnglog+minlog); %#ok<NASGU>

                        % Display the template volumes in the appropriate
                        % boxes
                        eval(['set(h.c.temp' num2str(tem) ',''String'', sprintf(''%10.f'',vol))']);
                    end

                    set(h.talk,'String','')
            case 3 % Enter: Make the template boxes editable
                set(h.c.temp1,'Style','Edit','String','')
                set(h.c.temp2,'Style','Edit','String','')
                set(h.c.temp3,'Style','Edit','String','')
                set(h.c.temp4,'Style','Edit','String','')
                set(h.c.temp5,'Style','Edit','String','')

                set(h.talk,'String','Enter template volumes in the boxes')
        end
    case h.c.run
        if ran == 0 % Sorting has not already been performed
            % Separate features from the image into groups corresponding to
            % the templates. If specificied, determine the templates
            % automatically using Lloyd's Algorithm

            ntem = get(h.c.numtempv,'Value');

            % Make sure all fields have values
            if strcmp(get(h.c.widthv,'String'),'')==1 || strcmp(get(h.c.backgroundv,'String'),'')==1 || strcmp(get(h.c.variancev,'String'),'')==1
                set(h.talk,'String','Make sure all fields have values, then press Sort again')
                return
            end
            switch get(h.c.howtemp,'Value')
            case {2,3} % If manual template entry or selection, make sure templates have values
                for tem = 1:ntem
                    eval(['test = strcmp(get(h.c.temp' num2str(tem) ',''String''),'''');'])
                    if test == 1
                        set(h.talk,'String','Make sure all fields have values, then press Sort again')
                        return
                    end
                end
            end
            ran = 1;
            set(h.c.run,'String','Change Parameters')
            set(h.c.widthv,'Style','Text')
            set(h.c.backgroundv,'Style','Text')
            set(h.c.variancev,'Style','Text')
            set(h.c.volume,'Style','Text')
            set(h.c.method,'Style','Text','String',methods{get(h.c.method,'Value')})
            set(h.c.numtempv,'Style','Text','String',ntem)
            set(h.c.howtemp,'Style','Text','String',tempmethods{get(h.c.howtemp,'Value')})
            set(h.c.remove,'Style','Pushbutton')

            for tem = 1:ntem
                eval(['set(h.c.temp' num2str(tem) ',''Style'',''Text'')'])
                eval(['set(h.l.button' num2str(tem) ',''Visible'',''On'')'])
                eval(['set(h.r.button' num2str(tem) ',''Visible'',''On'')'])
            end
            for tem = ntem+1:5
                eval(['set(h.l.button' num2str(tem) ',''Visible'',''Off'')'])
                eval(['set(h.r.button' num2str(tem) ',''Visible'',''Off'')'])
            end



            % Set up a matrix to hold the template values
            templates = zeros(1,ntem);

            switch get(h.c.howtemp,'Value')
            case 1 % Automatic template selection: use Lloyd's algorithm

                %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
                % Iterative template matching
                %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
                % Select as initial templates volumes equally spaced within
                % the set of volumes.
                part = (max(volumes)-min(volumes))/(ntem+1);
                for tem = 1:ntem
                    templates(tem) = min(volumes)+part*tem;
                end
                inputs = ntem;
                var = str2double(get(h.c.variancev,'String'));

                % A cell is created to store data on the various template
                % particles and their corresponding matches.
                % Matches{1,template}: Template particle volume
                % Matches{2,template}: Color-coded (by tag number) particle
                % map Matches{3,template}: Original-scale particle map
                % Matches{4,template}: List of particle tags
                % Matches{5,template}: Individual particle data (tag,
                % height,
                %                      footprint, Volume, deviation,
                %                      overlap)
                % Matches{6,template}: Aggregate particle data (total, av.
                % height,
                %                      distortion, av. volume)
                Matches = cell(6,inputs);

                % GENERALIZED LLOYD ALGORITHM (LBG algorithm) Features with
                % a volume that falls within the above margin of each
                % template volume are gathered and their respective
                % averages are taken. These averages then replace the
                % previous templates and the process is repeated until the
                % change in distortion between iterations falls below a
                % given threshold (epsilon).
                epsilon = .01;
                delta = 1;
                iteration = 1;
                Deltas = zeros(1,inputs);
                Means = zeros(1,inputs);

                % The "encompassed" structure contains information on the
                % templates (i.e., codewords), the set of features falling
                % within the boundaries of that template, and the
                % distortion of the given set.
                encompassed = struct('volumes',{},'tags',{},'distortion',{});

                while abs(delta) > epsilon
                    nottaken = volumes;

                    for s = 1:inputs
                        encompassed(s).volumes = zeros(1,length(volumes));
                        encompassed(s).tags = zeros(1,length(volumes));
                        i = 1;

                        % Features with a volume that is within the above
                        % margin of the template particle are copied into a
                        % new matrix. These features are also discluded
                        % from comparison with future templates to prevent
                        % data overlap.
                        for j = 1:length(nottaken)
                            if nottaken(j)<((1+var/100)*templates(s)) && nottaken(j)>((1-var/100)*templates(s)) && nottaken(j)~=0
                                encompassed(s).volumes(i) = nottaken(j);
                                encompassed(s).tags(i) = tags(j);
                                nottaken(j) = 0;
                                i = i + 1;
                            end
                        end
                        encompassed(s).volumes(i:end) = [];
                        encompassed(s).tags(i:end) = [];

                        % The average volume of each set is stored, to be
                        % used as a new template volume if the epsilon
                        % threshold is not met after this iteration.
                        Means(s) = mean(encompassed(s).volumes);

                        % Distortion of a set is the sum of the squared
                        % differences of each element from the template.
                        distances = encompassed(s).volumes-templates(s);
                        distortion = sum(distances.^2);

                        if iteration > 1;
                            Deltas(s) = (encompassed(s).distortion-distortion)/encompassed(s).distortion;
                        end
                        encompassed(s).distortion = distortion;
                    end
                    if iteration > 1
                        % In the (rare) case where a template volume
                        % encompasses only one feature, the distortion for
                        % that set will be zero, thus the Delta will be
                        % undefined. The following convoluted addressing is
                        % necessary for delta to always be defined.
                        delta = sum(Deltas(isfinite(Deltas)));
                    end
                    if abs(delta) <= epsilon
                        for s = 1:inputs
                            % The final template particle volumes are
                            % stored
                            Matches{1,s} = templates(s);
                            % The particle tags are stored
                            Matches{4,s} = encompassed(s).tags;
                        end
                    else
                        templates = Means;
                    end
                    iteration = iteration+1;
                end


                for tem = 1:ntem
                    eval(['set(h.c.temp' num2str(tem) ',''String'',num2str(templates(tem)));'])
                end

                nencompassed = length(unique(cat(2,encompassed.tags)));
                message{6} = num2str(nencompassed);
                set(h.message,'String',message)


            case {2,3} % User has input template values
                inputs = get(h.c.numtempv,'Value');
                var = str2double(get(h.c.variancev,'String'));

                for tem = 1:inputs
                    eval(['templates(tem) =  str2double(get(h.c.temp' num2str(tem) ',''String''));'])
                end

                % The "encompassed" structure contains information on the
                % templates (i.e., codewords), the set of features falling
                % within the boundaries of that template, and the
                % distortion of the given set.
                encompassed = struct('volumes',{},'tags',{},'distortion',{});
                Matches = cell(6,inputs);
                nottaken = volumes;

                for s = 1:inputs
                    encompassed(s).volumes = zeros(1,length(volumes));
                    encompassed(s).tags = zeros(1,length(volumes));
                    i = 1;

                    % Features with a volume that is within the specified
                    % margin of the template particle are copied into a new
                    % matrix. These features are also discluded from
                    % comparison with future templates to prevent data
                    % overlap.
                    for j = 1:length(nottaken)
                        if nottaken(j)<((1+var/100)*templates(s)) && nottaken(j)>((1-var/100)*templates(s)) && nottaken(j)~=0
                            encompassed(s).volumes(i) = nottaken(j);
                            encompassed(s).tags(i) = tags(j);
                            nottaken(j) = 0;
                            i = i + 1;
                        end
                    end
                    encompassed(s).volumes(i:end) = [];
                    encompassed(s).tags(i:end) = [];

                    % The templates are stored
                    Matches{1,s} = templates(s);
                    % The particle tags are stored
                    Matches{4,s} = encompassed(s).tags;
                end

            end

            % The features corresponding to each set are placed in separate
            % images.
            for s = 1:inputs
                matches = zeros(size(Z));
                for n = 1:length(encompassed(s).tags)
                    [r,c] = find(separated==encompassed(s).tags(n));
                    for m = 1:length(r)
                        matches(r(m),c(m)) = separated(r(m),c(m));
                    end
                end

                % Store this color-coded particle map and the
                % original-color map
                Matches{2,s} = matches;
                ocolor = logical(matches).*Z;
                % Replace all pixels not corresponding to a feature with
                % the average background value
                ocolor(ocolor == 0) = backgroundavg;
                Matches{3,s} = ocolor;
            end

            for s = 1:inputs
                particle_list = Matches{4,s};
                Num_particles = length(particle_list);
                Individual = zeros(Num_particles,inputs+4);
                Aggregate = zeros(1,4);
                Error = zeros(1,2);
                [~,pixels] = size(Z);

                for n=1:Num_particles
                    lap = 6;
                    % Data on each individual matched protein is condensed
                    % into a matrix (tag, height, footprint, volume,
                    % deviation from the template, overlap with the other
                    % templates.
                    Individual(n,1) = particle_list(n);
                    Individual(n,2) = each(particle_list(n),2);
                    Individual(n,3) = each(particle_list(n),3);
                    Individual(n,4) = encompassed(s).volumes(n);
                    Individual(n,5) = 100*(Individual(n,4)-Matches{1,s})/Matches{1,s};
                    % Each particle is checked to see if it falls within
                    % the defined variance threshold of any of the other
                    % templates.
                    for over = 1:inputs
                        if over == s
                            continue
                        end
                        if Individual(n,4)<((1+var/100)*Matches{1,over})&&Individual(n,4)>((1-var/100)*Matches{1,over})
                            Individual(n,lap) = Matches{1,over};
                            lap = lap+1;
                        end
                    end
                end

                % Total number of matches to the given template
                Aggregate(1) = Num_particles;
                % Average height of the matches
                Aggregate(2) = mean(Individual(:,2));
                % Percent coverage of the scan by the matches
                Aggregate(3) = 100*sum(Individual(:,3))/(pixels*pixel_size*1000)^2;
                % Average volme of the matches
                Aggregate(4) = mean(Individual(:,4));
                % Standard deviation of the height data
                Error(1) = sqrt(mean(Individual(:,2).^2)-mean(Individual(:,2))^2);
                % Standard deviation of the volume data
                Error(2) = sqrt(mean(Individual(:,4).^2)-mean(Individual(:,4))^2);

                Aggregate(2,2) = Error(1);
                Aggregate(2,4) = Error(2);

                Matches{5,s} = Individual;
                Matches{6,s} = Aggregate;
            end




        else % Sorting has already been performed
            ran = 0;
            set(h.c.run,'String','Sort Features')
            set(h.c.widthv,'Style','Edit')
            set(h.c.backgroundv,'Style','Edit')
            set(h.c.variancev,'Style','Edit')
            set(h.c.volume,'Style','PushButton')
            set(h.c.method,'Style','PopUpMenu','String',methods)
            set(h.c.numtempv,'Style','PopUpMenu','String',nums)
            set(h.c.howtemp,'Style','PopUpMenu','String',tempmethods)
            set(h.c.remove,'Style','Text')
            set(h.c.undo,'Style','Text')

            for tem = 1:get(h.c.numtempv,'Value')
                eval(['set(h.l.button' num2str(tem) ',''Visible'',''Off'')'])
                eval(['set(h.r.button' num2str(tem) ',''Visible'',''Off'')'])
            end

            if get(h.c.howtemp,'Value') == 3
                % Enter: Make the template boxes editable
                set(h.c.temp1,'Style','Edit')
                set(h.c.temp2,'Style','Edit')
                set(h.c.temp3,'Style','Edit')
                set(h.c.temp4,'Style','Edit')
                set(h.c.temp5,'Style','Edit')
            end


        end

        % Display full mask on right
        plotright(separated,h)
        set(h.r.buttonm,'Value',1)

        % And original image on left
        plotleft(Z,h)
        set(h.l.buttono,'Value',1)

        undolist=[];
    case h.c.remove
        % Allow user to select patches from template groups to remove them
        % from analysis.


            % Only activate if a template group is in view
            if get(h.r.buttonm,'Value') == 1 || get(h.r.buttonh,'Value') == 1
                set(h.talk,'String','Select a template group at right before removing patches')
                return
            elseif get(h.r.button1,'Value') == 1
                tem = 1;
            elseif get(h.r.button2,'Value') == 1
                tem = 2;
            elseif get(h.r.button3,'Value') == 1
                tem = 3;
            elseif get(h.r.button4,'Value') == 1
                tem = 4;
            elseif get(h.r.button5,'Value') == 1
                tem = 5;
            end
            set(h.talk,'String','Select patches from the image at right to discard')

            info = Matches{5,tem};
            particle_list = Matches{4,tem};
            cmatches = Matches{3,tem};
            matches = Matches{2,tem};
            [ypixels,xpixels] = size(matches);
            % The user clicks on a region he would like to discard. The
            % program finds the value underneath that point (the feature's
            % tag) and sets all elements in the matrix with that value to
            % zero.
            [x,y] = ginput(1);
            axes(h.mask)
            while isempty(x) == 0
                if x<=0 || x>1 || y<=0 || y>1
                    set(h.talk,'String','Selection out of range, reselect patch')
                    [x,y] = ginput(1);
                    continue
                end
                X = round(x/image_size*xpixels);
                Y = round(y/image_size*ypixels);
                discard = matches(Y,X);
                cmatches(matches==discard) = backgroundavg;
                matches(matches==discard) = 0;
                particle_list(particle_list == discard) = [];

                % If an actual feature was selected, store the feature's
                % information so it can be later replaced.
                if discard ~= 0
                    [~,old] = size(undolist);
                    undolist(1,old+1) = discard;
                    undolist(2,old+1) = tem;
                    ininfo = find(info(:,1)==discard);
                    undolist(3,old+1) = info(ininfo,2);
                    undolist(4,old+1) = info(ininfo,3);
                    undolist(5,old+1) = info(ininfo,4);
                    undolist(6,old+1) = info(ininfo,5);
                    for i=1:get(h.c.numtempv,'Value')-1
                        undolist(6+i,old+1) = info(ininfo,5+i);
                    end
                    info(ininfo,:)=[];
                    set(h.c.undo,'Style','Pushbutton')
                end

                Matches{2,tem} = matches;
                Matches{3,tem} = cmatches;
                Matches{4,tem} = particle_list;
                Matches{5,tem} = info;


                % The image with the features removed is displayed, and the
                % user is given the option to erase more features.
                mask = image([pixel_size,image_size],[pixel_size,image_size],byvolume.*logical(matches));
                set(h.mask,'Position',[0.63 0.33 0.35 0.55],...
                    'XAxisLocation','top','XColor',fgcolor,...
                    'YColor',fgcolor,'YDir','reverse');
                xlabel(units{get(h.c.widthu,'Value')})
                ylabel(units{get(h.c.widthu,'Value')})

                colormap(logcolor)
                mc = colorbar('Peer',h.mask,'YTick',ticklocations,'YTickLabel',barticks);

                set(h.talk,'String','Press Enter when done')
                set(h.info,'Data',Matches{5,tem})

                [x,y] = ginput(1);
            end
            set(h.talk,'String','')


    case h.c.undo
        % Replace patches previously removed
        set(h.talk,'String','Welcome to LAVA')
        % Find the tag of the last discarded patch
        [~,old] = size(undolist);
        discarded = undolist(1,old);
        tem = undolist(2,old);
        info = Matches{5,tem};
        matches = Matches{2,tem};
        cmatches = Matches{3,tem};

        matches(separated == discarded) = discarded;
        cmatches(separated == discarded) = 0;
        cmatches = cmatches + Z.*(separated == discarded);
        info(length(info),:) = undolist(2:end,old);

        Matches{2,tem} = matches;
        Matches{3,tem} = cmatches;
        Matches{5,tem} = info;

        % The image with the features removed is displayed, and the user is
        % given the option to erase more features.
        axes(h.mask)
        mask = image([pixel_size,image_size],[pixel_size,image_size],byvolume.*logical(matches));
        set(h.mask,'Position',[0.63 0.33 0.35 0.55],...
            'XAxisLocation','top','XColor',fgcolor,...
            'YColor',fgcolor,'YDir','reverse');
        xlabel(units{get(h.c.widthu,'Value')})
        ylabel(units{get(h.c.widthu,'Value')})

        colormap(logcolor)
        mc = colorbar('Peer',h.mask,'YTick',ticklocations,'YTickLabel',barticks);

        eval(['set(h.r.button' num2str(tem) ',''Value'',1)'])
        set(h.talk,'String','Press Enter when done')
        set(h.info,'Data',Matches{5,tem})
        set(h.c.undo,'Style','Pushbutton')

        undolist(:,old) = [];
        if isempty(undolist) == 1
            set(h.c.undo,'Style','Text')
        end

    case h.l.buttono
        % First freeze the h.mask colorbar and colormap, then unfreeze the
        % h.original, replot h.original, refreeze it, and unfreeze h.mask
        axes(h.mask)
        freezeColors
        cbfreeze(mc)

        axes(h.original)
        unfreezeColors
        cbfreeze(oc,'off')

        colormap hot
        original = image([pixel_size,image_size],[pixel_size,image_size],Z,'CDataMapping','scaled');
        set(h.original,'XAxisLocation','top','XColor',fgcolor,...
            'YAxisLocation','right','YColor',fgcolor,'YDir','reverse');
        %oc = colorbar('Peer',h.original,'Location','WestOutside');
        xlabel(units{get(h.c.widthu,'Value')})
        ylabel(units{get(h.c.widthu,'Value')})
        colormap(h.original,'hot')
        caxis(range);
        % Enhance contrast as a visual aid
        brighten(.5)
        freezeColors
        cbfreeze(oc)


        axes(h.mask)
        unfreezeColors
        cbfreeze(mc,'off')
        switch get(h.r.buttonh,'Value')
            case 1
                colormap jet(64)
            case 0
                colormap(logcolor)
        end

    case {h.l.button1,h.l.button2,h.l.button3,h.l.button4,h.l.button5}
        ltab = str2double(get(hObject,'String'));
        % The features are displayed in the original colorscale.

        % First freeze the h.mask colorbar and colormap, then unfreeze the
        % h.original, replot h.original, refreeze it, and unfreeze h.mask

                plotleft(Matches{3,ltab},h)


    case h.r.buttonm
        % Check if image has been loaded yet
        if fresh == 1
            return
        end
        set(h.info,'Visible','Off')
        % Check if volume calculation has been run yet
        if cbv == 0
            % Display the separated, arbitrarily colored image
            axes(h.mask)
            mask = image([pixel_size,image_size],[pixel_size,image_size],label2rgb(separated,prism(4096)));
            set(h.mask,'Position',[0.63 0.33 0.304 0.55],...
                'XAxisLocation','top','XColor',fgcolor,...
                'YColor',fgcolor,'YDir','reverse');
            xlabel(units{get(h.c.widthu,'Value')})
            ylabel(units{get(h.c.widthu,'Value')})
            set(h.vu,'Visible','Off')
            set(h.r.cover,'Visible','on')

        else
            % Display the separated, volume-colored image
            plotright(separated,h)
        end
    case h.r.buttonh
        % Display a histogram of pixel values in the original image. Label
        % with the upper value found at half the height of the peak.
        [N,X] = hist(nonzeros(Z),1000);
        half_max = find(N > max(N)/2,1,'last');
        lowerlim = X(half_max);

        set(h.vu,'Visible','off')
        set(h.r.cover,'Visible','on')
        set(h.info,'Visible','Off')
        cbfreeze(mc,'off')
        colorbar('Peer',h.mask,'off')
        suggestion = [' Half max @ ' num2str(lowerlim)];
        hist(h.mask,nonzeros(Z),1000)
        colormap jet(64)
        set(h.mask,'Position',[0.63 0.33 0.304 0.55],...
            'XAxisLocation','top','XColor',fgcolor,...
            'YColor',fgcolor,'YDir','normal');
        xlabel(['Height (' units{get(h.zu,'Value')} ')'])
        ylabel('Pixels')
        text(X(half_max),N(half_max),suggestion)

    case {h.r.button1,h.r.button2,h.r.button3,h.r.button4,h.r.button5}
        rtab = str2double(get(hObject,'String'));

        % The features are displayed and labeled with their respective
        % tags.
        plotright(Matches{2,rtab},h)

        % Display data in the table
        set(h.info,'Visible','on',...
            'Data',Matches{5,rtab});

    case h.browse
        % Pressing the 'Browse' button
        %
        % Allow user to manually select destination for save file. Returns
        % a variable containing the new path and set hfilename to display
        % this.

        new_directory = uigetdir;
        set(h.savefile,'String',new_directory);


    case h.save

        varname = get(h.current,'String');
        % Ensure filename does not contain spaces
        if isempty(strfind(varname,' ')) == 0
            set(h.talk,'String','Save file name cannot contain spaces')
            return
        end
        % Ensure volume and template data has been calculated
        if isempty(each)==1
            set(h.talk,'String','Perform Volume and Sorting calculations before saving data')
            return
        end
        if isempty(Matches)==1
            set(h.talk,'String','Perform Sorting calculation before saving data')
            return
        end


        % The metadata includes all data not already in Matches necessary
        % to replicate the current dataset.
        meta = [varname '_meta'];
        eval([varname '=Matches;'])
        metas = cell(4,2);
        metas{1,1} = get(h.current,'String');
        metas{1,2} = image_size;
        metas{2,1} = 'Sea Level:';
        metas{2,2} = get(h.c.backgroundv,'String');
        metas{3,1} = 'Averaged Background:';
        metas{3,2} = backgroundavg;
        metas{4,1} = 'Variance Threshold:';
        metas{4,2} = get(h.c.variancev,'String');
        eval([meta '=metas;'])

        % The user is given the option to save the current individual,
        % aggregate, and metadata to a file
        save([get(h.current,'String') '_processed'],varname,meta,'Z','byvolume','separated')

        % Individual data is also exported into a tab-delimited text file
        export = fopen([varname '_data.txt'],'w');
        % With the following header:
        fprintf(export,'%s\t%s\t%s\t%s\t%s\t%s\t%s\n','Template','Tag','Height','Footprint','Volume','Deviation','Overlap');

        % Export data in an easily-processed format
        [~,temps] = size(Matches);
        for tem = 1:temps
            ind = Matches{5,tem};
            if isempty(ind)
                continue
            end
            [features,~] = size(ind);
            for i = 1:features
                fprintf(export,'%f\t',Matches{1,tem});
                fprintf(export,'%i\t%f\t%f\t%f\t%i',ind(i,1),ind(i,2),ind(i,3),ind(i,4),ind(i,5));
                for te = 1:temps-1
                    fprintf(export,'\t%f',ind(i,5+te));
                end
                fprintf(export,'\n');
            end
        end

        % Also export data in a human-readable format
        export = fopen([varname '_data_hr.txt'],'w');
        for tem = 1:temps
            ind = Matches{5,tem};
            agg = Matches{6,tem};
            protein = sprintf('Template Volume %7.f',Matches{1,tem});
            fprintf(export,'==================================================================\n');
            fprintf(export,'%40s\n',protein);
            fprintf(export,'==================================================================\n');
            fprintf(export,'\n%30s\n','Individual');
            fprintf(export,' =================================================\n');
            fprintf(export,' Tag  Height  Footprint  Volume  Deviance  Overlap\n');
            fprintf(export,'        nm       nm^2     nm^3       %%           \n');
            fprintf(export,' ===  ======  =========  ======  ========  =======\n');
            % The number of potential overlaps is dependent on the number of
            % templates
            switch temps
                case 1
                    fprintf(export,'%4i %7.3f %10.4g %6.f %7.f\n',ind');
                case 2
                    fprintf(export,'%4i %7.3f %10.4g %6.f %7.f %7.f\n',ind');
                case 3
                    fprintf(export,'%4i %7.3f %10.4g %6.f %7.f %7.f %4.f\n',ind');
                case 4
                    fprintf(export,'%4i %7.3f %10.4g %6.f %7.f %7.f %4.f %4.f\n',ind');
                case 5
                    fprintf(export,'%4i %7.3f %10.4g %6.f %7.f %7.f %4.f %4.f %4.f\n',ind');
            end

            fprintf(export,'\n%26s\n','Aggregate');
            fprintf(export,' =========================================\n');
            fprintf(export,' Total  Avg. Height  Coverage  Avg. Volume\n');
            fprintf(export,'             nm          %%         nm^3   \n');
            fprintf(export,' =====  ===========  ========  ===========\n');
            fprintf(export,'%4i %12.3f %10.4f %10.f\n',agg(1,:)');
            fprintf(export,' STDEV %10.3f %21.f\n',agg(2,:)');
            fprintf(export,'\n');
        end
        fclose(export);

        set(h.talk,'String','Your file was saved')

    case h.new
        % User selects txt or csv file to open, display original image.
        % Estimate background height from hist, display mask accordingly

        % A matrix containing AFM topographical data is filtered in order
        % to display only the portions of that data that fits certain size
        % perameters. Note that the data should be leveled by external
        % software and converted to a .txt or .csv file format prior to use
        % with this program.


            [filename,path] = uigetfile('.txt','Select the .txt or .csv file to import');
            Z = importdata([path filename]);

            filename(end-3:end) = [];



            set(h.current,'Visible','On','String',filename)
            set(h.savefile,'String',path)

            if isstruct(Z) == 1
                disp(Z.textdata{2})
                Z = Z.data;
            end

            % Convert the data to nanometers
            Z = Z*10^9;
            image_size = get(h.c.widthv,'Value');
            [~,N] = size(Z);
            pixels = N;
            pixel_size = image_size/pixels;

        % If an image is already open, unfreeze the colormap and colorbar
        % and reset object visibilities before continuing.
            if fresh == 0

                message{2} = '';
                message{4} = '';
                message{6} = '';

                set(h.c.widthv,'String','1','Value',1,'Style','Edit');
                set(h.c.heightv,'String','1','Value',1);
                set(h.c.variancev,'String','30','Style','Edit');
                set(h.c.method,'Value',1,'Style','PopUp','String',methods);
                set(h.c.numtempv,'Value',1,'Style','PopUp','String',nums);
                set(h.c.howtemp,'Style','PopUp','String',tempmethods);
                set(h.c.backgroundv,'Style','Edit')
                set(h.c.volume,'Style','Pushbutton')
                set(h.c.run,'String','Sort Features')
                ran = 0;
                set(h.info,'Visible','off');

                set(h.l.buttono,'Value',1);
                set(h.l.button5,'Visible','off');
                set(h.l.button4,'Visible','off');
                set(h.l.button3,'Visible','off');
                set(h.l.button2,'Visible','off');
                set(h.l.button1,'Visible','off');

                set(h.r.button5,'Visible','off');
                set(h.r.button4,'Visible','off');
                set(h.r.button3,'Visible','off');
                set(h.r.button2,'Visible','off');
                set(h.r.button1,'Visible','off');

                set(h.c.temp1,'Visible','off');
                set(h.c.temp2,'Visible','off');
                set(h.c.temp3,'Visible','off');
                set(h.c.temp4,'Visible','off');
                set(h.c.temp5,'Visible','off');

                plotleft(Z,h)
                % Use "Half Max" suggestion from histogram as initial estimate for
                % background height
                    [N,X] = hist(nonzeros(Z),1000);
                    half_max = find(N > max(N)/2,1,'last');
                    lowerlim = X(half_max);
                    set(h.c.backgroundv,'String',num2str(lowerlim));

                % Display the thresholded image using this initial estimate
                    current = Z.*(Z>lowerlim);

                    background = Z.*(Z<lowerlim);
                    backgroundavg = mean(nonzeros(background));
                    message{2} = [num2str(backgroundavg) get(h.zu,'String')];
                    set(h.message,'String',message)

                    % The image is morphologically 'opened,' i.e. eroded and then
                    % dilated using the same structuring element (a flat, circular
                    % neighborhood of approximate radius 4 pixels). This process
                    % reduces noise in the image, eliminated small (radius <= 2
                    % pixels) features in addition to aberations such as thin
                    % horizontal scars. This process is intended to facilitate the
                    % Feature Separation algorithm below in isolating more accurate
                    % representations of the individual particles. This does, of
                    % course make two basic assumptions: that the particles of
                    % interest are roughly circular, and that they are occupy an
                    % area greater than 13 pixels (52 nm^2 on a 1x1 um scan.
                        current = imopen(current,strel('disk',2));


                    % bwconncomp is used to identify contiguous pixels, i.e.
                    % individual features. It returns a matrix where each feature
                    % is represented by an arbitrary tag number instead of height
                    % data.
                        CCC = bwconncomp(current);
                        separated = labelmatrix(CCC);
                        Props = {'Area','MajorAxisLength','MinorAxisLength','PixelList','PixelValues'};
                        STATS = regionprops(CCC,current,Props);

                        message{4} = num2str(CCC.NumObjects);
                        set(h.message,'String',message)


                axes(h.mask)
                mask = image([pixel_size,image_size],[pixel_size,image_size],label2rgb(separated,prism(4096)));
                set(h.mask,'Position',[0.63 0.33 0.304 0.55],...
                    'XAxisLocation','top','XColor',fgcolor,...
                    'YColor',fgcolor,'YDir','reverse');
                xlabel(units{get(h.c.widthu,'Value')})
                ylabel(units{get(h.c.widthu,'Value')})
                set(h.vu,'Visible','Off')
                set(h.r.cover,'Visible','on')
                set(h.r.buttonm,'Value',1)

                set(h.talk,'String','Enter the width of the scanned area')
                return

            end
            fresh = 0;
            cbv = 0;

        % Display the selected file as an image
            axes(h.original)
            original = image([pixel_size,image_size],[pixel_size,image_size],Z,'CDataMapping','scaled');
            set(h.original,'XAxisLocation','top','XColor',fgcolor,...
                'YAxisLocation','right','YColor',fgcolor,'YDir','reverse');
            oc = colorbar('Peer',h.original,'Location','WestOutside');
            colorbar('Peer',h.mask,'Off')
            xlabel(units{get(h.c.widthu,'Value')})
            ylabel(units{get(h.c.widthu,'Value')})
            colormap(h.original,'hot')
            range = caxis;
            % Enhance contrast as a visual aid
            brighten(.5)
            freezeColors
            cbfreeze(oc)


            colormap jet(64)
        % Use "Half Max" suggestion from histogram as initial estimate for
        % background height
            [N,X] = hist(nonzeros(Z),1000);
            half_max = find(N > max(N)/2,1,'last');
            lowerlim = X(half_max);
            set(h.c.backgroundv,'String',num2str(lowerlim));

        % Display the thresholded image using this initial estimate
            current = Z.*(Z>lowerlim);

            background = Z.*(Z<lowerlim);
            backgroundavg = mean(nonzeros(background));
            message{2} = [num2str(backgroundavg) get(h.zu,'String')];
            set(h.message,'String',message)

            % The image is morphologically 'opened,' i.e. eroded and then
            % dilated using the same structuring element (a flat, circular
            % neighborhood of approximate radius 4 pixels). This process
            % reduces noise in the image, eliminated small (radius <= 2
            % pixels) features in addition to aberations such as thin
            % horizontal scars. This process is intended to facilitate the
            % Feature Separation algorithm below in isolating more accurate
            % representations of the individual particles. This does, of
            % course make two basic assumptions: that the particles of
            % interest are roughly circular, and that they are occupy an
            % area greater than 13 pixels (52 nm^2 on a 1x1 um scan.
                current = imopen(current,strel('disk',2));


            % bwconncomp is used to identify contiguous pixels, i.e.
            % individual features. It returns a matrix where each feature
            % is represented by an arbitrary tag number instead of height
            % data.
                CCC = bwconncomp(current);
                separated = labelmatrix(CCC);
                Props = {'Area','MajorAxisLength','MinorAxisLength','PixelList','PixelValues'};
                STATS = regionprops(CCC,current,Props);

                message{4} = num2str(CCC.NumObjects);
                set(h.message,'String',message)

            axes(h.mask)
            mask = image([pixel_size,image_size],[pixel_size,image_size],label2rgb(separated,prism(4096)));
            set(h.mask,'Position',[0.63 0.33 0.304 0.55],...
                'XAxisLocation','top','XColor',fgcolor,...
                'YColor',fgcolor,'YDir','reverse');
            xlabel(units{get(h.c.widthu,'Value')})
            ylabel(units{get(h.c.widthu,'Value')})
            set(h.vu,'Visible','Off')
            set(h.r.cover,'Visible','on')
            set(h.r.buttonm,'Value',1)
            set(h.talk,'String','Enter the width of the scanned area')

    case h.open
        %[filename,path] = uigetfile('.txt','Select the .txt or .csv file
        %to import');
    case h.preferences

end
end

function plotleft(im,h)
global pixel_size image_size fgcolor logcolor original units range oc fresh cbv
        % The features are displayed in the original colorscale.

        % First freeze the h.mask and colormap, then unfreeze the
        % h.original, replot h.original, refreeze it, and unfreeze h.mask
        cbfreeze('off')

        axes(h.mask)
        set(h.mask,'Position',[0.63 0.33 0.304 0.55])
        freezeColors

        axes(h.original)
        unfreezeColors

        original = image([pixel_size,image_size],[pixel_size,image_size],im,'CDataMapping','scaled');
        set(h.original,'XAxisLocation','top','XColor',fgcolor,...
            'YAxisLocation','right','YColor',fgcolor,'YDir','reverse');
        %oc = colorbar('Peer',h.original,'Location','WestOutside');
        xlabel(units{get(h.c.widthu,'Value')})
        ylabel(units{get(h.c.widthu,'Value')})
        colormap hot
        oc = colorbar('Peer',h.original,'Location','WestOutside');

        if fresh == 0
            range = caxis;
        else
            caxis(range);
        end

        % Enhance contrast as a visual aid
        brighten(.5)
        freezeColors
        cbfreeze(oc)

        axes(h.mask)
        unfreezeColors
        switch get(h.r.buttonh,'Value')
            case 1
                colormap jet(64)
            case 0
                if cbv == 1
                    colormap(logcolor)
                else
                    colormap prism(4096)
                end
        end
end

function plotright(im,h)

    global pixel_size image_size byvolume fgcolor mask units logcolor mc
    global ticklocations barticks CCC cbv

    % The features are displayed and labeled with their respective
    % tags.
    axes(h.mask)
    mask = image([pixel_size,image_size],[pixel_size,image_size],byvolume.*logical(im));
    if cbv == 1
        set(h.mask,'Position',[0.63 0.33 0.304 0.55])
    else
        set(h.mask,'Position',[0.63 0.33 0.35 0.55])
    end
    set(h.mask,'XAxisLocation','top','XColor',fgcolor,...
        'YColor',fgcolor,'YDir','reverse');
    xlabel(units{get(h.c.widthu,'Value')})
    ylabel(units{get(h.c.widthu,'Value')})

    set(h.vu,'Visible','on')
    set(h.r.cover,'Visible','off')
    colormap(logcolor)
    mc = colorbar('Peer',h.mask,'YTick',ticklocations,'YTickLabel',barticks);

    for n = 1:CCC.NumObjects
        [r,c] = find(im==n,1,'last');
        text(c*pixel_size,r*pixel_size,num2str(n))
    end



end