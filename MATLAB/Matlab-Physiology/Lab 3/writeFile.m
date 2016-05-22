function [] = writeFile(data, num)
% Receives two arrays that indicate the location of a type of event
% Conserves the type of event while merging the two arrays by overwiriting the events of B with A
%
% See also mathematica.m and nextMatch.m

  % For testing
  % clc, clear all, close all

  % Create/write file
  PATH = ['/Users/kyleking/Documents/Developer/__Matlab/Matlab-Physiology/Lab 3/data/'];
  NAME = ['dataParse' num2str(num) '.txt'];
  filename = strcat(PATH, NAME);
  fid=fopen(filename,'w');

  % Write data to file and remove extra spaces
  for i = 1:length(data)
    fprintf(fid, '%s\n', strtrim(data(i,:)));
  end

  % Its chracters and not even strings....
  % str = cellstr(strtrim(data(1,:)));
  % expression = {'twitch', 'mm'};
  % matchStr = regexp(str,expression,'match')

  fclose(fid);
end