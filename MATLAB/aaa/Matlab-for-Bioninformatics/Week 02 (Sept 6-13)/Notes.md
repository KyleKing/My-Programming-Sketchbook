### Thursday 9-11-2014
- DNA Scoring
    + 5 points for exact match
    + -4 points for mismatch (or gap where missing nucleotide to make it work "-")
    + -12 points for ...
    + local alignment tool: [l-align](http://www.ebi.ac.uk/Tools/psa/lalign/nucleotide.html)
    + Runs cases to determine best alignment
    + Test sequences generated randomly:
        * GACCCTGCCTCTATGTGAGGCTACGAACCGAATTCATTGGACATGCATTCCTGGACACGCAGATAACTTCACCATGGTCCGTAGAGCATGTATTTAGGCG
        * CTCGAGCGCCCGAACACGAGGCTTGCTATAGGGGGAGCCAAACAGCAGAGGCCTGGACGGGTTTATATGTGATCGCCAAAATTCCTACTACCTTTGAAGC
        * Results:
            - Expected score is chance out of 100 times (i.e. how many times would it happen just out of chance - look for < 10^-6 (highly unlikely from chance))
            - Percent identity = % matches of sequence
            - similarity only matters in proteins - not DNA
        * P = 1-exp(-E)
            - E value of expected matches in 100
            - Probability that by random chance the score would be greater
        * pdf = exp(-x)*exp(exp(-x))
            - probability density function
            - accept only highest results so creates and Extreme Value distribution
            - x = alignment score
        * cdf = exp(exp(-lambda*(x-mu)))
            - for lambda = 1 and mu (mean) = 0 can plot
            - ... density function
        * mu = ln(Kmn)/lambda
        * cdf = exp(-Kmn*exp(-lambda*x))
    + Try local align in matlab for comparison
    + Other tools can use global alignments