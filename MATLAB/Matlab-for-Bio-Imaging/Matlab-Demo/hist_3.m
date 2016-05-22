clear all; close all;
[I1 map] = imread('blood1.tif');     % Input image
[m, n] = size(I1);

%Plot the images
figure(1);
imshow(I1);
title('Original','FontSize',12);
colorbar

I2=I1-min(min(I1));
figure(2);
imshow(I2);
title('Background Substraction','FontSize',12);
colorbar

figure(3); imhist(I1,64);
title('Original Histogram')

figure(4); imhist(I2, 64);
title('Bk Substraction Histogram')

I3=histeq(I1);
figure(5);
imshow(I3);
title('Histogram Equalization','FontSize',12);
colorbar

figure(6); imhist(I3,64);
title('Histogram Equalization')
