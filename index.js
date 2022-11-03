const fetch = require('node-fetch')
const express = require('express')
const fs = require('fs')
const db = require('nedb')
const appServer = express()
const database = new db('./data.db');
require('dotenv').config()
    
appServer.listen(3000,(err)=>{
    if(err){
        console.log("something went wrong !!!")
    }
    console.log("server listen on port 3000")
})
appServer.use(express.static("public"))
appServer.use(express.json({limit:'1mb'}))
database.loadDatabase(function (err) {   
    console.log(err)
});

appServer.get('/weatherEndPoint/:latlong',async(request,response)=>{
    // console.log(request.params)
    const latlong = request.params.latlong.split(',')
    const api_key = process.env.API_KEY
    const lat = latlong[0]
    const long = latlong[1]
    //API : openweathermap
    const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api_key}  `
    const weather_res = await fetch(weather_url)
    const weather_data = await weather_res.json()

    //API : openaq
    const aq_url = `https://api.openaq.org/v1/latest?coordonates=${lat},${long}`;
    const aq_res = await fetch(aq_url)
    const aq_data = await aq_res.json()

    const data = {weather:weather_data,airQ:aq_data}
    
    //SAVE DATA IN DB
    const savedDate = {
        latitude:lat,
        longitude:long,
        name : weather_data.name,
        temperature : weather_data.main.temp,
        summary : weather_data.weather[0].main,
        aq_value : aq_data.results[42].measurements[2].value,
        aq_unit : aq_data.results[42].measurements[2].unit
    }
    
    response.json(savedDate)
    database.insert(savedDate)
    
    // console.log("data saved")
})

// for data representation check resultData.js 
appServer.get('/api/',async(req,res)=>{
    database.find({},(err, data)=>{
        if(err){
            console.log("data error!")
            res.end()
            return
        }
        res.json(data)
    })
})