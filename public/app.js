
const GeoBtn = document.getElementById('geoBtn')

GeoBtn.addEventListener('click',()=>{
    console.log("clicked")
    if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(async (position)=>{
            const lat = position.coords.latitude
            const long = position.coords.longitude
            document.getElementById('lat').innerHTML = lat
            document.getElementById('long').innerHTML = long
            //weather api
            const api_url = `weatherEndPoint/${lat},${long}`
            const res = await fetch(api_url)
            const json_data = await res.json();
            // console.log(json_data.airQ)
            document.getElementById("summary").textContent = json_data.weather.weather[0].main
            document.getElementById("temp").textContent = json_data.weather.main.temp
            document.getElementById("name").textContent = json_data.weather.name
            document.getElementById("airQ").textContent = json_data.airQ.results[42].measurements[2].value + ", unit: " 
                                        + json_data.airQ.results[42].measurements[2].unit;
            
            
        })
    }else{
        console.log("geolocation error")
    }
})