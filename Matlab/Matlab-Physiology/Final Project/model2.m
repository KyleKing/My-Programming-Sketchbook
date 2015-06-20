function [ G1 ] = model2(psi_in)
% Function based on the Interaction of fast and slow dynamics in endocrine control systems with an application to
% B-cell dynamics.pdf mathematical model
%
% See also trial1.m

  % From section 3.2
  Iref = 44; % mU
  Ip = Iref*4.8;
  G = 1.1; % Gref*0.11g
  Ii = Iref*0.066;
  w3 = Iref*0.028;
  Q = 8.7E-7;

  % Table 1 Notations and Parameters
  phi = 0.2;
  Vp = 3;
  Vi = 11;
  Vg = 10;
  tau_p = 6;
  tau_i = 100; % 100
  alpha_ii = 4.8;
  alpha_id = 1.77;
  alpha_gri = 7.54;
  alpha_grg = 10;
  alpha_is = 6.67;
  alpha_gx = 0.00065; % 0.00065
  gamma_iilo = 144; % 144
  gamma_iihi = 2;
  gamma_id = 1;
  gamma_gr = 2;
  gamma_is = 2;
  gamma_gx = 0.3;
  del = 0.34; % 0.34
  Iid = 80; % 80
  Igr = 26;
  psi0 = 40;
  psiii = 0.21; 
  psiid = 0.94;
  psigr = 0.18;
  psiis = 0.21;
  psigx = 29;

  % Populate G1 based on G values from input arguments
  G1 = linspace(G,G,length(psi_in));

  % Loop through length of input
  for t = 2:length(psi_in)

    % Appendix Functions listed by name at end
    psi_ii = psiii*(del*(1-exp((-G1(t-1)/Vg)/gamma_iilo)) + (1-del)/(1 + exp(alpha_ii*(1-(G1(t-1)/Vg)/gamma_iihi)))); % A.1
    psi_id = ((G1(t-1)/Vg)/gamma_id)*(psi0+(psiid-psi0)/(1+exp(-alpha_id*log((Ii/Iid)*((Vi^-1)+((phi)^(-1))))))); % A.2
    psi_gr = psigr*(1+exp(-alpha_grg*(1-(G1(t-1)/Vg)/gamma_gr)))^(-1)*(1+exp(-alpha_gri*(1-(w3/Vp)/Igr)))^(-1); % A.3
    psi_is = psiis*(1+exp(alpha_is*((1-(G1(t-1)/Vg)/gamma_is))))^(-1); % A.4
    psi_gx = psigx*log(1+alpha_gx*exp((G1(t-1)/Vg)/gamma_gx)); % A.5

    % Differential Equations from main body of text
    dIpdt = Q*psi_is - phi*(Ip/Vp - Ii/Vi) - Ip/tau_p; % Eq. 14
    dIidt = phi*(Ip/Vp - Ii/Vi) - Ii/tau_i; % Eq. 15
    dGdt = (psi_in(t) - psi_ii - psi_id + psi_gr - psi_gx); % Eq. 13

    % Increment values
    Ii = Ii + dIidt;
    Ip = Ip + dIpdt;
    G1(t) = G1(t-1)+dGdt;

  end
end




