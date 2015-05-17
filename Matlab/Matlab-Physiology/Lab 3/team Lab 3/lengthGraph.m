%% Length of Muscle vs Force of Contraction

L = [25, 27, 31.18, 31.4];
F = [9.388, 6.998, 4.215, 3.943];

figure

linearCoef = polyfit(L,F,1);
linearFit = polyval(linearCoef,L);
plot(L,F,'s', L,linearFit,'r-')
title('Experiment 3: Length of Muscle vs Force of Contraction')
xlabel('Length of Gastrocnemius (mm)'), ylabel('Force (g)')