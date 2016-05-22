function B = BreakMatrix(A)
	% Given a matrix with 999 in the first column (second is irrelevant)
	% at each desired breakpoint
	% Grab the numbers in between and make a 3D array
	% Note, the number of values in between the breakpoints must be consistent
	% Example:
	% A = [999 909; 1 2; 3 4; 999 999; 5 6; 7 8];
	% B = BreakMatrix([999 909; 1 2; 3 4; 999 999; 5 6; 7 8])

	if ~ismatrix(A)
	    error('Input must be a matrix with 2 columns')
	end

	Ai = size(A);
	I = find(A(:,1) == 999);
	Ii = length(I);
	I(Ii + 1) = Ai(1)+1;
	B = zeros(I(2) - I(1) - 1, 2, Ii);
	for idx = 1:Ii
		B(:,:,idx) = A( (I(idx) + 1):(I(idx+1) - 1), :);
	end
end
