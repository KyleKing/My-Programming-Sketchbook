%Bryce Weisberger, Lab 3
%Note: data used is supposed to be simplified as per the example on page 6
%of the presentation accompanying the lab
%In addition, if output of a certain rate is zero, it means that the data
%is not applicable for the sample given
pattern=true;
warning('off','all');
abnormal=false;
[Name,Path]=uigetfile('*.xls');
data=xlsread(strcat(Path,Name));
time=(data(:,1)-data(1,1)); %convert to seconds from start of ECG
ecg=data(:,2)-min(data(:,2)); %brings voltage to positive values

%Finds rPeaks, rtimes, and rlocs.  Also defines mathematical answers
[rPeaks,rlocs]=findpeaks(ecg,'MINPEAKHEIGHT',.85*max(ecg(:)));
rtimes=time(rlocs);
totalRTime=rtimes(length(rtimes))-rtimes(1);
dist=totalRTime/(length(rtimes)-1);
hr=60/dist;
qt=0;

flag=true;
percent=6;
tPeaks=0;tlocs=0;ttimes=0;

%finds tPeaks by sequentially lowering threshhold.  Pattern will have that
%num of tpeaks is num of rpeak, or it will be flagged as abnormal.  Because
%the different heights of t peaks in each ecg, this ensures that only the
%tpeaks will be gained instead of any noise.
while flag==true
    [tPeaks,tlocs]=findpeaks(ecg,'MINPEAKHEIGHT',(percent/10)*max(ecg(:)));
    ttimes=time(tlocs);
    returneddata=setdiff([tlocs,tPeaks],[rlocs,rPeaks],'rows');
    tPeaks=returneddata(:,2);
    ttimes=time(returneddata(:,1));
    tlocs=setdiff(tlocs,rlocs);

    if(length(tPeaks)==length(rPeaks)||fix(percent)==0)
        flag=false;
    else
        percent=percent-1;
    end
end;

pPeaks=zeros(length(ttimes),1);plocs=pPeaks;ptimes=pPeaks;
sPeaks=zeros(length(ttimes),1);slocs=sPeaks;stimes=sPeaks;
qPeaks=zeros(length(ttimes),1);qlocs=qPeaks;qtimes=qPeaks;
invecg=ecg*-1+max(ecg(:));
if(percent==0)
    abnormal=true;
else
    %searches around each r for p peaks
    for i=1:length(rlocs)
        [temppeaks,templocs]=findpeaks(ecg(max(1,fix((rlocs(i)-(dist*50)))+1):rlocs(i)),'SORTSTR','descend');
        pPeaks(i)=temppeaks(1);
        plocs(i)=templocs(1)+max(1,fix((rlocs(i)-(dist*50)))+1);
    end
    ptimes=time(plocs);

    %searches around each r for q peaks
    for i=1:length(rlocs)
        [temppeaks,templocs]=findpeaks(invecg(plocs(i):rlocs(i)),'SORTSTR','descend');
        qlocs(i)=templocs(1)+plocs(i)-1;
        qPeaks(i)=ecg(qlocs(i));
    end
    qtimes=time(qlocs);

    %searches around each r for s peaks
    for i=1:length(rlocs)
        [temppeaks,templocs]=findpeaks(invecg(rlocs(i):tlocs(i)),'SORTSTR','descend');
        slocs(i)=templocs(1)+rlocs(i)-1;
        sPeaks(i)=ecg(slocs(i));
    end
    stimes=time(slocs);

    %calculates average qt rate for normal function heart rates
    temp2=0;
    for i=1:length(rlocs)
        temp2=temp2+ttimes(i)-ptimes(i);
    end
    qt=temp2/length(rlocs);
end

%plots ECG and labels
n=fix(length(rlocs)/2);
plot(time(rlocs(n)-100*dist:rlocs(n+1)+120*dist),ecg(rlocs(n)-100*dist:rlocs(n+1)+120*dist));
diagnosis=0;
xlabel('Time (s)');
ylabel('Millivolts');
title(strcat('ECG of: ',Name));

if(abnormal)
    %check if bpm is relatively constant
    hrtimes=zeros(1,length(rlocs)-1);
    for i=1:length(rlocs)-1
        hrtimes(i)=rtimes(i+1)-rtimes(i);
    end

    if(chi2gof(hrtimes)==0)
        diagnosis='Ventricular Tachycardia';
        text(rtimes(n),rPeaks(n)+.025,'R');
    else
        diagnosis='Ventricular Fibrillation';
        hr=0;
    end
else
    %displays all points
    text(ptimes(n),pPeaks(n)+.025,'P');
    text(qtimes(n),qPeaks(n)-.025,'Q');
    text(rtimes(n),rPeaks(n)+.025,'R');
    text(stimes(n)+.05,sPeaks(n),'S');
    text(ttimes(n),tPeaks(n)+.025,'T');

    %narrows diagnosis based on heart rate
    if(hr<60)
        diagnosis='Sinus Bradycardia';
    elseif(hr>=240)
        diagnosis='Atrial Flutter';
    elseif(hr>=100)
        diagnosis='Sinus Tachycardia';
    else
        diagnosis='Normal';
    end

end

%displays relevant information
disp(Name);
disp('Heart Rate (bpm)');
if(hr~=0)
    disp(hr);
else
    disp('N/A');
end
disp('Average Q-T interval (s)');
if(qt~=0)
    disp(qt);
else
    disp('N/A');
end
disp('Probable Diagnosis: ');
disp(diagnosis);
clear;