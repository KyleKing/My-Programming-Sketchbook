FasdUAS 1.101.10   ��   ��    k             l     ��  ��    K E Symlinked into ~/Library/Services/ dir to be run as an Apple Service     � 	 	 �   S y m l i n k e d   i n t o   ~ / L i b r a r y / S e r v i c e s /   d i r   t o   b e   r u n   a s   a n   A p p l e   S e r v i c e   
  
 l     ��������  ��  ��        l     ��  ��    ^ X [Inspired by this guide](http://www.makeuseof.com/tag/3-tools-unleash-mac-os-menu-bar/)     �   �   [ I n s p i r e d   b y   t h i s   g u i d e ] ( h t t p : / / w w w . m a k e u s e o f . c o m / t a g / 3 - t o o l s - u n l e a s h - m a c - o s - m e n u - b a r / )      l     ��������  ��  ��        i        I      �� ���� 0 conditionalclose     ��  o      ���� 0 application_name  ��  ��    k     '       O     !    Z       ��    =    ! " ! n    
 # $ # 1    
��
�� 
prun $  g     " m   
 ��
�� boovtrue  k     % %  & ' & I   ������
�� .aevtquitnull��� ��� null��  ��   '  (�� ( L     ) ) b     * + * m     , , � - - 
 Q u i t   + o    ���� 0 application_name  ��  ��     k      . .  / 0 / l   �� 1 2��   1 : 4 	display dialog "Already quit  " & application_name    2 � 3 3 h   	 d i s p l a y   d i a l o g   " A l r e a d y   q u i t     "   &   a p p l i c a t i o n _ n a m e 0  4�� 4 L      5 5 b     6 7 6 m     8 8 � 9 9  A l r e a d y   q u i t   7 o    ���� 0 application_name  ��    4     �� :
�� 
capp : o    ���� 0 application_name     ;�� ; I  " '�� <��
�� .sysodelanull��� ��� nmbr < m   " # = = ?ٙ�������  ��     > ? > l     ��������  ��  ��   ?  @ A @ i    B C B I      �� D���� 0 conditionalopen   D  E�� E o      ���� 0 application_name  ��  ��   C k     ' F F  G H G O     ! I J I Z      K L�� M K =    N O N n    
 P Q P 1    
��
�� 
prun Q  g     O m   
 ��
�� boovtrue L k     R R  S T S l   �� U V��   U < 6 	display dialog "Already running " & application_name    V � W W l   	 d i s p l a y   d i a l o g   " A l r e a d y   r u n n i n g   "   &   a p p l i c a t i o n _ n a m e T  X�� X L     Y Y b     Z [ Z o    ���� 0 application_name   [ m     \ \ � ] ]     i s   a l r e a d y   o p e n��  ��   M k      ^ ^  _ ` _ I   ������
�� .ascrnoop****      � ****��  ��   `  a�� a L      b b b     c d c m     e e � f f  O p e n e d   d o    ���� 0 application_name  ��   J 4     �� g
�� 
capp g o    ���� 0 application_name   H  h�� h I  " '�� i��
�� .sysodelanull��� ��� nmbr i m   " # j j ?ə�������  ��   A  k l k l     ��������  ��  ��   l  m n m l     �� o p��   o !  Quit any unneccessary apps    p � q q 6   Q u i t   a n y   u n n e c c e s s a r y   a p p s n  r s r l     t���� t I     �� u���� 0 conditionalclose   u  v�� v m     w w � x x  K e e p i n g Y o u A w a k e��  ��  ��  ��   s  y z y l     �� { |��   { * $ conditionalclose("Day One Classic")    | � } } H   c o n d i t i o n a l c l o s e ( " D a y   O n e   C l a s s i c " ) z  ~  ~ l    ����� � I    �� ����� 0 conditionalclose   �  ��� � m    	 � � � � �  V i v a l d i��  ��  ��  ��     � � � l    ����� � I    �� ����� 0 conditionalclose   �  ��� � m     � � � � �  C h e a t S h e e t��  ��  ��  ��   �  � � � l    ����� � I    �� ����� 0 conditionalclose   �  ��� � m     � � � � �  B o o m��  ��  ��  ��   �  � � � l   " ����� � I    "�� ����� 0 conditionalclose   �  ��� � m     � � � � �  A c r o s y n c��  ��  ��  ��   �  � � � l     ��������  ��  ��   �  � � � l     �� � ���   � %  Open apps if not open already:    � � � � >   O p e n   a p p s   i f   n o t   o p e n   a l r e a d y : �  � � � l  # ) ����� � I   # )�� ����� 0 conditionalopen   �  ��� � m   $ % � � � � �  B a r t e n d e r   2��  ��  ��  ��   �  � � � l  * 0 ����� � I   * 0�� ����� 0 conditionalopen   �  ��� � m   + , � � � � �  S i p��  ��  ��  ��   �  � � � l     �� � ���   �   conditionalopen("Flux")    � � � � 0   c o n d i t i o n a l o p e n ( " F l u x " ) �  � � � l  1 7 ����� � I   1 7�� ����� 0 conditionalopen   �  ��� � m   2 3 � � � � �  D a s h��  ��  ��  ��   �  � � � l  8 > ����� � I   8 >�� ����� 0 conditionalopen   �  ��� � m   9 : � � � � �  D r o p b o x��  ��  ��  ��   �  � � � l  ? E ����� � I   ? E�� ����� 0 conditionalopen   �  ��� � m   @ A � � � � �  E v e r n o t e H e l p e r��  ��  ��  ��   �  � � � l  F L ����� � I   F L�� ����� 0 conditionalopen   �  ��� � m   G H � � � � �  R e s c u e T i m e��  ��  ��  ��   �  � � � l  M S ����� � I   M S�� ����� 0 conditionalopen   �  ��� � m   N O � � � � �  G o o g l e   D r i v e��  ��  ��  ��   �  � � � l  T Z ����� � I   T Z�� ����� 0 conditionalopen   �  ��� � m   U V � � � � �  S n a p p y A p p H e l p e r��  ��  ��  ��   �  � � � l  [ a ���� � I   [ a�~ ��}�~ 0 conditionalopen   �  ��| � m   \ ] � � � � �  P o p C l i p�|  �}  ��  �   �  � � � l  b j ��{�z � I   b j�y ��x�y 0 conditionalopen   �  ��w � m   c f � � � � �  D r o p s h e l f�w  �x  �{  �z   �  � � � l     �v � ��v   � ) # conditionalopen("BetterTouchTool")    � � � � F   c o n d i t i o n a l o p e n ( " B e t t e r T o u c h T o o l " ) �  � � � l     �u � ��u   �   conditionalopen("Focus")    � � � � 2   c o n d i t i o n a l o p e n ( " F o c u s " ) �  � � � l     �t�s�r�t  �s  �r   �  � � � l     �q � ��q   �   Desn't open?    � � � �    D e s n ' t   o p e n ? �  � � � l     �p � �p   �    conditionalopen("Alfred")     � 4   c o n d i t i o n a l o p e n ( " A l f r e d " ) �  l     �o�o   ) # Make sure Hammerspoon is open too!    � F   M a k e   s u r e   H a m m e r s p o o n   i s   o p e n   t o o !  l  k s	�n�m	 I   k s�l
�k�l 0 conditionalopen  
 �j m   l o �  H a m m e r s p o o n�j  �k  �n  �m    l     �i�h�g�i  �h  �g    l     �f�e�d�f  �e  �d    l     �c�c     Turn Bluetooth Off    � &   T u r n   B l u e t o o t h   O f f  l     �b�b   %  Using "blueutil" installed at:    � >   U s i n g   " b l u e u t i l "   i n s t a l l e d   a t :  l  t {�a�` r   t {  m   t w!! �"" . / u s r / l o c a l / b i n / b l u e u t i l  o      �_�_ 0 blueutilpath  �a  �`   #$# l     �^%&�^  %   Turn Bluetooth Off   & �'' &   T u r n   B l u e t o o t h   O f f$ ()( l  | �*�]�\* r   | �+,+ n   | �-.- 4  � ��[/
�[ 
cwor/ m   � ��Z�Z��. l  | �0�Y�X0 I  | ��W1�V
�W .sysoexecTEXT���     TEXT1 b   | �232 o   | �U�U 0 blueutilpath  3 m    �44 �55    s t a t u s�V  �Y  �X  , o      �T�T 0 sb  �]  �\  ) 676 l  � �8�S�R8 Z   � �9:�Q�P9 =  � �;<; o   � ��O�O 0 sb  < m   � �== �>>  o n: I  � ��N?�M
�N .sysoexecTEXT���     TEXT? b   � �@A@ o   � ��L�L 0 blueutilpath  A m   � �BB �CC    o f f�M  �Q  �P  �S  �R  7 DED l     �K�J�I�K  �J  �I  E FGF l     �HHI�H  H    turn internet sharing off   I �JJ 4   t u r n   i n t e r n e t   s h a r i n g   o f fG KLK l     �GMN�G  M ; 5 do shell script "osascript InternetSharing.scpt off"   N �OO j   d o   s h e l l   s c r i p t   " o s a s c r i p t   I n t e r n e t S h a r i n g . s c p t   o f f "L PQP l     �F�E�D�F  �E  �D  Q RSR l     �C�B�A�C  �B  �A  S TUT l     �@VW�@  V   Debugging:   W �XX    D e b u g g i n g :U YZY l     �?�>�=�?  �>  �=  Z [\[ l     �<]^�<  ] B < Use console to log timestamp and info to console upon error   ^ �__ x   U s e   c o n s o l e   t o   l o g   t i m e s t a m p   a n d   i n f o   t o   c o n s o l e   u p o n   e r r o r\ `a` l     �;bc�;  b %  to logit(log_string, log_file)   c �dd >   t o   l o g i t ( l o g _ s t r i n g ,   l o g _ f i l e )a efe l     �:gh�:  g v p do shell script "echo `date '+%Y-%m-%d %T: '`\"" & log_string & "\" >> $HOME/Library/Logs/" & log_file & ".log"   h �ii �   d o   s h e l l   s c r i p t   " e c h o   ` d a t e   ' + % Y - % m - % d   % T :   ' ` \ " "   &   l o g _ s t r i n g   &   " \ "   > >   $ H O M E / L i b r a r y / L o g s / "   &   l o g _ f i l e   &   " . l o g "f jkj l     �9lm�9  l  
 end logit   m �nn    e n d   l o g i tk opo l     �8qr�8  q ' ! Other method of printing results   r �ss B   O t h e r   m e t h o d   o f   p r i n t i n g   r e s u l t sp tut l  � �v�7�6v r   � �wxw n   � �yzy 1   � ��5
�5 
dstrz l  � �{�4�3{ I  � ��2�1�0
�2 .misccurdldt    ��� null�1  �0  �4  �3  x o      �/�/ 0 	datestamp 	dateStamp�7  �6  u |}| l  � �~�.�-~ r   � �� n   � ���� 1   � ��,
�, 
tstr� l  � ���+�*� I  � ��)�(�'
�) .misccurdldt    ��� null�(  �'  �+  �*  � o      �&�& 0 	timestamp 	timeStamp�.  �-  } ��%� l  � ���$�#� L   � ��� b   � ���� b   � ���� b   � ���� m   � ��� ��� . T h i s   s c r i p t   w a s   r u n   o n  � o   � ��"�" 0 	datestamp 	dateStamp� m   � ��� ���    a t  � o   � ��!�! 0 	timestamp 	timeStamp�$  �#  �%       � ����!���������   � ������������� 0 conditionalclose  � 0 conditionalopen  
� .aevtoappnull  �   � ****� 0 blueutilpath  � 0 sb  � 0 	datestamp 	dateStamp� 0 	timestamp 	timeStamp�  �  �  �  �  � � ������ 0 conditionalclose  � �
��
 �  �	�	 0 application_name  �  � �� 0 application_name  � ��� , 8 =�
� 
capp
� 
prun
� .aevtquitnull��� ��� null
� .sysodelanull��� ��� nmbr� (*�/ *�,e  *j O�%Y �%UO�j � � C����� � 0 conditionalopen  � ����� �  ���� 0 application_name  �  � ���� 0 application_name  � ���� \�� e j��
�� 
capp
�� 
prun
�� .ascrnoop****      � ****
�� .sysodelanull��� ��� nmbr�  (*�/ *�,e  	��%Y *j O�%UO�j � �����������
�� .aevtoappnull  �   � ****� k     ���  r��  ~��  ���  ���  ���  ���  ���  ���  ���  ���  ���  ���  ���  ���  ��� �� �� (�� 6�� t�� |�� �����  ��  ��  �  � ! w�� � � � � ��� � � � � � � � � �!��4������=B�������������� 0 conditionalclose  �� 0 conditionalopen  �� 0 blueutilpath  
�� .sysoexecTEXT���     TEXT
�� 
cwor�� 0 sb  
�� .misccurdldt    ��� null
�� 
dstr�� 0 	datestamp 	dateStamp
�� 
tstr�� 0 	timestamp 	timeStamp�� �*�k+ O*�k+ O*�k+ O*�k+ O*�k+ O*�k+ O*�k+ O*�k+ O*�k+ O*�k+ O*�k+ O*�k+ O*�k+ O*�k+ O*a k+ O*a k+ Oa E` O_ a %j a i/E` O_ a   _ a %j Y hO*j a ,E` O*j a ,E` Oa _ %a  %_ %� ���  o f f� ��� * T u e s d a y ,   M a y   1 7 ,   2 0 1 6� ���  9 : 0 3 : 4 4   A M�  �  �  �  �  ascr  ��ޭ