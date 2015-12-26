clc, clear all, close all % boilerplate

% Parse selected genes of E. coli genome in Matlab
path = '/Users/kyleking/Documents/Developer/__Matlab/Matlab-for-Bioninformatics/Week 9 (Oct 28 - Nov 3)/ProjectGenome/Genes/';
Name = ['b0503'; 'b0504'; 'b0505'; 'b0506'; 'b0507'; 'b0508'; 'b0509'; 'b0511'; 'b0512'; 'b0513'];

for i = 1:length(Name)
  name = Name(i, :);
  [seq, lenPer, GCcont, weight] = parseFASTA(path, name);
  seqs(i, 1:length(seq)) = seq(1, :);
  len(i, :) = lenPer;
  GCconts(i, :) = GCcont;
  weights(i, :) = weight;
end

% % Find Palindromes
% for i = length(Name)
%   % [finalTable, lengthFinal] = testPalindrome(seqs(i,:), 0)
%   % numPals(i) = lengthFinal;
%   seqs
%   regexp(seqs(i, :), '[ATCG]+')
% end


%% Plot like crazy

xaxis = (1:i);

figure,
% subplot(2, 2, 1)
subplot(1, 2, 1)

line(xaxis', weights,'LineStyle','none', 'Marker', '*', 'Color', 'b')

ax1 = gca; % current axes
ax1.XColor = 'b';
ax1.YColor = 'b';
set(ax1, 'xtickLabel', '');
ylabel('Molecular Weight')

ax1_pos = ax1.Position; % position of first axes
ax2 = axes('Position',ax1_pos, 'XAxisLocation','bottom', 'YAxisLocation','right', 'XColor','k', 'YColor','g', 'Color', 'none', 'xtickLabel', {'b0503'; 'b0504'; 'b0505'; 'b0506'; 'b0507'; 'b0508'; 'b0509'; 'b0511'; 'b0512'; 'b0513'});

line(xaxis', GCconts,'Parent',ax2,'LineStyle','none', 'Marker', 'o', 'Color', 'g')

title('Molecular Weights vs. GC Percent'), xlabel('Gene Locus'), ylabel('GC Percent')



% subplot(2, 2, 2)
subplot(1, 2, 2)

line(xaxis', weights,'LineStyle','none', 'Marker', '*', 'Color', 'b')

ax1 = gca; % current axes
ax1.XColor = 'b';
ax1.YColor = 'b';
set(ax1, 'xtickLabel', '');
ylabel('Molecular Weight')

ax1_pos = ax1.Position; % position of first axes
ax2 = axes('Position',ax1_pos, 'XAxisLocation','bottom', 'YAxisLocation','right', 'XColor','k', 'YColor','r', 'Color', 'none', 'xtickLabel', {'b0503'; 'b0504'; 'b0505'; 'b0506'; 'b0507'; 'b0508'; 'b0509'; 'b0511'; 'b0512'; 'b0513'});

line(xaxis', len,'Parent',ax2,'LineStyle','none', 'Marker', '*', 'Color', 'r')

title('Molecular Weights vs. Seq Length'), xlabel('Gene Locus'), ylabel('Sequence Label (bp)')



% subplot(2, 2, 3)

% line(xaxis', len,'LineStyle','none', 'Marker', '*', 'Color', 'r')

% ax1 = gca; % current axes
% ax1.XColor = 'r';
% ax1.YColor = 'r';

% ax1_pos = ax1.Position; % position of first axes
% ax2 = axes('Position',ax1_pos, 'XAxisLocation','top', 'YAxisLocation','right', 'XColor','k', 'YColor','k', 'Color', 'none');

% line(xaxis', numPals,'Parent',ax2,'LineStyle','none', 'Marker', '*', 'Color', 'k')

% title('Seq Length and Number of Palindromes')