const baseUrl = "https://automobile-security-system-bac.herokuapp.com"
$(document).ready(async function() {
  var map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      })
    ],
    target: 'map',
    view: new ol.View({
      center: ol.proj.fromLonLat([15, 50]),
      zoom: 2,
    })
  });

  try {
    var intervalID = window.setInterval(run, 3000);

  } catch (error) {
    console.log("error fetching from your server", error)
  }

  async function run() {
    const data = await getCords()
    CenterMap(data.long, data.lat)
    setMarker(data.long, data.lat)
    if (data.image) {
      updateImage(data.image)
    }
  }



  function updateImage(imageSrc) {
    const thiefImage = document.getElementById("thiefImage");
    thiefImage.src = imageSrc;
    document.getElementById("img-caption").innerHTML = `Warning &#10071; &#10071; <br>
    There is an unknown person in your car &#10071; `


  }

  function CenterMap(long, lat) {
    console.log("Long: " + long + " Lat: " + lat);
    map.getView().setCenter(ol.proj.fromLonLat([long, lat]));

  }

  var markers;

  function setMarker(long, lat) {
    map.removeLayer(markers)
    markers = new ol.layer.Vector({
      source: new ol.source.Vector(),
      style: new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src: './images/marker.ico'
        })
      })
    });
    map.addLayer(markers);

    var marker = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([data.long, data.lat])));
    markers.getSource().addFeature(marker);

  }

  async function getCords() {
    const res = await fetch(`${baseUrl}/pull`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        id: 1
      })
    })
    data = await res.json();
    return data;
  }
});
