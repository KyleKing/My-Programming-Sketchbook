function [ output_args ] = modelOld( input_args )
% function based on the Interaction of fast and slow dynamics in endocrine control systems with an application to
% B-cell dynamics.pdf mathematical model
%
% See also trial1.m

  % For testing
  % clc, clear all, close all % boilerplate

  Iref = 44; % mU
  Gref = 10; % g

  % From section 3.2
  Ip = Iref*4.8;
  G = Gref*0.11;
  Ii = Iref*0.066;
  w1 = Iref*0.028;
  w2 =Iref*0.028;
  w3 = Iref*0.028;
  Q = 8.7E-7;

  % Manually Calibrated Value
  % "The glucose input psi_in(t) can assume various forms. It may be set to a constant value, as can be arranged under experimental condi-
  % tions where glucose is administered by means of an infusion, or it may be time-varying. If win is set to a constant value, ultradian
  % oscillations may become prominent feature of the dynamics, as shown by Tolic ́ et al. [40]. Here we choose as standard reference
  % a periodic function with a period of 24 h and three "meal peaks" in every day, as shown in the top panel of Fig. 2. Under this particular
  % input, the system settles on a stationary forced cycle within a few days, also shown in Fig. 2."
  % psi_in = (1000/1)*t; % Set as a function of t later based on experiment/figure 2
  % psi_in = (-1000/3)*t; % Set as a function of t later based on experiment/figure 2

  % Table 1 Notations and Parameters
  phi = 0.2;
  Vp = 3;
  Vi = 11;
  Vg = 10;
  tau_p = 6; % Typo, should be tau_p, but labeled as tau_g? both described as: "mean life time of an insulin molecule in the blood plasma"
  tau_i = 100;
  tau_d = 36;
  alpha_1 = 1.86;
  alpha_2 = 14.5;
  alpha_ii = 4.8;
  alpha_id = 1.77;
  alpha_gri = 7.54;
  alpha_grg = 10;
  alpha_is = 6.67;
  alpha_gx = 0.00065;
  alpha_ngi = 0.5;
  alpha_ngg = 0.5;
  gamma_1 = 1.6;
  gamma_2 = 2.6;
  gamma_iilo = 144;
  gamma_iihi = 2;
  gamma_id = 1;
  gamma_gr = 2;
  gamma_is = 2;
  gamma_gx = 0.3;
  gamma_ng = 1.3;
  del = 0.34;
  del_0 = 0.64;
  I0 = 115;
  Iid = 80;
  Igr = 26;
  Iai = 0.3;
  Ing = 30;
  psi0 = 40;
  psiii = 0.21;
  psiid = 0.94;
  psigr = 0.18;
  psiis = 0.21;
  psing = 0.001;
  psigx = 29;
  rho_0 = 0.166;
  mu_0 = 0.311;

  %for t = 1:24
    psi_in = linspace(0,1000,0.5);
    psi_in = linspace(1000,0,0.5);

    % Appendix Functions
    psi_ii = psiii*(del*(1-exp((-G/Vg)/gamma_iilo)) + (1-del)/(1 + exp(alpha_ii*(1-(-G/Vg)/gamma_iihi)))) % A.1
    psi_id = ((G/Vg)/gamma_id)*(psi0*(psiid-psi0)/(1+exp(-alpha_id*log((Ii/Iid)*((Vi^(-1))+((phi*tau_i)^(-1))))))) % A.2
    psi_gr = psigr*(1+exp(-alpha_grg*(1-(G/Vg)/gamma_gr)))^(-1)*(1+exp(-alpha_gri*(1-(w3/Vp)/Igr)))^(-1) % A.3
    psi_is = psiis*(1+exp(alpha_is*((1-(G/Vg)/gamma_is))))^(-1) % A.4
    psi_gx = psigx*log(1+alpha_gx*exp((G/Vg)/gamma_gx)) % A.5
    % rho = rho_0*(1+del_0*Ip/(I0*Vp+Ip)) % A.6
    % mu = mu_0*(1+(Ii/Vi)/Iai)*(1+exp(alpha_1-(G/Vg)/gamma_1-alpha_2*(1-(G/Vg)/gamma_2)^4))^(-1) % A.7
    % psi_ng = psing*(1+exp(alpha_ngg*(1-(G/Vg)/gamma_ng)))^(-1)*(1+exp(alpha_ngi*(1-(Ii/Vg)/Ing)))^(-1) %  Eq. 20
    % Differential Equations
    dGdt = psi_in - psi_ii - psi_id + psi_gr - psi_gx % Eq. 13
    dIpdt = Q*psi_is - phi*(Ip/Vp - Ii/Vi) - Ip/tau_p % Eq. 14
    dIidt = phi*(Ip/Vp - Ii/Vi) - Ii/tau_i % Eq. 15

    dw1dt = 3*(Ip-w1)/tau_d; % Eq. 16
    dw2dt = 3*(w1-w2)/tau_d; % Eq. 17
    dw3dt = 3*(w2-w3)/tau_d; % Eq. 18

    % neogenesis of beta-cells, don't think we'll need this
    % dQdt = (rho - mu)*Q + psi_ng; % Eq. 19

  % end

end