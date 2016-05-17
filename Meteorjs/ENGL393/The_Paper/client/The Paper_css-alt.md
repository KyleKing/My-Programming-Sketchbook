# CSS Styles not used in main style sheet

> more or less just notes

```css

body {
  margin-left: auto;
  margin-right: auto;
	max-width: 8in;
	font-family: "Times New Roman";
	color: #333333 !important;
}

h1 {
	/* font-size: 25pt; */
	font-size: 30pt;
}
h2 {
	/* font-size: 18pt; */
	font-size: 25pt;
}

p.TransmittalLetter {
	/* font-size: 12pt; */
	font-size: 18pt;
	text-align: left;
	line-height: 160%;
}

.western {
	/* font-size: 12pt; */
	font-size: 18pt;
	line-height: 200%;
}
p.western {
	text-indent: 0.5in;
}

.Center { text-align: center; }
.Break {
	margin-top: 100px;
	page-break-before: always;
}

 // @page { margin-left: 1.5in; margin-right: 1.5in; margin-top: 1in; margin-bottom: 1in }

//
// BREAK, above is for web, below may have been used for print
//

/* CSS declarations go here */
// Sizing: http://reeddesign.co.uk/test/points-pixels.html
h1 {
	font-family: TimesNewRoman, 'Times New Roman', Times, Baskerville, Georgia, serif;
	font-size: 23px;
	font-style: normal;
	font-variant: normal;
	font-weight: 500;
	line-height: 23px;
}
h3 {
	font-family: TimesNewRoman, 'Times New Roman', Times, Baskerville, Georgia, serif;
	font-size: 17px;
	font-style: normal;
	font-variant: normal;
	font-weight: 500;
	line-height: 23px;
}
p {
	font-family: TimesNewRoman, 'Times New Roman', Times, Baskerville, Georgia, serif;
	font-size: 14px;
	font-style: normal;
	font-variant: normal;
	font-weight: 400;
	line-height: 23px;
}
blockquote {
	font-family: TimesNewRoman, 'Times New Roman', Times, Baskerville, Georgia, serif;
	font-size: 17px;
	font-style: normal;
	font-variant: normal;
	font-weight: 400;
	line-height: 23px;
}
pre {
	font-family: TimesNewRoman, 'Times New Roman', Times, Baskerville, Georgia, serif;
	font-size: 11px;
	font-style: normal;
	font-variant: normal;
	font-weight: 400;
	line-height: 23px;
}
```