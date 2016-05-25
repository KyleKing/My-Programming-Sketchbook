(LMP Agarose Bead Bed with dual inlet/outlet design)
(Kyle King)
(03/28/2016)
( )
(Center on center of chip_50x50mm chip)
( )
(T1: n/a MICRON)
(T2: n/a MICRON)
(T3: 0.006 INCH = 151 MICRON_from Kyles Box)
(T4: 650 MICRON = Needle interfacing)
(^ green/yel needle on computer)
(Coordinate system of G57)
%

(EDITS:)
(Drill more shallowly through plastic, cut into base)
(Incorporate new dimension bits)
(Fix weird movement speed_feed - F)
(^ It starts very slow and then suddenly speeds up)
(Slow spin speed to 1000 for larger bits)

(Create Square Bead Packing Area)
M06 T3
G43 H3
G21
G57

M03
S6000

G00 X0.0 Y0.0
G00 Z7.5


(Right Side)

G00 X0.0 Y-15.0 Z2.5
F0.05
G01 Z0.04
F1.0
G01 X0.0 Y-15.0 Z0.02
G01 X15.0 Y0.0
G01 X15.0 Y0.0 Z0.00
G01 X0.0 Y-15.0
G01 X0.0 Y-15.0 Z-0.025
G01 X15.0 Y0.0
G01 X15.0 Y0.0 Z-0.050
G01 X0.0 Y-15.0
G01 X0.0 Y-15.0 Z-0.075
G01 X15.0 Y0.0
G01 X15.0 Y0.0 Z-0.10
G01 X0.0 Y-15.0
G01 X0.0 Y-15.0 Z-0.125
G01 X15.0 Y0.0
G01 X15.0 Y0.0 Z-0.150

G00 Z2.5

G00 X0.0 Y15.0 Z2.5
F0.05
G01 Z0.04
F1.0
G01 X0.0 Y15.0 Z0.02
G01 X15.0 Y0.0
G01 X15.0 Y0.0 Z0.00
G01 X0.0 Y15.0
G01 X0.0 Y15.0 Z-0.025
G01 X15.0 Y0.0
G01 X15.0 Y0.0 Z-0.050
G01 X0.0 Y15.0
G01 X0.0 Y15.0 Z-0.075
G01 X15.0 Y0.0
G01 X15.0 Y0.0 Z-0.10
G01 X0.0 Y15.0
G01 X0.0 Y15.0 Z-0.125
G01 X15.0 Y0.0
G01 X15.0 Y0.0 Z-0.150

G00 Z2.5

(Left Side)

G00 X0.0 Y15.0 Z2.5
F0.05
G01 Z0.04
F1.0
G01 X0.0 Y15.0 Z0.02
G01 X-15.0 Y0.0
G01 X-15.0 Y0.0 Z0.00
G01 X0.0 Y15.0
G01 X0.0 Y15.0 Z-0.025
G01 X-15.0 Y0.0
G01 X-15.0 Y0.0 Z-0.050
G01 X0.0 Y15.0
G01 X0.0 Y15.0 Z-0.075
G01 X-15.0 Y0.0
G01 X-15.0 Y0.0 Z-0.10
G01 X0.0 Y15.0
G01 X0.0 Y15.0 Z-0.125
G01 X-15.0 Y0.0
G01 X-15.0 Y0.0 Z-0.150

G00 Z2.5

G00 X0.0 Y-15.0 Z2.5
F0.05
G01 Z0.04
F1.0
G01 X0.0 Y-15.0 Z0.02
G01 X-15.0 Y0.0
G01 X-15.0 Y0.0 Z0.00
G01 X0.0 Y-15.0
G01 X0.0 Y-15.0 Z-0.025
G01 X-15.0 Y0.0
G01 X-15.0 Y0.0 Z-0.050
G01 X0.0 Y-15.0
G01 X0.0 Y-15.0 Z-0.075
G01 X-15.0 Y0.0
G01 X-15.0 Y0.0 Z-0.10
G01 X0.0 Y-15.0
G01 X0.0 Y-15.0 Z-0.125
G01 X-15.0 Y0.0
G01 X-15.0 Y0.0 Z-0.150

G00 Z2.5




(Create Needleports x4)
M06 T4
G43 H4
G21
G57

M03
S6000

G00 X0.0 Y0.0 
G00 Z7.5
G00 Z2.5

G00 X-15.0 Y0.0 Z2.5
F15.0
G98 G83 Z-2.7 Q0.5
G00 Z2.5

G00 X15.0 Y0.0 Z2.5
F15.0
G98 G83 Z-2.7 Q0.5
G00 Z2.5

G00 X0.0 Y-15.0 Z2.5
F15.0
G98 G83 Z-2.7 Q0.5
G00 Z2.5

G00 X0.0 Y15.0 Z2.5
F15.0
G98 G83 Z-2.7 Q0.5
G00 Z2.5

(Cut alignment holes)
G00 X15.0 Y15.0 Z2.5
F15.0
G98 G83 Z-2.7 Q0.5
G00 Z2.5

G00 X-15.0 Y15.0 Z2.5
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













