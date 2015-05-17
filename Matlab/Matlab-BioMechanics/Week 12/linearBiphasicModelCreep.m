function [uj] = linearBiphasicModelCreep(time, h, stressApp, Ha, Ko, strt, X, estMax)

   % Set length of output argument and counter variable prior to for loop
   interval = length(time);
   n_counter = zeros(1,interval);
   uj = zeros(1,interval);
   % Loop through Length
   for i = 1:interval
      % Take Summation
      for n = strt:estMax
         n_counter(i) = n_counter(i) + ( ((-1)^n)/((n+0.5)^2) ) * sin( (n+0.5)*pi*X/h ) * exp( -Ha*Ko*((n+0.5)^2) * (pi^2) * time(i)/h^2 );
      end
      % Find Displacement
      uj(i) = (-stressApp/Ha) * ( X-(2*h*n_counter(i)/(pi^2)) );
   end

end