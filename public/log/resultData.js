const backBtn = document.querySelector(".btnCheck")
const setMap = async ()=>{
    var map = L.map('map').setView([0,0],1);
    const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl,{attribution})    
    tiles.addTo(map)
    
    const getData = async ()=>{
        const api_url = `/api`
        const res = await fetch(api_url)
        const dataList = await res.json()
        for (data of dataList){
            console.log(data)
            var marker = L.marker([data.latitude, data.longitude]).addTo(map)
            //
            const text = `<div> <div> City: ${data.name} </div> 
                            <div> Summary: ${data.summary} </div> 
                            <div> Temperature: ${data.temperature} </div> 
                            <div>Air quality: ${data.aq_value} </div> </div>
                            <div>Air quality/unit: ${data.aq_unit} </div> </div>`
            
            marker.bindPopup(text)
        }
    }
    await getData()
}
setMap();

backBtn.addEventListener('click',()=>{
    window.location.href = "../index.html"
})