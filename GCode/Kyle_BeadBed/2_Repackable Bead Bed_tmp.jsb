(Repackable Bead Bed - Kyle King)
(02/01/2016)
(T1: n/a MICRON)
(T2: n/a MICRON)
(T3: 0.006 INCH = 151 MICRON_from Hans box-A2)
(T4: 650 MICRON = Needle interfacing_green/yel needle on computer)
(Coordinate system of G57)
%

M06 T3
G43 H3
G21
G57

M03
S6000

G00 X5.0 Y-15.0
G00 Z5.0



G00 X5.0 Y-1.0
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


(Tool Return)
M06 T0
M30
%













