% Plot the simple demo provided in class
clear all; close all;
f = zeros(256,256);
f(110:146,100:156) = 1024;
figure(1)
imagesc(f)
colormap(gray); colorbar
% colormap(jet); colorbar

figure(2)
surf(f)
shading interp

% Plot the more intricate demo photo from hist_3.m
% clear all; close all;
[I1 map] = imread('blood1.tif');     % Input image

figure(3)
surf(I1)
shading interp

% Plot the most intricate photo I can find
clear all; close all;
[I1 map alpha] = imread('Clone.png');
% I1 = imread('https://images.indiegogo.com/file_attachments/617296/files/20140531220504-Chagos_Team_Photo.jpg?1401599104');

% I = I1(:, :, 1); % filter out to only the first dimension (R of RGB?)
figure(4)
surf(I1(:, :, 1))
shading interp
% Variations
% figure(5)
% surf(I1(:, :, 2))
% shading interp
% figure(6)
% surf(I1(:, :, 3))
% shading interp