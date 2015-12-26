% 0. Administrative
clc, clear all, close all
syms x y z;
syms Po C Ph U;

% create matrices in b = A * m_X form
% A = [3, 3, 4; 6, 2, 5; 3, 2, 1];
% m_X = [x; y; z];
% b = [31; 38; 16];
A = [33.4, 8.1, 34.5, 35.2; 49.4, 4.2, 49.4, 47.5; 68.3, 6.0, 38.5, 25.1; 57.1, 3.2, 31.2, 61.2];
m_X = [Po; C; Ph; U];
b = [489.8; 598.2; 692.7; 588.4];




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

% 1. Find the maximum pivot element
[r,c,v]= find(A == max(max(A(:)))); % Location of max value
if (length(r) > 1)
  r = r(1);  c = c(1); v = v(1); % simplify only to the first maximum value
end

  % Create a unit vector using the MATLAB functions diag and ones()
  I = diag(ones(orderA, 1)'); % Same as eye(orderA)
  alterI = I; % final I value
  % Make the rotated top quad
  for j =1:2
    alterI(j, 1) = I(j, 2);
    alterI(j, 2) = I(j, 1);
  end

% 2. Interchange the rows and columns to set the maximum element as the pivot
tempA = A;
A(1, :) = tempA(r, :);
A(r, :) = tempA(1, :);
tempb = b;
b(1) = tempb(r);
b(r) = tempb(1);
tempm_X = m_X;
m_X(1) = tempm_X(r);
m_X(r) = tempm_X(1);


% This method isn't consistent
% IA = alterI*A;
% IB = alterI*b;

% 3. Perform Gaussian elimination
Ielim = I;
% j = 1
for j = 1:orderA-1
  for i = 2:orderA
    Ielim(i, j) = (-A(i,j)/A(j,j));
  end
  A = Ielim*A;
  Ielim = I;
end

disp(A) % to prove the matrix is eliminated

% 4. Perform back substitution to obtain a solution for x, y, and z
% solution = zeros(orderA,1);
% for i = orderA:-1:1
%   solution(i,1) = b(i)  - IA(i, 1)*solution(1,1) - IA(i, 2)*solution(2,1) - IA(i, 3)*solution(3,1) - IA(i, 4)*solution(4,1);
% end

% disp(solution)
