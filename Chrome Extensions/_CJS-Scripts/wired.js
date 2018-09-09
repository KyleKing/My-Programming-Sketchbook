const custStyles = [`
  .social-share-sidebar-component {
    display: none;
  }
  .article-main-component__columns {
    max-width: 85% !important;
  }
  .article-main-component__content,
  .article-body-component {
    max-width: 100% !important;
  }

  .post-listing-component.most-popular {
    opacity: 0.05;
  }
  .post-listing-component.most-popular:hover {
    -webkit-animation: fadein 1s linear 1 normal forwards;
  }
  @-webkit-keyframes fadein{
      from { opacity: 0.05; }
      to { opacity: 0.9; }
  }`,
]
const cssDiv = `<style type="text/css">
  ${custStyles.join( '\n' )}
  </style>`

// console.log( `Adding Custom Styles:\n${cssDiv}\n` )
$( 'head' ).append( cssDiv )
