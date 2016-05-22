clc, close all, clear all
syms t
TimeToHit = solve('2*20+2*6*cos(2*pi*50*(t+0.020))-(t+0.020)*1500*100 = 0', t);

disp('Time to return = ')
disp(TimeToHit)
disp('seconds')

clear all

xi = [-1, 0, 1];
yi = [-1, 0, 1];
for i = 1:3
  for n = 1:3
    ai(i,n) = 30*exp(-((1.0-xi(i)).^2 + (0.8+yi(n)).^2)./8);
  end
end
imagesc(ai)
colorbar