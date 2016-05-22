syms x y z;

% create matrices in b = A * m_X form
A = [3, 3, 4; 6, 2, 5; 3, 2, 1];
m_X = [x; y; z];
b = [31; 38; 16];

% look for maximum value in matrix (i.e. 6) - pivot element
% Then switch the identity matrix around to shift the pivot element where you want it
% i.e. I becomes:
I = [0,1,0; 1,0,0; 0,0,1;]; % from: I = [1,0,0; 0,1,0; 0,0,1;]
% I = [1,0,0; 0,0,1; 0,1,0;]; ....swap columns

% Do this
IA = I*A;
Ib = I*b;

% get rid of bottom left corner (-row 2/3 divided by row 1 all in column 1)
I = [1, 0, 0; (-IA(2,1)/IA(1,1)), 1, 0; (-IA(3,1)/IA(1,1)), 0, 1];
IAA = I*IA;

% then bottom middle (i.e. moved down one row and over one column)
% don't touch bottom right quadrant
I = [1, 0, 0; 0, 1, 0; 0, (-IAA(3,2)/IAA(2,2)), 1];
IAAA = I*IAA;

% Notes:
% [r, c] = size(A) = [3, 3]
% Find max value of matrix: max(max(A)) ([I,J] = find(A == max(A(:))))
% if row changes, do above
% if column changes, multiply I matrix by m_X and switch 1's
% build identity matrix: I = diag(ones(1, r))

% answer matrix....

