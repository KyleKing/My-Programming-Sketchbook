clc, clear all, close all % boilerplate

%
%% Parse Text file into numbered cells (i.e. access through  b{1}(7,:)..etc)
%

% Pick File
% [Name, Path] = uigetfile('.txt');
% filename = strcat(Path, Name);
filename = '/Users/kyleking/Documents/Developer/__Matlab/Matlab-Physiology/Lab 3/data.txt';
fileID = fopen(filename,'r');
formatSpec = '%f%f%f';
sizeA = [3 Inf];
A = fscanf(fileID,formatSpec,sizeA);
% A = transpose(A);
fclose(fileID);

%
%% Graph data
%

% Break data at 0, 0, 0 values (manually inserted)
j = 0; count = 1;
[~, breaks] = findpeaks(-A(1,:));
counti = 1;


for i = 1:length(A(1,:))
  if count <= length(breaks) && breaks(count) == i
    j = j + 3;
    count = count + 1;
    counti = 1;
  else
    B{counti, 1 + j} = A(1, counti);
    B{counti, 2 + j} = A(2, counti);
    B{counti, 3 + j} = A(3, counti);
    counti = counti + 1;
  end
end


figure, hold all
% for k = 0:3:3
k = 0;
    plot(str2num(B{:, 1+k}), str2num(B{:, 2+k}))
% end

% plot(A(1, :), A(2, :));