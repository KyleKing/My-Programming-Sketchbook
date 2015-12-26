function [width, events] = fwhm(x,y)
    % Full-Width at Half-Maximum (FWHM) of the % waveform y(x) and
    % its polarity, but ignores incomplete pulses on either end of waveform
    % The FWHM result in 'width' will be in units of 'x'
    %
    % The code was developed by an unknown author.
    % Rev 1.2, April 2006 (Patrick Egan) link: http://www.mathworks.com/matlabcentral/fileexchange/10590-fwhm
    % Rev 2.0, February 2015 (Kyle King)

% Assume 1 pulse
    % Find locations (x) of half of ymax
    yMaxShift = y - 0.5*max(y);
    signY(yMaxShift> 0) = 1; signY(yMaxShift<= 0) = 0; % convert to binary
    events = find(diff(signY) ~= 0); % find sign change (i.e pre-half max)

% Need to account for low resolution and take average of two points

    % Find width at half max
    width = x(events(2)) - x(events(1));

    % % Plot Confirmation
    % [~,centerIndex] = max(y);
    % plot(x(centerIndex), y(centerIndex), 'b+')
    % plot(x(events), y(events), 'r+')
    % plot([x(events(1)); x(events(2))], [y(events(1)); y(events(2))], 'r-');

% Consider a negative pulse - max of negative y
% Or a second pulse with more than 2 events
% Then error checking of odd # indexes with special divide by 2 equation mod(1:8,2)


    % % Reduce to fraction of max amplitude and calculate array size
    % N = length(y);
    % halfMax = 0.5*max(y);
    % % % Check for change in sign and record events
    % signY(y > 0) = 1; signY(y <= 0) = 0;
    % events = find(diff(signY) ~= 0);
    % Nevents = length(events);
    % Pol = sign(y(events(1:Nevents)+1));
    % % Split pulses
    % for i = 1:Nevents-1
    %   [~,centerindex] = max(Pol(i)*y(events(i):events(i+1)));
    % end


% Original code with some edits
    % % determine first pulse polarity then center index (location)
    % i = 1; % Check first array index
    % if y(i) < halfMax
    %     [~,centerindex] = max(y);
    %     Pol = +1; disp('Pulse Polarity = Positive')
    % else
    %     [~,centerindex] = min(y);
    %     Pol = -1; disp('Pulse Polarity = Negative')
    % end
    % i = i + 1; % continue indexing
    % while sign(y(i)-halfMax) == sign(y(i-1)-halfMax) % while same polarity
    %     i = i+1;
    % end                                   %first crossing is between v(i-1) & v(i)
    % interp = (halfMax-y(i-1)) / (y(i)-y(i-1));
    % tlead = x(i-1) + interp*(x(i)-x(i-1))
    % i = centerindex+1;                    %start search for next crossing at center
    % while ((sign(y(i)-halfMax) == sign(y(i-1)-halfMax)) & (i <= N-1))
    %     i = i+1;
    % end
    % if i ~= N
    %     Ptype = 1;
    %     disp('Pulse is Impulse or Rectangular with 2 edges')
    %     interp = (halfMax-y(i-1)) / (y(i)-y(i-1));
    %     ttrail = x(i-1) + interp*(x(i)-x(i-1));
    %     width = ttrail - tlead;
    % else
    %     Ptype = 2;
    %     disp('Step-Like Pulse, no second edge')
    %     ttrail = NaN;
    %     width = NaN;
    % end
end