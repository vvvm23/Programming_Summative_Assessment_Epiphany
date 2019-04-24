# **Programming Summative Epiphany Term**
## *Country Database Web Application*
___
### Overview

This web application allows users to look up statistics, map data and wikipedia data on the countries of the world. It also allows for free
use of the map by selecting latitude and longitude. Authenticated
users are also allowed to edit, delete or add countries to the array
of country objects stored in memory.

The web application is hosted [here.](https://prog-summative.herokuapp.com/)
Credentials are $USER:$PASS
___
### How to Use

#### Start up

To start a local instance of the web application, navigate to project root and type ```npm start```. Wait a few moments and connect to 127.0.0.1:8090 in your web browser to load the home page.

#### Index Page

There are onscreen instructions to guide you on how to use the user interface. These will be repeated here:

* Click Statistics, Map or Wikipedia on the left to begin query input.

* The top section is used to query the server for data on countries. Enter the name and check the details you wish to retrieve. Press Statistics, Map or Wikipedia to view each section of data. Press toggle all to toggle all checkboxes.

* The lower section is used for free control of the map. Simply enter latitude and longitude, zoom level and map type, then hit submit.

* To go to the admin page, press the red Admin Page button at the bottom of the page.

#### Admin Page

Additionally, the instructions for the admin page:

* Click Add, Edit, or Delete to navigate to each section.

* In Add, enter details into input boxes then click submit.

* In Edit, first search for a country, then edit details in input box, then click submit.

* In Delete, first search for a country, then confirm that you wish to delete the country.

* Common Name is a required field in both Add and Delete. Additionally, two countries cannot have the same name. The following fields support comma delimited formats: Languages, Translations, Latitude-Longitude, Borders

* Click Logout to deauthenticate your session. Click Home to return to homepage without deauthenticating.

#### Testing

To use the inbuilt test scripts navigate to project root and type
```npm test```. If you wish to add additional tests add them to ```test.js``` in project root. Jest is the testing framework. Note that
tests to authenticated endpoints must use the mock object rather than
app in order to circumnavigate auth0 authentication.

___
### API Usage

*All parameters are compulsory unless stated otherwise *

#### /query
```
- Request Parameters -
    name: User specified search string.
    check: 15 long binary string. Represents requested Statistics

- Response Attributes -
    name: Object containing common, official and native names
    native_name: Unfolded object of native contained in name.
    region: String containing the region the country is in
    subregion: String containing the subregion the country is in
    capital: Array containing capital of the country
    currency: Array containing currencies in the Country
    languages: Object containing languages spoken in the country
    demonym: String containing demonym for citizens in the country
    independent: Boolean value for the independence of the country
    translations: Object containing translations for the country's name
    flag: Unicode for flag emoji
    latlng: Two long array containing longitude and latitude of the country
    borders: Array containing codes for bordering countries
    landlocked: Boolean for the landlocked status of the country
    area: Integer value for surface area of the country
    callingCode: Integer value for calling code in the country
    tld: domain name ending for the country
```

#### /map
```
- Request Parameters -
    lat: Integer value for latitude
    lon: Integer value for longitude
    t: 0:1 -> Default:Satelite
    z: Integer value for zoom level
    dim_y: Integer value for height of map image in pixels
    dim_x: Integer value for width of map image in pixels
- Response Parameters -
    map_url: String locating map image on external API
```

#### /wiki
```
- Request Parameters -
    name: Name of selected country's common name by Server

- Response Parameters -
    wiki: Contents of summary section of requested wikipedia page
```

#### /search/delete [Authenticated]
```

```

#### /search/edit [Authenticated]
```

```

#### /add [Authenticated]
```

```

#### /edit [Authenticated]
```

```

#### /delete [Authenticated]
```

```
___
### External APIs

___
### License

```
MIT License

Copyright (c) 2019 Alexander McKinney

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
