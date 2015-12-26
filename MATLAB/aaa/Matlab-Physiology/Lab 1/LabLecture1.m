% Boilerplate starter-code:
clear
clc

A = 5;
B = [1, 2, 3, 4];
C = 2:2:8;
D = linspace(2,8,4);

E = [C D]; % Concatenate files

% t is time in hours
% b is battery power in %
for t = 1:5
    b = 100-(t*15);
    F(t) = b; % indexing
end

% plot batter power
t = 1;
while b>0
    b(t) = 100-(t*15); % index b
    t = t+1;
end
t = linspace(0,t,length(b)); % make t an array rather than a point
% subplot(1,2,1)
plot(t,b);


% Useful commands
% font = uisetfont; % Change font