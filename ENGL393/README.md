
Notes:
- This paper will be formatted for web. The paper is currently written in '.md' format and will be translated into an HTML/CS/JS document with better code highlighting and a feature to allow the user to switch what code is visible. See an example here: (Knight Labs Timeline/Before and After tool)
- To show what the paper will look like, visit….where the paper is hosted by Github with some basic syntax highlighting, but without times new roman/double spacing formatting for print
- If you have time or interest, try out the tutorial and see if the descriptions make sense and find what areas need better explanation. [Please keep in mind that this paper is written for a marginal amount of web experience, such as an Entrepreneur or User Interface Designer that have worked with developers before or have other development experience, but have never considered building an entire app]
- This a VERY rough draft, so go crazy with edits. I know some sentences suck.


# Sharing for Access
## Installing Meteor
	Meteor is a software package that includes a local development environment, the package manager, and other tools that make it useful. As Meteor supports both Mac and Windows development environments, the only difference is wether you will use Windows command prompt or Mac Terminal. Once you open up your command line tool, enter the commands in figure 1.1. As this process is occasionally updated, make sure to follow the most up to date guide at “Try Meteor” (Meteor Development Group, n.d.)⁠. However the commands at the time of writing are included for explanation purposes.
```shell
$ curl https://install.Meteor.com/ | sh
# you should see several lines of content downloading
$ cd … # (Choose your folder. I would suggest creating a folder titled Developer within your Documents folder as I sort my development projects by language or topic to make navigation easier)
$ Meteor create BikeShare [Choose whatever name you would like. We are telling the software (Meteor) to 'create' a new application directory called 'BikeShare']
$ cd BikeShare
$ Meteor (This initiates the Meteor environment)
```
### Figure 1.1
	After running these four to five commands, the browser will now be able to display a Meteor application that already has a user interface and stores data for each button click. To examine the files and folders inside the Meteor project, the best text editors are Atom and Sublime Text, both support a wide array of computers with the former being entirely free and the latter free for an indefinite trial (Atom, n.d.; Sublime, n.d.)⁠. Once you have chosen your text editor, open up the folder BikeShare. Inside you will find a folder called “.Meteor” (Note: if you aren't using an above mentioned folder the folders with a '.' in front of their name may not be visible) and three files called “BikeShare.css”, “.html”, and “.js” respectively. These are the most basic components of a web site. In the CSS file, there any visual settings that determine color, layout, and device (media) settings. The HTML file holds the text content and the JS file manipulates the HTML file. Each basic HTML file includes a series of demarcations called tags. The most basic tag is <div> with an associated closing tag </div>. There are special tags such as the <head> tag, which holds configuration information. The other important tag is the <body> tag, which holds the content of the page.
```html
<head>
  <title>BikeShare</title>
</head>

<body>
  <h1>Welcome to Meteor!</h1>

  {{> hello}}
</body>

<template name="hello">
  <button>Click Me</button>
  <p>You've pressed the button {{counter}} times.</p>
</template>
```
	The body section includes an interesting component, ```{{> hello}}```. This line is calling a Meteor-specific tool called Spacebars, which is based on the more common, Handlebars. The declaration is referring to a template called 'hello', which is shown below the body tags (note that capitalization is very important and that certain characters are not allowed). The template allows for a javascript file to be directly linked to the html content. Inside template hello, there is a button tag and a paragraph tag. Inside the paragraph tag there is a spacebars data context inside the double brackets. Inside the brackets, BikeShare.js is creating a variable that the html template displays. The JavaScript file creates this variable using a Meteor Session variable. These variables are unique to Meteor and allow for short term data storage, while a user is viewing a page and will be deleted on the user's exit.
```js
if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });
```
	The javascript file then watches the template for button click events using jQuery. At each event, the session variable is increased by one. By clicking the button the spacebars context within the template is continually updated with the number of click events.
```js
  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
```
## Designing the UI
	Building a bike sharing application, the first part of the user interface (UI) is to display the location of available bikes. With Meteor, including a mapping tool is very easy. Using the built in package management system, return to the command line and write: ``` meteor install mrt:leaflet ```. This will add the package written by mrt (meteorite) to support the Leaflet maps. Without this one line command, a developer would need to manually add Leaflet's JS and CSS files by downloading them off of the Leaflet website or including a version hosted on a network. Instead, a developer only needs that short command and to initiate the leaflet map in the application. This can be done by replacing the code in the first Meteor files with:
```html
<!-- BikeShare.html -->
<head>
  <title>BikeShare</title>
</head>

<body>
  {{> map}}
</body>

<template name="map">
  <div id="BikeMap" class="map-style"></div>
</template>
```
```css
/* CSS declarations go here */
.map-style {
  position: absolute;
  width: 100%;
  height: 500px;
  z-index: 1;
}
```
```coffee
if Meteor.isClient
  Template.map.rendered = ->
    if Meteor.isClient
      # Configure a Leaflet Map

      # L.Icon.Default.imagePath = 'leaflet/images';
      map = new (L.Map)('BikeMap',
        center: new (L.LatLng)(38.987701, -76.940989)
        maxZoom: 20
        zoom: 16
        zoomControl: false)
      HERE_hybridDayMobile = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/hybrid.day.mobile/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}',
        attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>'
        subdomains: '1234'
        mapID: 'newest'
        app_id: 'JIX0epTdHneK1hQlqfkr'
        app_code: 'PchnUPPBcZ5VAuHmovac8g'
        base: 'aerial'
        minZoom: 0
        maxZoom: 20).addTo(map)
    return
  return
```
	This code creates a leaflet map using the HERE mapping service. More details when I'm ready lol...

	Now that there is a way to display information, there needs to be data for the map to view.




	To prepare to add further content, a style framework will become necessary. A visual framework provides grid layouts for prototyping, normalizing the view between browsers, and standard classes for often repeated components (Jain, 2014)⁠. There are several options, such as Semantic UI, Foundation 5, and Bootstrap 3. Semantic UI is based off of normal language and has a growing user base; however, the framework is very young and lacks templates to quickly get started and no additional add-ons.
Foundation is known for being built in SASS, a styling language like CSS, but with additional features.  Bootstrap is very similar to Foundation, with an extensive list of components, styles, and device support (Firdaus, 2013)⁠. Choosing between the two is personal choice. In this paper, we will discuss different implementations with Bootstrap, as it is the most common framework (Bootstrap, 2015)⁠. Luckily, installing bootstrap is very simple using the Meteor framework, simply type into the command line:
```shell
Meteor install twbs:bootstrap
```
After a short installation time, go back to your browser and see the minimal updates. To search for additional packages, go to [Atmosphere.js](https://atmospherejs.com/?q=bootstrap) the Meteor package search.
	The next fundamental component of Meteor is working with data. The most basic application demonstrated simple
# Works Cited
Atom. (n.d.). Atom. Retrieved June 24, 2015, from https://atom.io/
Bootstrap. (2015). Bootstrap · The world’s most popular mobile-first and responsive front-end framework. Retrieved June 21, 2015, from http://getbootstrap.com/
Firdaus, T. (2013). Responsive Web Design by Example Beginner’s Guide. Packt Publishing Ltd.
Jain, N. (2014). Review of Different Responsive CSS Front-End Frameworks. Journal of Global Research in Computer Science, 5(11), 5.
Meteor Development Group. (n.d.). Try Meteor. Retrieved June 24, 2015, from https://www.Meteor.com/install
Sublime. (n.d.). Sublime Text: The text editor you’ll fall in love with. Retrieved June 24, 2015, from http://www.sublimetext.com/
