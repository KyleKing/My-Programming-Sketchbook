clear all, clc, close all

log_f = @(f) -log(f);

detector_h = [0.3, 0.5, 0.1];
log_f(detector_h)

detector_d = [0.2, 0.3, 0.4, 0.3, 0.2];
log_f(detector_d)

detector_v = [0.2, 0.6, 0.3];
log_f(detector_v)