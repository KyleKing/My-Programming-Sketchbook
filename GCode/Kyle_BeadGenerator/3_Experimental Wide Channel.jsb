(LMP Agarose Bead Generator with two-width exit channel)
(Kyle King/Michael Wiederoder/Han)
(03/27/2016)
( )
(Additionally, cut PMMA base into T-shape...)
(^ at end to submerge in collection dish)
(Center: 25mm from top, 25 mm from side)
( )
(T1: n/a MICRON)
(T2: 0.004 INCH = 100 MICRON A2-from Han's box)
(T3: 0.006 INCH = 151 MICRON from Kyles Box)
(T4: 650 MICRON = Needle interfacing)
(^ green/yel needle on computer)
(Coordinate system of G57)
%

M06 T2
G43 H2
G21
G57

M03
S6000

G00 X0.0 Y0.0
G00 Z2.5

(Make triangular three-way intersection)
G00 X3.0 Y3.0 Z2.5
F0.05
G01 Z0.04
F3.1
G01 X0.0 Y0.0 Z0.04
G01 X-3.0 Y3.0 Z0.04
G01 X-3.0 Y3.0 Z0.02
G01 X0.0 Y0.0 Z0.02
G01 X3.0 Y3.0 Z0.02
G01 X3.0 Y3.0 Z0.00
G01 X0.0 Y0.0 Z0.00
G01 X-3.0 Y3.0 Z0.00
G01 X-3.0 Y3.0 Z-0.02
G01 X0.0 Y0.0 Z-0.02
G01 X3.0 Y3.0 Z-0.02
G01 X3.0 Y3.0 Z-0.04
G01 X0.0 Y0.0 Z-0.04
G01 X-3.0 Y3.0 Z-0.04
G01 X-3.0 Y3.0 Z-0.06
G01 X0.0 Y0.0 Z-0.06
G01 X3.0 Y3.0 Z-0.06
G01 X3.0 Y3.0 Z1.0
G00 Z2.5

(Make THIN straight away exit channel)
G00 X0.0 Y2.0 Z2.5
F0.05
G01 Z0.04
F3.1
G01 Y2.0 Z0.04
G01 Y-46.0
G01 Y-46.0 Z0.02
G01 Y2.0
G01 Y2.0 Z0.00
G01 Y-46.0
G01 Y-46.0 Z-0.02
G01 Y2.0
G01 Y2.0 Z-0.04
G01 Y-46.0
G01 Y-46.0 Z-0.06
G01 Y2.0
G01 Y2.0 Z-0.08
G01 Y-46.0
G01 Y2.0

G00 Z2.5
(Rest of exit is made with T3)


(Make large sections prior to junction)
M06 T3
G43 H3
G21
G57

M03
S3000

G00 X0.0 Y0.0
G00 Z5.0
G00 Z2.5

G00 X0.0 Y12.0 Z2.5
F0.05
G01 Z0.0
F3.1
G01 X0.0 Y2.0 Z0.0
G01 X0.0 Y12.0 Z0.0
G01 X0.0 Y12.0 Z-0.03
G01 X0.0 Y2.0 Z-0.03
G01 X0.0 Y2.0 Z-0.06
G01 X0.0 Y12.0 Z-0.06
G00 Z1.0

G00 X3.0 Y3.0 Z2.5
F0.05
G01 Z0.0
F3.1
G01 X3.0 Y3.0 Z0.0
G01 X12.0 Y3.0 Z0.0
G01 X3.0 Y3.0 Z-0.03
G01 X12.0 Y3.0 Z-0.03
G01 X3.0 Y3.0 Z-0.06
G01 X12.0 Y3.0 Z-0.06
G00 Z1.0

G00 X-3.0 Y3.0 Z2.5
F0.05
G01 Z0.0
F3.1
G01 X-3.0 Y3.0 Z0.0
G01 X-12.0 Y3.0 Z0.0
G01 X-3.0 Y3.0 Z-0.03
G01 X-12.0 Y3.0 Z-0.03
G01 X-3.0 Y3.0 Z-0.06
G01 X-12.0 Y3.0 Z-0.06
G00 Z1.0

(Make THICK straight away exit channel)
G00 X0.0 Y-45.0 Z2.5
F0.05
G01 Z0.04
F3.1
G01 Y-45.0 Z0.04
G01 Y-85.0
G01 Y-85.0 Z0.02
G01 Y-45.0
G01 Y-45.0 Z0.00
G01 Y-85.0
G01 Y-85.0 Z-0.02
G01 Y-45.0
G01 Y-45.0 Z-0.04
G01 Y-85.0
G01 Y-85.0 Z-0.06
G01 Y-45.0
G01 Y-45.0 Z-0.08
G01 Y-85.0
G01 Y-45.0

G00 Z2.5



(Make needleports)
M06 T4
G43 H4
G21
G57

M03
S6000

G00 X0.0 Y0.0
G00 Z5.0
G00 Z2.5

G00 X0.0 Y12.0 Z2.5
F15.0
G98 G83 Z-2.7 Q0.5
G00 Z2.5

G00 X12.0 Y3.0 Z2.5
F15.0
G98 G83 Z-2.7 Q0.5
G00 Z2.5

G00 X-12.0 Y3.0 Z2.5
F15.0
G98 G83 Z-2.7 Q0.5
G00 Z2.5


(Tool Return)
M06 T0
M30
%












