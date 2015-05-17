#' % HW19 - BIOE232
#' % Kyle King
#' % May 7, 2015
#' My First Python Script!

# For outputting nice HTML file/PDF
# import pweave
import pprint as pp

# All the essentials
import numpy as np  # np.__version__
import matplotlib.pyplot as plt
import math
from decimal import *
from pylab import *

#' Question 1

# Declare varibales
Ka = 5.1E-7
pKa = -math.log10(Ka)
pH = np.linspace(0, 14, num=140)
ratio = 1/(1 + pow(10, (pKa - pH)))

# Print out constants
pp.pprint(['Ka = ', Ka])
pp.pprint(['pKa = ', pKa])

# Plot function
plot(pH, ratio)
title('HW19: Q1 The ratio of C_b / C_total versus pH')
xlabel('pH')
ylabel('Ratio of C_b / C_total')
grid(True)
# show()

#' Question 2

# Declare varibales
pKa1, pKa2 = 6.3, 10.8
pH = np.linspace(0, 14, num=140)
Dratio1 = 1/(1 + pow(10, (pKa1 - pH)))
Dratio2 = 1/(1 + pow(10, (pKa2 - pH)))

# Print out constants
# pp.pprint(['Dratio1 = ', Dratio1])
# pp.pprint(['Dratio2 = ', Dratio2])

# Plot function
fig = plt.figure()
ax1 = fig.add_axes([0.1, 0.1, 0.8, 0.7])
l1, l2 = ax1.plot(pH, Dratio1, '-*', pH, Dratio2)
fig.legend((l1, l2), ('Ajmalicine', 'Serpentine'), 'upper right')
title('HW19: Q2 The ratio of D_overall / D versus pH')
xlabel('pH')
ylabel('Ratio of D_overall / D')
grid(True)
# plt.show()

#' Question 3

pKa, pHv, pHc = 6.3, 3, 7

conc = (1+pow(10, pKa - pHv)) / (1+pow(10, pKa - pHc))
pp.pprint(['Concentration Ability = ', conc])
