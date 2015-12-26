function [uj, Xj] = linearBiphasicModelRelax(t0, t, vo, h, Ha, Ko, strt, estMax)

   K = Ko;                             % Account for Typo
   interval = 1000;                  % Set interval to be 1000
   Xj = linspace(0, h, interval);   % Set Xj value based on height
   n_counter = zeros(1, interval);  % Set counter variable for summation
   uj = zeros(1, interval);           % Set output argument length

   % Loop through Length
   for i = 1:interval
      % Account for variation in equations
      if (t >= 0 && t <= t0)
         % Take Summation
         for n = strt:estMax
            n_counter(i) = n_counter(i) + ( ((-1)^n/(n^3)) * ( 1 - exp( -n^2*pi^2*Ha*Ko*t/(h^2) ) ) * ( sin(n*pi*Xj(i)/h) ) );
         end
         % Find Displacement
         uj(i)=( -vo*t*Xj(i)/h ) - ( (2*vo*(h^2)/(Ha*Ko*pi^3)) * n_counter(i) );
      elseif (t > t0)
         % Take Summation
         for n = strt:estMax
            n_counter(i) = n_counter(i) + ( ((-1)^n/(n^3)) * exp( (-n^2*pi^2*Ha*Ko*t)/(h^2) ) * ( exp( ((n^2)*(pi^2)*Ha*Ko*t0)/(h^2) ) - 1 ) * ( sin( (n*pi*Xj(i))/h) ) );
         end
         % Find Displacement
         uj(i)=( (-vo*t0*Xj(i))/h ) - ( ((2*vo*h^2)/(Ha*Ko*pi^3)) * n_counter(i) );
      end
   end

end