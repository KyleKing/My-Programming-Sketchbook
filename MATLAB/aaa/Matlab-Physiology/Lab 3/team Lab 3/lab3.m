%% Lab 3


t = [0:1000:20];
L = [1:100:100];

P = zeros(length(t));

for j = 1:length(t)-1
    dt = (t(j+1)-t(j));
    dL = (L(j+1)-L(j));
    dP = dL/dt;
    Lse = Lse0

    P(j+1) = P(j) + dP;
end

 disp(P);