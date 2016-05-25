(LMP Agarose Bead Bed with dual inlet/outlet design)
(Kyle King)
(03/28/2016)
( )
(Center on center of chip_50x50mm chip)
( )
(T1: n/a MICRON)
(T2: n/a MICRON)
(T3: 2.3 mm)
(T4: 4.0 mm Drill Bit)
(Coordinate system of G57)
%

(Create Wells)
M06 T3
G43 H3
G21
G57

M03
S6000

G00 X0.0 Y0.0 
G00 Z7.5
G00 Z2.5

G00 X0.0 Y-15.0 Z2.5
F15.0
G98 G83 Z-2.7 Q0.5
G00 Z2.5

G00 X0.0 Y15.0 Z2.5
F15.0
G98 G83 Z-2.7 Q0.5
G00 Z2.5

G00 Z5.0




(Cut alignment holes)
M06 T4
G43 H4
G21
G57

M03
S6000

G00 X0.0 Y0.0 
G00 Z7.5
G00 Z2.5

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













