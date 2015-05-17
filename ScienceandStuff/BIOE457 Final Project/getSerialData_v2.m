function out = getSerialData_v2(s,channels)

data = NaN(channels,1); 
% initialize acquisition variable using nan (not a number) as a placeholder
i = 0;
cl = tic; % Begin acquisition timer
try
    
    while ~isempty(find(isnan(data),1))
        input = strsplit(fgetl(s),'*'); 
        % fgetl(s) reads the data from the serial port and stores it to the matrix a
        % strsplit() will split a single string and remove a delimiting character,
        %       in this case a hyphen "*"

        input = str2double(input);
        % convert the data to a double

        if numel(input) == 2        
            data(input(2)) = input(1);
            % store the data (input(1)) in an array index based on the channel
            %       number(input(2))
            out(input(2),:) = [(data(input(2))/1024)*5, toc(cl)];
            % Store data and a time stamp in the output variable
        end
        i = i + 1;
        % Store number of acquisition attempts

        % Find Failed Channels (acquisition attempts > 10)
        if i > 100 || (numel(input) == 1 && isnan(input(1)))
            ind = find(isnan(data) == 1);
            % find the channel that doesn't have data (where a nan is stored)
            fchan = '';
            for it = 1:length(ind);
                if it > 1
                    fchan = [fchan ' , '];
                end
                fchan = [fchan int2str(ind(it))];
            end
            % for loop makes a string out of the channels that didn't produce
            % data
            fclose(s);
            error(['No data could be acquired from channel:' int2str(ind)']);
        end
    end 
catch e
    fclose(s);
    throw(e);
end

out = out(:,1);
