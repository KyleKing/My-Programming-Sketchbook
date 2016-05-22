function [gausselim, m_X, solution]= LabOneC1(A,m_X,b)
    % LabOneC1 calculates the concentration at different distance/time points
    % LabOneC1(A,m_X,b)
    % A: Square matrix for the constants multiplied by the variables
    % m_X: variables of interest - need to be in cells, use form: { 'x', ...}
    % b: Answers to the system
    %
    % see also LabOne.m and LabOneB1.m

% clc, clear all
% A = [33.4, 8.1, 34.5, 35.2; 49.4, 4.2, 49.4, 47.5; 68.3, 6.0, 38.5, 25.1; 57.1, 3.2, 31.2, 61.2];
% syms Po C Ph U; m_X = [Po; C; Ph; U];
% b = [489.8; 598.2; 692.7; 588.4];

% Set up variables for:
sizeB = size(b);
lengthB = sizeB(1); % the length of b (i.e. n = length(b))
sizeA = size(A); % the size of A (i.e. [f g] = size(A))
orderA = sizeA(1); % the order (i.e. order = [1:n])

% Use conditional statements to evaluate each scenario (i.e. if A is square and if A and b are the same length)
if (sizeA(1) == sizeA(2) && sizeA(1) == sizeB(1) )
  Sizecheck = 1; % pass
else
  Sizecheck = 0; % fail, not square or equal
end
% Include error messages that will alert the user of the program if these two ` requirements are not met
if Sizecheck == 0
  disp('A is not square and/or A and b are different lengths. Fix it pronto.')
  warning('off')
end

%initialize the orderArow vector
for i = 1:orderA
    orderArow(i) = i;
end
orderArow = orderArow';

% Create an augmented matrix made up of A and b as discussed in class
Ab = [A, b];

% Intialize a loop to check each column
for c =1:orderA-1;
    max = 0;
    r = 0;

    % 1. Find the maximum pivot element
    for countM = c:orderA
        if abs(Ab(orderArow(countM),c))>max % Location of max value
            max = abs(Ab(orderArow(countM),c));
            r = countM; % simplify only to the first maximum value through loops
        end
    end

    % Create a unit vector using the MATLAB functions diag and ones()
    eyeI = diag(ones(orderA, 1)'); % Same as eye(orderA)
    alterI = eyeI; % final I value
    % Make the rotated top quad
    for j =1:2
        altereyeI(j, 1) = eyeI(j, 2);
        altereyeI(j, 2) = eyeI(j, 1);
    end

    % This method isn't consistent
    % IA = alterI*A;
    % IB = alterI*b;

    % 2. Interchange the rows and columns to set the maximum element as the pivot
    tempAb = Ab;
    Ab(c, :) = tempAb(r, :);
    Ab(r, :) = tempAb(c, :);
    tempm_X = m_X;
    m_X(c) = tempm_X(r);
    m_X(r) = tempm_X(c);

    % 3. Perform Gaussian elimination
    for i = (c+1):orderA % cycle through each row except for the first
        R(i,c) = -Ab(i,c)/Ab(c,c);
        for j = c:orderA+1 % cycle through each column including the augmented one
            Ab(i,j) = Ab(i,j) + R(i,c)*Ab(c,j);
        end
    end
end

% 4. Perform back substitution to obtain a solution for x, y, and z
sol(orderA) = 0;
sol = sol';

sol(orderA) = Ab(orderArow(orderA),orderA+1)/Ab(orderArow(orderA),orderA);
i = orderA-1;

while i > 0
    sol(i) = (Ab(i,orderA+1) - Ab(i,i+1:orderA)*sol(i+1:orderA))/(Ab(i,i));
   i = i-1;
end

% Return values to the user
gausselim = Ab;
m_X = m_X;
solution = double(sol);
