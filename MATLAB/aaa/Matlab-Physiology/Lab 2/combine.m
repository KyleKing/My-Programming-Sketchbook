function combined = combine(ArrayA, ArrayB, A, B)
% Receives two arrays that indicate the location of a type of event
% Conserves the type of event while merging the two arrays by overwiriting the events of B with A
%
% See also mathematica.m and nextMatch.m

  % Prep for looping with initilialization of needed variables
  lenA = length(ArrayA); lenB = length(ArrayB);
  combined = []; j = 1; k = 1;

  % Preserve Identity of Identifing Peaks, if needed
  if length(ArrayB(1,:)) == 2
    B = ArrayB(:,2);
  else
    B = linspace(B,B,length(ArrayB(:,1)))';
  end

  % Loop through the arays provided into one long array, combined
  for i = 1:(lenB+lenA)
    if k > lenA
      % If every value of A is represented, i.e. past the max of arrayA:
      combined(i,:) = [ArrayB(j), B(j)];
      j = j+1;
    elseif j > lenB
      % If every value of B is represented
      combined(i,:) = [ArrayA(k), A];
      k = k + 1;
    elseif ArrayB(j) < ArrayA(k)
      % Check if current B value occurs before the current A
      combined(i,:) = [ArrayB(j), B(j)];
      j = j + 1;
    elseif ArrayB(j) >= ArrayA(k)
      % Check if current B value is the same or less than the current A
      combined(i,:) = [ArrayA(k), A];
      k = k + 1;
    else
     % disp('Else') % for testing
    end
  end
end