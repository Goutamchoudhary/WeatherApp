// Exporting variables and functions
// export { month, date, getCurrentDay, getCurrentTime };
// Write below code while Importing 
// import { month, date, getCurrentDay, getCurrentTime } from './index.js';

const http = require("http");
const fs = require("fs");
var request = require("request");

const homeFile = fs.readFileSync("popup.html", "utf-8");


// API KEY
const key = "9d10b2e47cd85175719822f434fa5f4a";
// api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid={API key}
// ${process.env.APPID}

// CHECK IF BROWSER SUPPORTS GEOLOCATION
const { Navigator } = require("node-navigator");
const navigator = new Navigator();

navigator.geolocation.getCurrentPosition((success, error) => {
    if (error) console.error(error);
    else {
        console.log(success);
        setPosition(success);
    }
});

 // SET USER'S POSITION
var latitude;// = 28.6542;
var longitude;// = 77.2373;
var apiURL;

function setPosition(position){
    latitude = position.latitude;
    longitude = position.longitude;
    apiURL = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    callServer();
}

// Create server

const server = http.createServer((req, res) => {
    console.log("hello");
    if (req.url = "/") {
        console.log("hey!");
        console.log(apiURL);
        request({ url: apiURL, json: true }, (error, response) => {
            if (error) { 
                console.log('Unable to connect to Forecast API'); 
            } 
            else { 
                const objData = JSON.parse(JSON.stringify(response));
                console.log("Hello");
                //console.log(objData);
                console.log(objData.body.main);
        
                let realTimeData = homeFile.replace("{%tempval%}", (objData.body.main.temp - 273.15).toPrecision(4));
                realTimeData = realTimeData.replace("{%tempmin%}", (objData.body.main.temp_min - 273.15).toPrecision(4));
                realTimeData = realTimeData.replace("{%tempmax%}", (objData.body.main.temp_max - 273.15).toPrecision(4));
                realTimeData = realTimeData.replace("{%city%}", objData.body.name);
                realTimeData = realTimeData.replace("{%country%}", objData.body.sys.country);
                realTimeData = realTimeData.replace("{%tempstatus%}", objData.body.weather[0].main);

                res.end(realTimeData);
                //console.log(realTimeData);
            }
        })
    } 
    else {
        res.end("File not found");
    }
});


// Calling server object

function callServer(){
    server.listen(8000, "127.0.0.1", ()=>{
        console.log("Server is running");
    });
}

