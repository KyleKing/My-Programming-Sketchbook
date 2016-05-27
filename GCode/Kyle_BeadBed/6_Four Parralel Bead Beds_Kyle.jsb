(Repackable Bead Bed - Kyle King)
(03/15/2016)
(T1: n/a MICRON)
(T2: n/a MICRON)
(T3: 0.006 INCH = 151 MICRON_from Kyles Box)
(T4: 650 MICRON = Needle interfacing)
(^ green/yel needle on computer)
(Coordinate system of G57)
(Center on center of chip)
%

(Create Height and Width Restriction)
M06 T3
G43 H3
G21
G57

M03
S6000

G00 X15.0 Y-1.0
G00 Z7.5

G00 X15.0 Y-1.0 Z2.5
F0.05
G01 Z0.04
F1.0
G01 X15.0 Y-1.0 Z0.04
G01 Y5.0
G01 Y5.0 Z0.02
G01 Y-1.0
G01 Y-1.0 Z0.0
G01 Y5.0
G01 Y5.0 Z-0.02
G01 Y-1.0
G01 Y-1.0 Z-0.04
G01 Y5.0

G00 Z2.5


G00 X5.0 Y-1.0 Z2.5
F0.05
G01 Z0.04
F1.0
G01 X5.0 Y-1.0 Z0.04
G01 Y5.0
G01 Y5.0 Z0.02
G01 Y-1.0
G01 Y-1.0 Z0.0
G01 Y5.0
G01 Y5.0 Z-0.02
G01 Y-1.0
G01 Y-1.0 Z-0.04
G01 Y5.0

G00 Z2.5


G00 X-5.0 Y-1.0
F0.05
G01 Z0.04
F1.0
G01 X-5.0 Y-1.0 Z0.04
G01 Y5.0
G01 Y5.0 Z0.02
G01 Y-1.0
G01 Y-1.0 Z0.0
G01 Y5.0
G01 Y5.0 Z-0.02
G01 Y-1.0
G01 Y-1.0 Z-0.04
G01 Y5.0

G00 Z2.5


G00 X-15.0 Y-1.0
F0.05
G01 Z0.04
F1.0
G01 X-15.0 Y-1.0 Z0.04
G01 Y5.0
G01 Y5.0 Z0.02
G01 Y-1.0
G01 Y-1.0 Z0.0
G01 Y5.0
G01 Y5.0 Z-0.02
G01 Y-1.0
G01 Y-1.0 Z-0.04
G01 Y5.0

G00 Z2.5



(Create Square Bead Packing Area)
M06 T3
G43 H3
G21
G57

M03
S6000

G00 X15.0 Y-15.0 
G00 Z7.5

G00 X15.0 Y-15.0 Z2.5
F0.05
G01 Z0.04
F1.0
G01 X15.0 Y-15.0 Z0.02
G01 Y0.0
G01 Y0.0 Z0.00
G01 Y-15.0
G01 Y-15.0 Z-0.025
G01 Y0.0
G01 Y0.0 Z-0.050
G01 Y-15.0
G01 Y-15.0 Z-0.075
G01 Y0.0
G01 Y0.0 Z-0.10
G01 Y-15.0
G01 Y-15.0 Z-0.125
G01 Y0.0
G01 Y0.0 Z-0.150

G00 Z2.5


G00 X5.0 Y-15.0 Z2.5
F0.05
G01 Z0.04
F1.0
G01 X5.0 Y-15.0 Z0.02
G01 Y0.0
G01 Y0.0 Z0.00
G01 Y-15.0
G01 Y-15.0 Z-0.025
G01 Y0.0
G01 Y0.0 Z-0.050
G01 Y-15.0
G01 Y-15.0 Z-0.075
G01 Y0.0
G01 Y0.0 Z-0.10
G01 Y-15.0
G01 Y-15.0 Z-0.125
G01 Y0.0
G01 Y0.0 Z-0.150

G00 Z2.5


G00 X-5.0 Y-15.0 Z2.5
F0.05
G01 Z0.04
F1.0
G01 X-5.0 Y-15.0 Z0.02
G01 Y0.0
G01 Y0.0 Z0.00
G01 Y-15.0
G01 Y-15.0 Z-0.025
G01 Y0.0
G01 Y0.0 Z-0.050
G01 Y-15.0
G01 Y-15.0 Z-0.075
G01 Y0.0
G01 Y0.0 Z-0.10
G01 Y-15.0
G01 Y-15.0 Z-0.125
G01 Y0.0
G01 Y0.0 Z-0.150

G00 Z2.5


G00 X-15.0 Y-15.0 Z2.5
F0.05
G01 Z0.04
F1.0
G01 X-15.0 Y-15.0 Z0.02
G01 Y0.0
G01 Y0.0 Z0.00
G01 Y-15.0
G01 Y-15.0 Z-0.025
G01 Y0.0
G01 Y0.0 Z-0.050
G01 Y-15.0
G01 Y-15.0 Z-0.075
G01 Y0.0
G01 Y0.0 Z-0.10
G01 Y-15.0
G01 Y-15.0 Z-0.125
G01 Y0.0
G01 Y0.0 Z-0.150

G00 Z2.5



(Create Needleports x4)
M06 T4
G43 H4
G21
G57

M03
S6000

G00 X-15.0 Y5.0 
G00 Z7.5

G00 X-15.0 Y5.0 Z2.5
F15.0
G98 G83 Z-2.7 Q0.5
G00 Z2.5

G00 X-5.0 Y5.0 Z2.5
F15.0
G98 G83 Z-2.7 Q0.5
G00 Z2.5

G00 X5.0 Y5.0 Z2.5
F15.0
G98 G83 Z-2.7 Q0.5
G00 Z2.5

G00 X15.0 Y5.0 Z2.5
F15.0
G98 G83 Z-2.7 Q0.5
G00 Z2.5

G00 X15.0 Y-15.0 Z2.5
F15.0
G98 G83 Z-2.7 Q0.5
G00 Z2.5

G00 X5.0 Y-15.0 Z2.5
F15.0
G98 G83 Z-2.7 Q0.5
G00 Z2.5

G00 X-5.0 Y-15.0 Z2.5
F15.0
G98 G83 Z-2.7 Q0.5
G00 Z2.5

G00 X-15.0 Y-15.0 Z2.5
F15.0
G98 G83 Z-2.7 Q0.5
G00 Z2.5

G00 Z5.0


(Tool Return)
M06 T0
M30
%












