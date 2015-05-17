%Kristina Dziki
%BIOE404 - HW 8

%Use the linear biphasic theory relations for uj(xj,t) during confined
%compression to compute the following for an articular cartilage plug with
%diameter = 8 mm, height=4 mm. Assume aggregate modulus (HA)=2 MPa,
%k0=1*10^-15 m^4/N-s (which is 0.001 mm^4/N-s). Top surface only can move
%(in j direction) and is freely permeable.

%% Part A
%Tissue subjected to confined creep compression load of 75 N, plot
%uj with respect to time from 0-20000 s. (One graph with curves for uj at
%xj=4 mm and xj=2 mm (mid-height)).
clc
clear all
close all

%Define constants
d=8; %mm
r=d/2; %mm
h=4; %mm
HA=2; %MPa
k0=0.001; %mm^4/N-s

%Find applied stress and define the time vector
Force=75; %N
Area=pi()*r^2; % mm^2
applied_stress=Force/Area; %MPa
time=0:20000; %seconds

%First: at the top of the specimen
xj=h;

%Vectors for values from the summation (for n=0 to 5) and then for the
%displacements at various xj values and time points
a=zeros(1,20001);
u=zeros(1,20001);

%For loop to calculate the values in a and u vectors
% for i=1:20001
%    for n=0:5
%        a(1,i)=a(1,i)+(((-1)^n)/((n+0.5)^2))*sin((n+0.5)*pi*xj/h)*exp(-HA*k0*((n+0.5)^2)*(pi^2)*time(1,i)/h^2);
%    end
%    %displacement:
%        u(1,i)=(-applied_stress/HA)*(xj-(2*h*a(1,i)/(pi^2)));
% end
[u] = linearBiphasicModelCreep(time, h, applied_stress, HA, k0, 0, 1, xj, 5);


figure (1)
plot(time,u,'b')
xlabel('Time (s)')
ylabel('Displacement (mm)')
title('Displacement vs. Time at the Top and Midheight of the Specimen')
hold on

%Second, at the midheight of the specimen
xj_midheight=h/2;

%Vectors for values from the summation (for k=0 to 5) and then for the
%displacements at various xj values and time points
b=zeros(1,20001);
v=zeros(1,20001);

%For loop to calculate the values in b and v vectors
% for j=1:20001
%    for k=0:5
%        b(1,j)=b(1,j)+(((-1)^k)/((k+0.5)^2))*sin((k+0.5)*pi*xj_midheight/h)*exp(-HA*k0*((k+0.5)^2)*(pi^2)*time(1,j)/h^2);
%    end
%    %displacement:
%        v(1,j)=(-applied_stress/HA)*(xj_midheight-(2*h*b(1,j)/(pi^2)));
% end

[v] = linearBiphasicModelCreep(time, h, applied_stress, HA, k0, 0, 1, xj_midheight, 5);

plot(time,v,'r')
hold on
legend('xj= h= 4mm','xj=h/2 = 2 mm')

% If the sample deforms uniformly, one would expect the displacement at the
% top surface to be double that at the midheight. At t=500 s, does this
% happen in the specimen? Explain why or why not.

disp(['The displacement at t=500 s at xj=4 mm is', num2str(u(500))])
disp(['The displacement at t=500 s at xj=2 mm is', num2str(v(500))])
u(500)/v(500)

% % The displacement at t=500 s for the top of the specimen is not 2 times the displacement at t=500 s for the midheight of the specimen. Rather, it is
% % 11.2626 times the displacement. This is because at t=500 s, the specimen has only been loaded for 0.025 (2.5%) of the total interval of the total time.
% % So the displacement at the top of the speciment is increasing at a much greater rate than the displacement at the midheight at t=500s, and thus, the
% % displacement is greater than the displacement in the middle (by over two times). The rate of change of the displacements won't become equal(reach
% % steady state) until much further on in the 20000 second long time interval
% % (i.e. the sample deforms non-uniformly since the top deforms at a much
% % faster rate in the beginning as compared to the mid-height).
% % % Part B
% % Under same loading conditions, on one graph, plot 3 curves for uj at the
% % top surface (xj=h=4 mm) for the same k0, if k0 decreased by one order of
% % magnitude, and if k0 increased by one order of magnitude. Explain how the
% % change in permeability affects deformation (displacement).
% clc
% clear all
% close all

% %Define constants
% d=8; %mm
% r=d/2; %mm
% h=4; %mm
% HA=2; %MPa
% k0=0.001; %mm^4/N-s
% k0_decr=0.0001;
% k0_incr=0.01;

% %Find applied stress and define the time vector
% Force=75; %N
% Area=pi()*r^2; % mm^2
% applied_stress=Force/Area; %MPa
% time=0:20000; %seconds
% xj=h;

% a=zeros(1,20001);
% u=zeros(1,20001);
% a_incr=zeros(1,20001);
% u_incr=zeros(1,20001);
% a_decr=zeros(1,20001);
% u_decr=zeros(1,20001);


% %For loop to calculate the values in a and u vectors
% for i=1:20001
%    for n=0:5
%        a(1,i)=a(1,i)+(((-1)^n)/((n+0.5)^2))*sin((n+0.5)*pi*xj/h)*exp(-HA*k0*((n+0.5)^2)*(pi^2)*time(1,i)/h^2);
%    end
%    %displacement:
%        u(1,i)=(-applied_stress/HA)*(xj-(2*h*a(1,i)/(pi^2)));
% end

% figure (2)
% plot(time,u,'b')
% hold on

% %For loop to calculate the values in a and u vectors
% for i=1:20001
%    for n=0:5
%        a_incr(1,i)=a_incr(1,i)+(((-1)^n)/((n+0.5)^2))*sin((n+0.5)*pi*xj/h)*exp(-HA*k0_decr*((n+0.5)^2)*(pi^2)*time(1,i)/h^2);
%    end
%    %displacement:
%        u_incr(1,i)=(-applied_stress/HA)*(xj-(2*h*a_incr(1,i)/(pi^2)));
% end

% plot(time,u_incr,'r')
% hold on

% %For loop to calculate the values in a and u vectors
% for i=1:20001
%    for n=0:5
%        a_decr(1,i)=a_decr(1,i)+(((-1)^n)/((n+0.5)^2))*sin((n+0.5)*pi*xj/h)*exp(-HA*k0_incr*((n+0.5)^2)*(pi^2)*time(1,i)/h^2);
%    end
%    %displacement:
%        u_decr(1,i)=(-applied_stress/HA)*(xj-(2*h*a_decr(1,i)/(pi^2)));
% end

% plot(time,u_decr,'g')

% xlabel('Time (s)')
% ylabel('Displacement (mm)')
% title('Displacement vs. Time at the Top for Various k0 values')
% legend('k0=0.001','k0=0.0001','k0=0.01')
% %Explanation: As you increase permeability, the rate of change of
% %displacement decreases (i.e. as you increase k0, the displacement
% %increases at a much faster rate). This is probably because as the
% %permeability increases, fluid is able to escape more easily from the
% %specimen, thereby making it easier for the specimen to deform (i.e. for
% %the top to move down).
% %% Part C
% %Load same tissue in S-R, apply 1 mm compressive displacement over 2
% %seconds. Plot uj with respect to depth for t=500 and 5000 s. Has material
% %reached equilibrium at 5000 s? How can you tell?

% clc
% clear all
% close all

% %Define constants
% d=8; %mm
% r=d/2; %mm
% h=4; %mm
% HA=2; %MPa
% k0=0.001; %mm^4/N-s
% time1=500;
% time2=5000;
% t0=2; %entire time for deformation
% v0=1/t0; %rate of deformation
% xj=0:0.05:4; %Every 0.05 mm, report data for the whole height from 0-4 mm
% L=length(xj);

% atime1=zeros(1,L);
% utime1=zeros(1,L);
% atime2=zeros(1,L);
% utime2=zeros(1,L);

% for i=1:L
%     for n=1:5
%         atime1(1,i)=atime1(1,i)+((-1)^n/n^3)*exp(-n^2*pi^2*HA*k0*time1/h^2)*(exp(n^2*pi^2*HA*k0*t0/h^2)-1)*sin(n*pi*xj(1,i)/h);
%         atime2(1,i)=atime2(1,i)+((-1)^n/n^3)*exp(-n^2*pi^2*HA*k0*time2/h^2)*(exp(n^2*pi^2*HA*k0*t0/h^2)-1)*sin(n*pi*xj(1,i)/h);
%     end
%         utime1(1,i)=(-v0*t0*xj(1,i)/h)-(2*v0*h^2/(HA*k0*pi^3))*atime1(1,i);
%         utime2(1,i)=(-v0*t0*xj(1,i)/h)-(2*v0*h^2/(HA*k0*pi^3))*atime2(1,i);
% end

% figure (1)
% plot(xj,utime1,xj,utime2)
% xlabel('depth (xj) (mm)')
% ylabel ('displacement (uj) (mm) ')
% title('Displacement uj with respect to depth at t=500s and t=5000s')
% legend('uj at 500s','uj at 5000s')
% hold on

% %At 5000s, the material has reached equilibrium. I can tell this
% %because the displacement is decreasing linearly as depth increases
% %(aka the displacement gradient is a constant negative slope).
% %% Part D
% %For the S-R case, calculate the predicted stress that would be measured at
% %the top of the specimen at each time (t=500 and t=5000s). Also, graph
% %fluid pressure with respect to depth at both time points.
% clc
% clear all
% close all

% %Define constants
% d=8; %mm
% r=d/2; %mm
% h=4; %mm
% HA=2; %MPa
% k0=0.001; %mm^4/N-s
% time1=500; %s
% time2=5000;%s
% t0=2; %entire time for deformation
% v0=1/t0; %rate of deformation
% xj=0:0.05:4; %Every 0.05 mm, report data for the whole height from 0-4 mm
% L=length(xj);

% atime1=zeros(1,L);
% utime1=zeros(1,L);
% atime2=zeros(1,L);
% utime2=zeros(1,L);

% % for i=1:L
% %     for n=1:5
% %         atime1(i)=atime1(i)+((-1)^n/n^3)*exp(-n^2*pi^2*HA*k0*time1/h^2)*(exp(n^2*pi^2*HA*k0*t0/h^2)-1)*sin(n*pi*xj(i)/h);
% %         atime2(i)=atime2(i)+((-1)^n/n^3)*exp(-n^2*pi^2*HA*k0*time2/h^2)*(exp(n^2*pi^2*HA*k0*t0/h^2)-1)*sin(n*pi*xj(i)/h);
% %     end
% %         utime1(i)=(-v0*t0*xj(i)/h)-(2*v0*h^2/(HA*k0*pi^3))*atime1(i);
% %         utime2(i)=(-v0*t0*xj(i)/h)-(2*v0*h^2/(HA*k0*pi^3))*atime2(i);
% % end

% for i=1:L
%     %t = 500s and t=5000s
%     for n = 1:5
%     atime1(1,i) = atime1(1,i) + (((-1)^n/n^3)*exp(-n^2*pi^2*HA*k0*time1/h^2)*(exp(-n^2*pi^2*HA*k0*t0/h^2)-1)*sin(n*pi*xj(1,i)/h));
%     atime2(1,i) = atime2(1,i) + (((-1)^n/n^3)*exp(-n^2*pi^2*HA*k0*time2/h^2)*(exp(-n^2*pi^2*HA*k0*t0/h^2)-1)*sin(n*pi*xj(1,i)/h));
%     end
%     utime1(1,i) = (-v0*t0*xj(1,i)/h)-(2*v0*h^2/(HA*k0*pi^3))*atime1(1,i);
%     utime2(1,i) = (-v0*t0*xj(1,i)/h)-(2*v0*h^2/(HA*k0*pi^3))*atime2(1,i);
% end

% %t=500 s, top
% duj_top_time1=utime1(81)-utime1(80);
% dxj_top_time1=xj(81)-xj(80);
% DispGrad_top_time1=duj_top_time1/dxj_top_time1;
% App_Stress_500s_top=HA*DispGrad_top_time1;
% disp(['The predicted stress in MPa at the top of the specimen at t=500s is ', num2str(App_Stress_500s_top)])

% %t=500 s, midheight
% duj_mid_time1=utime1(41)-utime1(40);
% dxj_mid_time1=xj(41)-xj(40);
% DispGrad_mid_time1=duj_mid_time1/dxj_mid_time1;
% App_Stress_500s_mid=HA*DispGrad_mid_time1;


% %t=5000s, top
% duj_top_time2=utime2(81)-utime2(80);
% dxj_top_time2=xj(81)-xj(80);
% DispGrad_top_time2=duj_top_time2/dxj_top_time2;
% App_Stress_5000s_top=HA*DispGrad_top_time2;
% disp(['The predicted stress in MPa at the top of the specimen at t=5000s is ', num2str(App_Stress_5000s_top)])

% %t=500 s, midheight
% duj_mid_time2=utime2(41)-utime2(40);
% dxj_mid_time2=xj(41)-xj(40);
% DispGrad_mid_time2=duj_mid_time2/dxj_mid_time2;
% App_Stress_5000s_mid=HA*DispGrad_mid_time2;

% %Fluid Pressure at 5000s
% FluidP_5000s=App_Stress_5000s_top-App_Stress_5000s_mid;
% disp(['The fluid pressure in MPa at the top of the specimen at t=5000s is ', num2str(FluidP_5000s)])

% %Plot fluid pressure w.r.t. depth at both time points

% %Initialize:
% duj500 = zeros(1,80);
% dxj = zeros(1,80);
% DispGrad_500 = zeros(1,80);
% AppStress_500 = zeros(1,80);
% duj5000 = zeros(1,80);
% DispGrad_5000 = zeros(1,80);
% AppStress_5000 = zeros(1,80);

% for m = 2:80
%     %t = 500s
%     duj500(m) = utime1(m+1) - utime1(m-1);
%     dxj(m) = xj(m+1) - xj(m-1);

%     %t = 5000s
%     duj5000(m) = utime2(m+1) - utime2(m-1);
% end

% DispGrad_500 = duj500./dxj;
% AppStress_500 = HA*DispGrad_500;

% DispGrad_5000 = duj5000./dxj;
% AppStress_5000 = HA*DispGrad_5000;

% % %Fluid Pressure at 500s
% % FluidP_500s=App_Stress_500s_top-App_Stress_500s_mid;
% % disp(['The fluid pressure in MPa at the top of the specimen at t=500s is ', num2str(FluidP_500s)])

% %Fluid Pressure = Applied Stress at top - Applied Stress at point of interest
% FluidP_500s = App_Stress_500s_top-AppStress_500;
% FluidP_5000s=App_Stress_5000s_top-AppStress_5000;



% % %To obtain same-length vectors for plotting, we must first eliminate the
% % %end values at 0mm and 4mm, which could not be estimated using the employed
% % %method
% % xjc_cut = xj_c(2:80);
% % Pf5e2_cut = Pf_5e2(2:80);
% % Pf5e3_cut = Pf_5e3(2:80);

% % figure(4); hold on;
% % plot(xjc_cut, Pf5e2_cut, 'b')
% % plot(xjc_cut, Pf5e3_cut, 'g')
% % legend('t = 500s','t = 5000s','location','northeast')
% % xlabel('Depth (mm)')
% % ylabel('Fluid Pressure (MPa)')
% % title ('Fluid Pressure Along Tissue Specimen at t=500s,5000s')







% % plot(xj,FluidP_500s,xj, FluidP_5000s)
% % xlabel('depth (mm)')
% % ylabel('Fluid Pressure (MPa)')
% % title('Fluid Pressure with respect to depth at t=500s and t=5000')

% % hold on
% % %Estimate du/dx at top (xj = 4mm) and midpoint (x = 2mm)
% %
% % %t = 500s
% % du5e2_top = u5e2(81) - u5e2(80);
% % dxjc_top = xj_c(81) - xj_c(80);
% % DG_top_5e2 = du5e2_top/dxjc_top;
% % SigmaApp_top_500s = HA*DG_top_5e2
% %
% % du5e2_mid = u5e2(42) - u5e2(40);
% % dxjc_mid = xj_c(42) - xj_c(40);
% % DG_mid_5e2 = du5e2_mid/dxjc_mid;
% % SigmaApp_mid_500s = HA*DG_mid_5e2
% %
% % %t = 5000s
% % du5e3_top = u5e3(81) - u5e3(80);
% % DG_top_5e3 = du5e3_top/dxjc_top;
% % SigmaApp_top_5000s = HA*DG_top_5e3
% %
% % du5e3_mid = u5e3(42) - u5e3(40);
% % DG_mid_5e3 = du5e3_mid/dxjc_mid;
% % SigmaApp_mid_5000s = HA*DG_mid_5e3
% %
% %











% % %time=5000s
% % clear all
% % %Define constants
% % d=8; %mm
% % r=d/2; %mm
% % h=4; %mm
% % HA=2; %MPa
% % k0=0.001; %mm^4/N-s
% % time=5000;
% % t0=2; %entire time for deformation
% % v0=1/t0; %rate of deformation
% % xj=0:0.05:4; %Every 0.05 mm, report data for the whole height from 0-4 mm
% % L=length(xj);
% % a=zeros(1,L);
% % u=zeros(1,L);
% % for i=1:L
% %     for n=1:5
% %         a(1,i)=a(1,i)+((-1)^n/n^3)*exp(-n^2*pi^2*HA*k0*time/h^2)*(exp(n^2*pi^2*HA*k0*t0/h^2)-1)*sin(n*pi*xj(1,i)/h);
% %     end
% %         u(1,i)=(-v0*t0*xj(1,i)/h)-(2*v0*h^2/(HA*k0*pi^3))*a(1,i);
% %
% % end
% %
% % duj_top=u(1,81)-u(1,80);
% % dxj_top=xj(1,81)-xj(1,80);
% % DispGrad_top=duj_top/dxj_top;
% % App_Stress_5000s_top=HA*DispGrad_top;
% % disp(['The predicted stress in MPa at the top of the specimen at t=5000s is ', num2str(App_Stress_5000s_top)])
% %
% % duj_mid=u(1,41)-u(1,40);
% % dxj_mid=xj(1,41)-u(1,40);
% % DispGrad_mid=duj_mid/dxj_mid;
% % App_Stress_5000s_mid=HA*DispGrad_mid;
% %
% % FluidP_5000s=App_Stress_5000s_top-App_Stress_5000s_mid
% %
% % figure (1)
% % plot(xj,FluidP_500s,'b')
% % xlabel('depth (mm)')
% % ylabel('Fluid Pressure (MPa)')
% % title('Fluid Pressure with respect to depth at t=500s and t=5000')
% % hold on
% %
% % figure (2)
% % plot(xj,FluidP_5000s,'r')
% % xlabel('depth (mm)')
% % ylabel('Fluid Pressure (MPa)')
% % title('Fluid Pressure with respect to depth at t=5000s')
% % hold on
% %
% % % FIX THESE GRAPHS!!!!!!!! AND CHECK THE VALUES I GOT??????????????


