% Link: http://www.yodlecareers.com/puzzles/qa-challenge/fourth_floor.html


clc, clear all, close all

coins = [9, 5, 4, 1];

for i = 1:999
end

for i = 1:30
  value = i;
  for j = 1:length(coins)
    coin_exchange(j, i) = floor(value/coins(j));
    value = value - coin_exchange(j, i)*coins(j);
  end
end

% coin_exchange()