function [seq, len, GCcont, Weight, properties, name, Path] = parseFASTA(Path, Name)
% Opens a FASTA text file and parses sequence and file name
%
% See also

  % Open the file, get name/path, trim to get locus tag ('name'), concatenate
  switch nargin
    case 2
      filename = strcat(Path, Name, '.txt');
    otherwise
      % clc, clear all, close all
      [Name, Path] = uigetfile('.txt');
      % If want to strip extension
      name = Name(1:strfind(Name, '.')-1);
      filename = strcat(Path, Name);
  end

  % retrieve sequence, ignore header
  [~, seq] = fastaread(filename);

  % Collect biological Information
  len = length(seq);
  properties = oligoprop(seq);

  GCcont = properties.GC;
  Weight = properties.MolWeight;

end