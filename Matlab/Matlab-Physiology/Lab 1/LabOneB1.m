function Cf = LabOneB1(Csi, Vo, M, L, booleanPrint, booleanPlot)
  % LabOneB1 calculates the concentration at different distance/time points
  % LabOneB1(Csi, Vo, M, L, booleanPrint, booleanPlot)
  % Csi: Initial concentration
  % Vo: Initial velocty (assuming this is constant)
  % M: efficiency of each section at filtering out solute
  % L: Length of each section (not total length, just of each section)
  % booleanPrint: 1 = print out explanation of values / 0 = suppress conent
  % booleanPlot: 1 = subplot the two concentrations side by side/ 0 = suppress plot
  %
  % see also LabOne.m and LabOneC1.m

  Cs = Csi; Tl = 0; Tf = 0; % Establish counter variables

  if (booleanPrint == 1) % Check to see if data should be printed
    % Translate numbers into plain English for the user
    disp(['At l = ' num2str(Tl) ' cm and time = ' num2str(Tf)...
      ' s, the concentration is ' num2str(Cs) ' mM'])
  end

  for i=1:length(L)

    Tl = Tl + L(i); % Total Length (cm)
    Tf = Tl/Vo; % Final Time = total length / velocity initial
    Clast = Cs; % Store last variable
    Cs = Cs - M(i)*(L(i)/Vo); % Find concentration at given time
    Cchange = Cs - Clast;

    % Take key variables and combine into a string
    baseS = (['At l = ' num2str(Tl) ' cm and time = ' num2str(Tf) ...
     ' s, the concentration is ' num2str(Cs) ' mM']);
    if (Cchange == 0) % Determine is there was a change in concentration
      % create string to inform user there is no change
      changeS = ([10 ' and there is no change in concentration' 10]);
    else
      % create string to inform user there is a given amount of change
      changeS = ([10 ' and the change is ' num2str(Cchange) ' mM' 10]);
    end

    % Check to see if data should be printed
    if (booleanPrint == 1)
      disp([baseS changeS]) % Display strings
    end

    % Check to see if should plot
    if (booleanPlot == 1)
      Cf(i) = Cs;
    else
      Cf = Cs;
    end

  end
end