### Tuesday
"Possible quiz - amino acid 3 letter codes
- be able to interpret the probability density function and generalized extreme value function and cumulative density function. (pdf, gev, cdf). The extreme value function


code in the powerpoints for the pdf function for example of a problem that should follow extreme value distribution. The extreme value distribution will be as a function of the mean (mu), K, length of distribution (lamda), and m/n (length of sequences in the string).

Integrating the pdf incrementally will give the cdf.

-ran an experiment to see if it follows the extreme value statistics. black line = normal distribution, blue bins = experimental data.

-use bioinformatics toolbox to check statistics of local align with localalign.

—————————————————————————————————————————————————————————

Protein scoring matrices

2 classes = PAM / BLOSUM
PAM = accepted point mutation. Determine common mutations observed in very similar proteins. can look at proteins that are similar but not exact and from there determine how many AA mutations can be accepted. Create a probability function from the percentage mutations (PAM1 = 1% mutation). PAM30. Book figure 3.11 describes PAM1 matrix.

BLOSUM = block substitution matrix Using alignments of homologous but distant protein determines probability of mutation for each amino acid.

Take a log odds scoring matrix (Eq 3.1 in book) where the odds ratio is the probability of a mutation over the probability of that residue appearing by chance. Log form allows these probabilities to be added from each sequence position to get total alignment score (next slide is MATLAB code)

All book examples are in the ppt" Kenneth

### Thursday
Plan: Pick apart a protein in NCBI

###### NCBI
Major classes of globins (membrane bound, ...) - most proteins fit in this class (but model because of length)
-> Insulin is even shorter, but includes signal peptides
Pre-ProProtein:
    - Pre - means there is a signal peptide on front end of the peptide
    - Pro - protein precursor (segmenting of protein)
    - Mat_peptide - mature peptide
Looking at RNA (which is actually DNA - no U's)
    - STS - Sequence Tagged Sites - Relevant for physical mapping
    - CDS - Coding DNA Sequence

###### BLAST
....Word-Size = 2 - length of AA's? Read more in book
Max Target Sequence: largest string outputted
Composition Based Statistics: used lambda, K based on sequence searching for???

###### Quiz:
P-Value - is the statistical probability that a random sequence would be better match than this one
