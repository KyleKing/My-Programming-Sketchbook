# Software for Access
> Assignment 6: Definition and Causal Analysis of Technology

Kyle King—ENGL393

June 22, 2015

## Purpose
To encourage the use and application of the Meteor JS web development framework. In particular, to examine the potential application of this technology for sharing economies.

## Audience
My audience are front-end web developers and tech-company entrepreneurs with limited back-end or full stack web development experience, however, they will have experience working in web development.

## Note to grader:
- See example of code highlighting here: https://github.com/KyleKing/My-Programming-Sketchbook/tree/master/ENGL393 (The final version will have this type of highlighting – currently the paper is written in a .md format for simplicity)

# Sharing for Access
Building cheap and efficient web applications that can manage a database of inventory and a large user base is a difficult task. Meteor, a better alternative to other web development frameworks, simplifies this process by reducing developer decisions and making it possible for a smaller, less technical team, to build a market-viable product (MVP). To demonstrate Meteor’s effectiveness in building secure and robust applications, this tutorial will explain the development of a sample bike sharing application.

## Configuring Meteor
Meteor is a software package that needs to be installed onto a computer, similar to Node.js and other development frameworks. However, installing Meteor has a significantly easier process compared to its competitors. For a Windows computer, the official installer is downloaded from https://www.meteor.com/install. Likewise, terminal is used to download Meteor on a Mac or Linux machine (Meteor Development Group, n.d.). The command is as follows:

```shell
curl https://install.Meteor.com/ | sh
```

Once downloaded, the first Meteor application can be created. Using Meteor's included build tools, enter, ```meteor create BikeShare``` into the command line. This command creates an application called BikeShare. To initiate the newly created application, navigate to the directory, ```cd BikeShare``` and run the application with ```meteor```.

[Illustration 1](Solution Paper.png)
Illustration 1: Meteor example welcome page

After running these three commands, the browser will display the Meteor application. The application runs a “hello world” example of the most basic code to prove proper initiation of the software. The has hello world example displays a simple user interface and reactively stores data as seen in illustration 1. Each time the button is clicked, the current count of button presses is saved and displayed instantly. Altering this code will introduce the core meteor concepts of reactivity, data storage, and rapid prototyping.

## Hello World in Meteor

To begin developing a meteor application, a text editor is required to view and edit application files. Although there are a multitude of text editor options, Atom and Sublime are recommended due to their simplicity and ease of use. Both support a wide array of computer operating systems and offer extensive shortcuts and tools to simplify writing code (Atom, n.d.; Sublime, n.d.). Once a text editor is chosen, open the folder “BikeShare.” Within the “BikeShare” folder, there will be a second folder and three files. The folder, “.meteor,” holds all of the Meteor core functionality and remains largely untouched throughout development. The files “BikeShare.css”, “BikeShare.html”, and “BikeShare.js” create the simple hello world application shown in Illustration 1. The Cascading Style Sheets (CSS) file controls the page’s visual settings, such as color and font. The HTML file holds the text content of the page, such as headers, buttons, and paragraphs. The JavaScript (JS) file counts the number of button clicks and then stores the number in a special variable, called a session variable.

## Using Data in Meteor

Meteor has several methods for storing information, namely through the use of a session variable. These variables are only available while the user is logged in, once the user logs out or leaves the app, the variable is reset. Session variables are very useful when working with complex views or short term data. In the bike share example, variables are used to store the number of button clicks since the window was last opened. Inside the BikeShare.js file, the session variable is created by the following code snippet.

```js
// counter starts at 0
Session.setDefault('counter', 0);
Template.hello.events({
'click button': function () {
// increment the counter when button is clicked
Session.set('counter', Session.get('counter') + 1);
}
});
```

The core component of a Meteor page is a template that encases the HTML content within its designated section. Without the templates, the html content is rendered on every page, once routing control is added. This template structure reduces the amount of HTML needed and allows JS functions to trigger based on template events. To select which template to render in a given HTML block, the syntax, ```{{> hello}}``` is used (Meteor, n.d.). In the hello world example code, this is used to include the 'hello' template in the body element.

```js
Template.hello.helpers({
counter: function () {
return Session.get('counter');
}
});
```

To render the data for the user, Meteor uses Spacebars, a tool for actively manipulating the HTML document. When given a value from a JS file, like in the snippet above, Spacebars renders the value in HTML. In this case, the session variable counter is created in BikeShare.js and shown as a component of the HTML through this syntax: ```{{counter}}```. This looks very similar to the template inclusion syntax and serves a similar function. Anytime the session variable-counter is updated, the HTML content is automatically re-rendered and updated by Meteor. Building a tool that reactively updates and displays data is easily prototyped with the Meteor development framework.
Session variables are effective for short term data storage. However, for long term storage, Meteor comes equipped with Mongo Database, a back-end framework to store information. Mongo stores information in a relational format, similar to a binder with many documents inside it. Each document contains fields of information that can be accessed through a request query. To create the document, this line ```new Mongo.Collection('bikes');``` is run in JS. To interact with the document, a link is created by assigning a global variable that can be accessed throughout the app. The code snippet below creates a sample database of bike data and a subsequent table to view the data. These successive files can replace the hello world files, BikeShare.html and BikShare.js respectively.

```html
(Code not finished - Table to display the new data)
```
```js
DailyBikeData = new Mongo.Collection('dailyBikeData');

if (Meteor.isServer) {
// Create Bike GPS coordinates
function randGPS() {
function getRandomArbitrary(min, max) {
return Math.random() * (max - min) + min;
}
var accuracy = 1000000; // To account for the integer based rand function
var bottomLng = -76.936569; var topLng = -76.950603;
var leftLat = 38.994052; var rightLat = 38.981376;
var randCoordinates = {
lat: (getRandomArbitrary(leftLat * accuracy, rightLat * accuracy) / accuracy),
lng: (getRandomArbitrary(bottomLng * accuracy, topLng * accuracy) / accuracy)
};
return randCoordinates;
};

// Insert data into the database
if (DailyBikeData.find().count() === 0) {
var i = 1;
while (i <= 50) {
var randCoordinates = randGPS();
DailyBikeData.insert({
Bike: i,
Tag: Math.round(0.65 * Math.random()) === 0 ? 'Available' : 'In Use',
Positions: {
lat: randCoordinates.lat,
lng: randCoordinates.lng
}
});
i++;
}
console.log('Created DailyBikeData data schema');
}
}

if (Meteor.isClient) {
// Receive data from server and display on map
var bikesData = DailyBikeData.find().fetch();
var i = bikesData.length - 1;
while (i >= 1) {
var marker = L.marker([bikesData[i].Positions.lat, bikesData[i].Positions.lng]).addTo(map);
i--;
}

Template.map.function() {
return bikesDataTable;
}

// Display user location
map.locate({ setView: true }).on("locationfound", function(e) {
var marker = L.marker([e.latitude, e.longitude]).addTo(map);
});
};
}
```

First, the JS file creates the database of bike locations on the server. The client can automatically see these changes and retrieve the values with, ```var bikesData = DailyBikeData.find().fetch();```. The HTML file then creates a table with Spacebars syntax to render every available value in an array. In this case, the table renders the array of bike positions and information in a long list of locations in longitude and latitude format.

With this short code, bike positions are randomly generated and then stored in a database. In a published application, changes made on one computer would be visible to every user. However, displaying geographical locations in a table format is ineffective. To display the data in a meaningful way, the bike positions should be visible on a map that considers the user's current location. Leaflet, an open source mapping software similar to Google Maps, is a readily available package that makes this process possible. Leaflet can be added by entering ```meteor add bevanhunt:leaflet```. After a short download, the entire Leaflet library will be available. To select where in the application the map will be rendered and with what information, the HTML, CSS, and JS files need the following code snippets appended.

```html
<body>
{{> map}}
</body>

<template name="map">
<div id="BikeMap" class="map-style"></div>
</template>
```
```JS
if (Meteor.isClient) {
// Create the Leaflet Map
Template.map.rendered = function() {
L.Icon.Default.imagePath = 'leaflet/images';
var HERE_hybridDayMobile, map;
if (Meteor.isClient) {
map = new L.Map('BikeMap', { center: new L.LatLng(38.987701, -76.940989) });
HERE_hybridDayMobile = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/hybrid.day.mobile/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}', {
attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
subdomains: '1234',
mapID: 'newest',
app_id: 'JIX0epTdHneK1hQlqfkr',
app_code: 'PchnUPPBcZ5VAuHmovac8g',
base: 'aerial'
}).addTo(map);
}

// Receive data from server and display on map
var bikesData = DailyBikeData.find().fetch();
var i = bikesData.length - 1;
while (i >= 1) {
var marker = L.marker([bikesData[i].Positions.lat, bikesData[i].Positions.lng]).addTo(map);
i--;
}

// Display user location
map.locate({ setView: true }).on("locationfound", function(e) {
var marker = L.marker([e.latitude, e.longitude]).addTo(map);
});
};
}
```

The first file creates a template called 'map' that contains an element with the tag, 'BikeMap'. This tells Leaflet where to initiate the map. The short CSS declarations additionally determine the size of the map so that it does not have a height of zero pixels. The JS file determines the map's configuration. By using the Leaflet API, a bike-friendly map from HERE maps is chosen and displayed in window. Leaflet includes a multitude of map styles and options to match any need.

After retrieving all available bike locations, the data points are displayed as markers on the Leaflet map through a for loop that plots each successive location. Using Leaflet's simple API, the user location can then be located and displayed with a short function. To improve this basic code, each bike can be tagged to determine the status of the inventory. With a small tweak to the code, only bikes tagged “Available” will be shown in the map. For example, if```var bikesData = DailyBikeData.find().fetch();``` is replaced with, ```var bikesData = DailyBikeData.find({tag: 'Available'}).fetch();```, only available bikes will be returned.

This simple demonstration rapidly prototypes a bike sharing application that can store inventory locations and sort through the data to display only available bikes on a Leaflet map. The extent of this tutorial discusses only a portion of what is possible with Meteor. The same package manager that simplified adding Leaflet can add complicated packages that can control user interaction or entire libraries of code that simplify visual elements for the website. This tutorial covers creating the most basic components of a web application to show the value of the Meteor web development framework.

# Works Cited

Atom. (n.d.). Atom. Retrieved June 24, 2015, from https://atom.io/

Bootstrap. (2015). Bootstrap · The world’s most popular mobile-first and responsive front-end framework. Retrieved June 21, 2015, from http://getbootstrap.com/

Firdaus, T. (2013). Responsive Web Design by Example Beginner’s Guide. Packt Publishing Ltd.

Jain, N. (2014). Review of Different Responsive CSS Front-End Frameworks. Journal of Global Research in Computer Science, 5(11), 5.

Meteor. (n.d.). Documentation - Meteor. Retrieved June 21, 2015, from http://docs.meteor.com/#/full/

Meteor Development Group. (n.d.). Try Meteor. Retrieved June 24, 2015, from https://www.meteor.com/install

Sublime. (n.d.). Sublime Text: The text editor you’ll fall in love with. Retrieved June 24, 2015, from http://www.sublimetext.com/

