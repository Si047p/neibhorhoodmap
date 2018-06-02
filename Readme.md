Neighborhood Map

---------------
Overview

The map's default information is placed within the java script file.

The neighborhood map provides a list of the parks in the area around my residence.
The center point is defined within the java script file located in js/app.js.
Knockout was used to provide observables that will consistently refresh.  
When clicked an info window populates the name of each of the locations.  
Clicking the hamburger icon in the upper right corner will slide out a list of all the parks within a 4500 meter range.  
Selecting a park name from the list will search Flickr using a JSONP API call and return photos that match the name of the location.
The page will adjust to different layouts based on screen orientation and max view area.
Search box will search through the titles inside of the list of Parks hiding those that do not match the search criteria.


Requirements
lib folder contains the CSS file necessary for styling.
Js folder contains the necessary script files.
Website can be ran using index.html with the correct files within their respective folders and in the same directory as the web page.
