%% COMSOL Data-Fit Model
% BIOE332 - Group Project
% Hollow Fiber Membrane Bio-reactors
clc, close all

% Import Files
names = {'std_oxy.txt'};
% names = {'std_oxy.txt', 'std_glu.txt'};
figure; hold on
for i=1:length(names)
	filename = sprintf('%s/CSV/%s', pwd, names{i});
	M = csvread(filename);

	% yyaxis left
	ylabel('Cell Density \delta')
	% Commented for Navid's Approach:
	% ylabel('Concentration')
	% ylim([0,1])

	MinConc = [0.2161, 5.3251]; % [Oxy, Glu]
	LineFtr = {'-', '--'};
	Rigged2 = ( M(:,2)-MinConc(i) )./( M(1,2)-MinConc(i) );
	% plot(M(:,1), M(:,2))
	% plot( M(:,1)./M(end,1), Rigged2 )
	if i == 2
		% Commented for Navid's Approach:
		% % Fit the really choppy Glucose Numerical Data
		% x = M(:,1)/10;
		% P = polyfit(x,Rigged2,6);
		% yfit = P(1)*x.^6+P(2)*x.^5+P(3)*x.^4+P(4)*x.^3+P(5)*x.^2+P(6)*x+P(7);
		% plot(x,yfit, LineFtr{i} )
	else
		% Commented for Navid's Approach:
		% plot( M(:,1)/10, Rigged2, LineFtr{i} )
		% Navid's Approach:
		plot(M(:,2), exp(0.0518.*M(:,2)))
		% Our own constants:
		% cells(1)/exp(0.518.*M(1,2)) = 5.3770
		% cells(1)/exp(700.*M(1,2))
		% plot(M(:,1)/10,  7.9493e-48*exp(518.*M(:,2)))
		% plot(M(:,1)/10,  4.7001e-65*exp(700.*M(:,2)))
	end

end

% % % Graph Ghost Cell Data
% % yyaxis right
% % ylabel('Ghost Cell Distribution Data')
% % % Commented for Navid's Approach:
% % % ylim([0,1])

% distance = [0 1 3 5 7 9 11 13];
% cells = [86 77 59 40 19 20 20 18];
% Rigged1 = ( cells-cells(end) )./( cells(1)-cells(end) );
% % scatter(distance(2:end)./distance(end), Rigged1(2:end), '*')
% % scatter(distance(2:end), Rigged1(2:end), '*')
% scatter(distance(2:end), cells(2:end), '*')

% % legend({'Oxygen Concentration', 'Glucose Concentration', 'Cell Density'})
% legend({'Cell density \delta', 'Cell Density from Kenny Paper'})
% title('Comparison of Cell Density to Glucose and Oxygen Concentrations')
% xlabel('Hollow Fiber Axial Distance (cm)')
xlabel('Oxygen Concentration (\muM)')
hold off
