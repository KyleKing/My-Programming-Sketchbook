BIOE 489D Bioinformatics Homework #3  
1. If the cdf is a probability and hence is dimensionless, what are the units of the pdf?

The CDF is the integral of a PDF, so if a CDF is unitless, than the PDF is unitless.

2. Draw and annotate a normal pdf and show how to illustrate the probability that a random variable will be less that some specific value.

By integrating from left to some value, you can create a CDF that gives the probability that the result will be less than some value.

3. Draw and annotate an extreme value pdf and show how to illustrate the probability that a random sequence alignment score will have a score greater than some specific value.

Integrate from right to some value

4. Write down the definitions of the mean and standard deviation of a sample.

Mean - Average value calculated by summing all the terms and dividing by the number of terms  
Standard Deviation - variation from the mean (average)

5. For DNA with match/mismatch 5/-4, and gap costs 12/4, determine the alignment score for:

16 matches, 6 mismatches, 1 gap of length 1:  
16*5 + 6*(-4) - [12 + (4*1)] = 44

6. For protein with PAM250 (find a [data table ](http://www.icp.ucl.ac.be/~opperd/private/pam250.html)or use [Kenny's](http://www.cryst.bbk.ac.uk/pps97/assignments/projects/leluk/pam250.jpg)) and gap costs 12/1, determine the alignment score for

Query 4     LTPEEKSAVTALWGKVNVD--EVGGE  
            L+  E   V  +WGKV  D    G E  
Sbjct 3     LSDGEWQLVLNVWGKVEADIPGHGQE  

Only count the proteins connected with the opposite sequence  
L=6, TS=1, E=4, V=4, LV=2, W= 17, G=5, K=5, V=4, D=4, G=5, E=4

Then, 14 gaps, 7 extensions makes 14*(-12) + 7*(-1) = -175




![HW3](HW3.pdf)