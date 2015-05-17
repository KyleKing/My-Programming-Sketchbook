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

plot(A(1, :), A(2, :));


% % Parse data by finding the breaks
% % Add the first data point
% dataBreaks(1, 1) = 1;
% k = 2;
% for i = 1:length(a.Time_Muscle_Stim_1)
%   if (a.Time_Muscle_Stim_1(i,1) == 'T')
%     dataBreaks(k, 1) = i;
%     k = k + 1;
%   end
% end
% % Add the last data point section
% dataBreaks(k, 1) = length(a.Time_Muscle_Stim_1);

% % Find data breaks and break file into different sized cells in b
% sum = [];
% for j = 2:k
%   count = 1;
%   for l = (dataBreaks(j-1)+1):(dataBreaks(j)-1)
%     b{j-1}(count,:) = a.Time_Muscle_Stim_1(l, :);
%     count = count + 1;
%   end
%   writeFile(b{j-1}, (j-1));
% end

% %
% %% Graph data
% %

% for m = 1:k
%   % plot(b{m}(:,1:8), b{m}(:, 10:17))
% end