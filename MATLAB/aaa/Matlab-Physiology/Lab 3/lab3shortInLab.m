clc, clear all, close all % boilerplate

%
%% Parse Text file into numbered cells (i.e. access through  b{1}(7,:)..etc)
%

% Pick File
% [Name, Path] = uigetfile('.txt');
% filename = strcat(Path, Name);
filename = '/Users/kyleking/Documents/Developer/__Matlab/Matlab-Physiology/Lab 3/data.txt';
fileID = fopen(filename,'r');

% Format data to be read
formatSpec = '%f%f%f';
sizeA = [3 Inf];
A = fscanf(fileID,formatSpec,sizeA); % Read data
fclose(fileID); % close file

%
%% Graph data
%

% Time
% Grams Force
% Voltage

figure, hold all
i = 1;
while i <= length(A(1,:))
  plot(A(1, i), A(2, i), 'o');
  i = i+1;
  % if A(3, i) ~= 0.00657
  %   i = length(A(1,:));
  % end
end