function locs = nextMatch(Peaks, P)
% Receives a combined array of multiple types of events
% Then checks for the type of event, P and writes these selected events to an array locs
%
% See also mathematica.m, combined.m

  % Initialize locations array
  locs = [];

  % for array of interest
  for i = 1:length(Peaks)
    % Checks if particular peak is present
    if Peaks(i, 2) == P
      % Then save location
      locs = [locs; Peaks(i,1)];
    end
  end
end