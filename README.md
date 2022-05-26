# react-mapbox-gl
Interactive slippy map built with React + Mapbox GL + react-map-gl

## How to install & run

Prerequisites:
You must have valid API keys for both Mapbox GL and OpenWeather. 
Once you have both API keys, create a file with the name `.env` and create two variables as so:
```
// .env

MAPBOX_KEY=<YOUR_MAPBOX_KEY>
WEATHER_API_KEY=<YOUR_WEATHER_KEY>
```


1) Run commands in terminal:
```
> npm install

> npm run start
```

2) Navigate to localhost:8080

## How to use map

Think of using this app much like you would with Google maps - you can drag the map around, click on points, and zoom in or out.

You will see several inputs on the top right of the screen that act as map controls, in addition to the standard zoom and full screen controls on top left of the screen.

By clicking on a given point, the longitude and latitude coordinates will appear in their corresponding control inputs. Additionally, by clicking on a point, a detailed weather report will appear on your selected location, just in case you're planning a visit.


### Map Controls:
1) Longitude/Latitude: You can manually enter longitude and latitude coordinates, and click "Lets Go!" (or hit Enter) to center the map on the desired location. You will also see a weather report appear over the desired location once map is centered.

2) Terrain Contour: By toggling this feature on, you will see a countour layer appear over the map. Note: This contour layer only appears on landmasses above 
10,000ft, and when properly zoomed in (try turning on the toggle when the page initially loads!).

3) Full screen and zoom: These are located on the top left of the screen.

