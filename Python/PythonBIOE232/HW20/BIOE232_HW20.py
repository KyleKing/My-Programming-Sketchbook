#' % HW20 - BIOE232
#' % Kyle King
#' % May 8, 2015
#' My Second Python Script!

# All the essentials
import numpy as np  # np.__version__
import matplotlib.pyplot as plt
import csv
from decimal import *
from pylab import *
plt.close("all")

#' Question 1

#' Assess how the dissociation constant (Kd) affects ligand binding to a protein.  Specifically, plot the fraction of a protein that is in the bound state (CPL/PTotal) as a function of unbound ligand concentration (CL) for three cases (a) Kd =10 mM; (b) Kd =1 mM; and (c) Kd = 0.1 mM.  

# Declare varibales
R = 8.314
Kd = [10, 1, 0.1]  # mM
Cl = np.linspace(0.001, 10, num=1000)  # ligand concentration from ~0 to 10mM
for n in Kd:
    ratio = 1/(1+(1/(n*Cl)))  # equation from lecture 19
    # Plot function
    plot(Cl, ratio)
title('HW20: Q1 The ratio of CPL/PTotal')
xlabel('Cl')
ylabel('Ratio of CPL/PTotal')
legend(Kd)
grid(True)
# show()

#' Question 2

#' Studies with the enzyme tyrosyl-tRNA synthetase indicate that the enzyme can selectively bind the tyrosine moiety relative to the phenylalanine moiety by a factor of 10^5 at 300 K. What is the difference in binding free energy and what types of interactions could be responsible for such a difference?

KaFactor = pow(10, 5)
deldelG = -R*300*log(KaFactor)/1000  # kJ/mole
print("The difference in binding free energy is %d kJ/mole" % deldelG)
print("This could be the result of a difference in one hydrogen bond (about 5 - 30 kJ/mole)")

#' Question 3

#' Several avidin-biotin binding systems have been studied (e.g., variant proteins and ligands) at 300 K.  The binding constant (Ka) and binding enthalpy have been measured along with the force required to mechanically unbind the protein-ligand complex (Fu).  From the data below, does the unbinding force correlate better with the free energy of binding or the enthalpy of binding? (Moy et al. Sci. 266:257 (1994)).

def getNumericColumn(filename, column):
    results = csv.reader(open(filename), delimiter=",", quoting=csv.QUOTE_NONNUMERIC)
    return [result[column] for result in results]

# Import variables from csv file
filename = 'Q2data.csv'
# Convert to int for indexing
Count = np.array(map(int, getNumericColumn(filename, 0)))  # M^-1
KaBase = getNumericColumn(filename, 1)  # M^-1
KaPow = getNumericColumn(filename, 2)
Fu = getNumericColumn(filename, 3)  # pN
DelH = getNumericColumn(filename, 4)  # Kcal/mol

# Create Empty Array Ka
Ka = [0]*(len(Count))
# Fill array with values from csv file
for i in Count:
    Ka[i] = KaBase[i]*pow(10, KaPow[i])
DelG = -R*300*log(Ka)/1000  # kJ/mole

fig2 = plt.figure()
plt.scatter(DelG, Fu)
title('Free Energy versus Unbinding Force')
xlabel('Free Energy of Binding (kJ/mol)')
ylabel('Unbinding Force (Fu) in pN')

fig3 = plt.figure()
plt.scatter(DelH, Fu)
title('Binding Enthalpy versus Unbinding Force')
xlabel('Binding Enthalpy (kcal/mol)')
ylabel('Unbinding Force (Fu) in pN')

# plt.show()
print('The Binding Enthalpy has a much stronger coorelation with Fu')

#' Question 4

#' See attached handwritten notes
