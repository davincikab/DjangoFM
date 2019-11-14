$(function (){
var section_vid = $('#section_vid').html();
var section_pic = $('#section_pic').text();
  // Map element
var map = L.map('map',{
  center:[0.2,36.5],
  zoom:9,
  maxZoom:28
});

    //         MAPBOX TILE LAYERS
var mapAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
   '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

var mapUrl ='https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
 var tile = L.tileLayer(mapUrl,{id:'mapbox.streets',attribution:mapAttr}),
      street = L.tileLayer(mapUrl,{id:'mapbox.light',attribution:mapAttr});

 // var osmb = new OSMBuildings(map).load('https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json');
 // tile.addTo(map);

      //   Overlay elements
var boundary = L.geoJson([Boundary],{
  style:function(feature, layer){
    return{
      color:'black',
      width:1,
      dashArray:1,
    };
  }
}).addTo(map);

var coffee = L.geoJson(null,{
  style:function( feature,layer){
    return{
    color:'',fillOpacity:0.6,
    fillColor:"#efa910",
    Opacity:1
  };
  },
  onEachFeature:function(feature,layer){
      layer.on('click',zoomTo);
      layer.bindPopup("<h4>Name: "+ feature.properties.names+"</h4>");
  }
}).addTo(map);

function getRoadColor(feature){
  // console.log(feature.properties.type == 'FootPath');
  return (feature.properties.type != "FootPath")?'red':'brown';
}

var roads = L.geoJson(null,{
  style:function(feature){
    return{
      color:getRoadColor(feature),
      lineWidth:0.5,
      Opacity:0.6
    }
  }
}).addTo(map);

var forest = L.geoJson(null,{
  style:function(feature,layer){
    return{
      fillColor:'green',
      color:'',fillOpacity:0.6,fillOpacity:0.6,
      blur:3
    };
  },
  onEachFeature:function(feature,layer){
    // layer.on('click',zoomTo);
    layer.bindPopup("<h6>Name: "+feature.properties.names+"</h6>");
    // layer.bindLabel(feature.properties.names.toString());

  }
}).addTo(map);

function buildFeature(feature,layer){
  // console.log(feature.properties.use);
  layer.bindPopup("<h6>"+feature.properties.name+"</h6><p>Use: "
  +feature.properties.use+"</p><p>Sockets:     "+feature.properties.sockets
  +"</p><p>Teaching Capacity:  "+feature.properties.capacity
  +"</p><p>Exam Capacity: "+Math.floor(feature.properties.capacity*2/3)
  +"</p><p>Maintenace:    "+feature.properties.maintenace
  +'<br><a href="http://127.0.0.1:8000/building_update/'+feature.properties.name +'/">Edit</a>');
}

function styleRoom(use){
  // ['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f','#e5c494','#b3b3b3']
  return use == 'Lecture Hall'?'#66c2a5': use == 'Office'?'#fc8d62': use == 'Laboratory'?'#8da0cb':use == 'Staff Quarters'?'#e78ac3':use == 'Corridor'?'#ffffff':use == 'Toilet'?'#ffd92f':use == 'Stair Way'?'#e5c494':'#b3b3b3';
}

function buildStyle(feature){
  return{
    fillColor:styleRoom(feature.properties.use),
    fillOpacity:0.6,
    color:'#000000',
    dashArray:0.2,
    linewidth:0,
    weight:0.5
  };
}

var building = L.geoJson(null,{
  style:function (feature){
    return{
      fillColor:styleRoom(feature.properties.use),
      fillOpacity:0.0,
      color:'#000000',
      dashArray:0.2,
      linewidth:0,
      weight:0.0
    }},
  onEachFeature:buildFeature,

}).addTo(map);

function zoomTo(e){
  console.log(e);

  let layer = e.target;
  map.setView(layer.getBounds().getCenter(),21);
}

/* =============================== Working with Indoor Layers ==========================*/
var indoorLayer;
var levelControl;
// Working with closures
var style_building;

$.getJSON("http://127.0.0.1:8000/build/").done(function(data){
    update_building(data);
}).fail(function(error){
  alert("Building Data Not Loaded");
});

// ================================= Building ==============================
// Update building content using related field data
function update_building(data_build){
  let data = data_build;
  $.get("http://127.0.0.1:8000/related_data/").done(function(res){
      add_related(eval(res));
  }).fail(function(error){
    alert("Related Data Not Loaded");
});

  function add_related(data_related){
    for (let i in data.features){
      let name = data.features[i].properties.pk;
        data.features[i].properties['related'] = eval(data_related.find(k => k.name == name).related);
    }
    building.addData(data);

    indoorLayer = new L.Indoor(data, {
            getLevel: function(feature) {
                return feature.properties.level
            },
            onEachFeature:function(feature,layer){
              layer.bindPopup("<p>Name: "+feature.properties.pk +"</p><p>"+feature.properties.block+"</p>");
              layer.on("mouseover", function(e){
                layer.setStyle({fillColor:'yellow'});
                console.log(e.layer.openPopup());
              });
            },
            style:buildStyle,
          });

    indoorLayer.setLevel("0");
    indoorLayer.addTo(map);

    levelControl = new L.Control.Level({
        level: "0",
        levels: indoorLayer.getLevels()
    });

    // Connect the level control to the indoor layer
    levelControl.addEventListener("levelchange", indoorLayer.setLevel, indoorLayer);
    levelControl.addTo(map);
  }

}

function getFillColor(related){
  // Extract day and time
  // Check the difference to current time in hours,
  // assign a color: red, orange, green,
  // append the a popup on the current use
    let day = new Date().toDateString().split(' ')[0];
    let hour = new Date().getHours();
    let today_lectures = related.filter(k => k.fields.day_allocated.startsWith(day));
    let current_lecture = today_lectures.filter(k => k.fields.time_allocated.slice(0,2) < hour);

    // && k.fields.time_allocated.slice(0,2)+5 >= hour
    // console.log(current_lecture);

    if(current_lecture.length >= 1){
      return 'red';
    }else{
        return 'green';
    }

}

var dynamic_use;
function realTimeUse(){
  dynamic_use = setInterval(updateStyle,1000);

    function updateStyle(data){
      // Work with indoorLayer
      indoorLayer.eachLayer(layer =>{
        layer.eachLayer(lay =>{
          let fill;
          if(lay.feature.properties.related.length != 0){
              fill = getFillColor(lay.feature.properties.related);
          }else if (lay.feature.properties.use == "Corridor") {
            fill = "ghostwhite";
          }else{
            fill = 'grey';
          }
            lay.setStyle({fillColor:fill,fillOpacity:1,color:'#000000',weight:1});
        });
      });
      }
  // console.log(building.toGeoJSON());
}

function staticUse(){
  // dynamic_use = dynamic_use;
  if(typeof dynamic_use == "number"){
    clearInterval(dynamic_use);
  }
  //  call to buildStyle
  indoorLayer.eachLayer(layer => {
    layer.eachLayer(lay => {
      let style = buildStyle(lay.feature);
        lay.setStyle(style);
    });
  });

  console.log("buildStyle");
}

function updateUseStyle(use){
  if (use == 'Real time use') {
    realTimeUse(); // call to real time use
  }else{
    clearInterval(dynamic_use);
    staticUse();   // call to static use
  }
}

const use_control = L.control({position:'topright'});
use_control.onAdd = function(map){
  let div = L.DomUtil.create('select', 'use_option');
  let use_label = ['Physical Space use', 'Real time use'];

  L.DomEvent.addListener(div,'click', e =>{
     L.DomEvent.stopPropagation(e);
  });

  for (let use of use_label) {
    let option = L.DomUtil.create('option','use-option');
    option.text = use;
    div.append(option)
  }

  // Event listener if toggle change in use
  $(div).on('change', function(e){
     updateUseStyle($(this).val().toString());
  });

  return div;
}

map.addControl(use_control);
// ============================================ END OF BUILDING =======================================
// ============================================ ROUTING CONTROL =======================================
function findRoute(data){
  let coord = [];
  for (let datum of data) {
    building.eachLayer(layer => {
      if(layer.feature.properties.pk == datum.value){
        console.log(layer);
        coord.push(layer.getBounds().getCenter());
      }
    });
  }

  startmarker.setLatLng(coord[0]);
  endmarker.setLatLng(coord[1]);
}

function places(){
    let building;
    building.eachLayer(layer=>{
      building.push({'label':layer.feature.properties.gid,'value':layer.feature.properties.names});
    })
    return building;
}

// var routing_control = L.easyButton();
var routing_control = L.control({position:'topleft'});

routing_control.onAdd = function(map){
  let div = L.DomUtil.create('div','route-container');
  let form = L.DomUtil.create('form','form-horizontal,route-form');
  let button = L.DomUtil.create('button','btn, form-control');

  button.innerHTML+='R';
  div.append(button);

  let fields = ['from', 'to'];

  for (let field of fields) {
      form.innerHTML += `<label>${field}</label>`;
      let input_name = L.DomUtil.create('input','form-control');
      $(input_name).attr(
        {'id':`${field}`,
        'name':`${field}`
      });
      form.append(input_name);
  }
  form.innerHTML+= '<input type="submit" class="btn btn-sm btn-sucess" >';
  div.append(form);

  $(div).on('mouseover', function(e){
    $(this).css({"height":"auto","width":"auto"}).find("button").hide();
    $(form).css({"display":"block"});
    e.stopPropagation(e);
  });

  $(div).on('mouseout', function(e){
    $(this).css({"height":"35px","width":"35px"}).find("button").show();
    $(form).css({"display":"none"});
    e.stopPropagation(e);
  });

  $(form).on('submit', function (e){
    e.preventDefault();
    findRoute($(this).serializeArray());
  });

  return div;
}

map.addControl(routing_control);
var pitch = L.geoJson(null,{
  style:function(feature,layer){
    return{
      fillColor:'LawnGreen',
      color:'',fillOpacity:0.6,fillOpacity:0.6,fillOpacity:0.6
    };
  },
  onEachFeature:function(feature,layer){
    layer.bindPopup("<h6>Name:</h6>");

    layer.on('click',function(e){
      layer.openPopup();
    });

  }
}).addTo(map);

var maizep = L.geoJson(null,{
  style:function( feature,layer){
    return{
    fillColor:"green",
    color:"",
    fillOpacity:0.7
  }
  },
  onEachFeature:function(feature,layer){
      layer.bindPopup("<h4>Name:"+ feature.properties.names+"</h4>");
  }
}).addTo(map);

var scp_block = L.geoJson(null,{
  onEachFeature:function(feature, layer){
    layer.bindPopup("<h4>Block Name:  "+feature.properties.name.toString()+ "</h4><p> Use: "
    +feature.properties.use.toString() +'</p><p>Area Allocated:  '+feature.properties.area_ha.toString() +'ha</p>');
  },
  style:function(feature){
    return{
      fillColor:feature.properties.color,
      color:'#000000',
      fillOpacity:0.6,
      lineWidth:0.3
    }
  }
}).addTo(map);

// map.on('click', function(e){ console.log(e.latlng);})
let dt;
//
$.getJSON("/static/data/scp_blocks.geojson").done(function(data){
  scp_block.addData(data);
  dt = Array.from(new Set(data.features.map(k=> k.properties.use))).map(
      id=>{
        return {use:id, color:data.features.find(k=> k.properties.use  === id).properties.color}
      });
    // Legend for various uses

    var scp_use_control = L.control({position:'bottomleft'});

    scp_use_control.onAdd = function(map){
      var div = L.DomUtil.create('div', 'legend');
      let button = L.DomUtil.create('button','btn collapsible');
      button.innerHTML='Proposed Block Use';

      let content = L.DomUtil.create('div','content');
      div.appendChild(button);
      // div.innerHTML += '<p>Proposed Block Use</p>';
      let properties_control =  [... new Set(scp_block.toGeoJSON().features.map(k=> k.properties.use))]
      var label = [];

      for (let tp of dt) {
        content.innerHTML+='<i style="background:'
            +tp.color+ '">&nbsp;&nbsp;</i>&nbsp;&nbsp; '
            +tp.use+'<br>';

      }

      div.appendChild(content);

      button.addEventListener('click', function(e){
        e.stopPropagation();
        button.classList.toggle('active');

    		if(content.style.maxHeight){
    					content.style.maxHeight = null;
    			}else{
    				content.style.maxHeight = content.scrollHeight+"px";
    			}
      });

      return div;
    }

    map.addControl(scp_use_control);

}).fail(function(e){alert(e)})

var scp_road = L.geoJson(null,{
  onEachFeature:function(feature, layer){
    layer.bindPopup('Road');
  },
  style:function(feature){
    return{
      color:'red',
      fillOpacity:0.6,
      lineJoin:'round'
    }
  }
}).addTo(map);

var redMarker = L.AwesomeMarkers.icon({
  icon: 'bolt',
  markerColor:'yellow',
  prefix:'fa'
});
// Marker Cluster
let marker_cluster = L.markerClusterGroup().addTo(map);

var street_light = L.geoJson(null,{
  onEachFeature:function(feature, layer){
    layer.bindPopup('Street Light','<br>Description: '+feature.properties.type);
  },
  pointToLayer: function(geoJsonPoint, latlng){
    return L.marker(latlng,{icon:redMarker});
  }
});


var water_point = L.geoJson(null,{
  onEachFeature:function(feature, layer){
    layer.bindPopup('Id: '+feature.properties.id+'<br>Water Point<br> Water Status:  '+
          feature.properties.type+'<br><a href="http://127.0.0.1:8000/water_update/'+feature.properties.id +'/">Edit</a>');
  },
  pointToLayer:function(geoJsonPoint, latLng){
    return L.marker(latLng,{icon: L.AwesomeMarkers.icon({
      icon: '',
      markerColor:'blue',
      prefix:'fa'
    })
  });
  }
});

var sittng_points = L.geoJson(null,{
  onEachFeature:function(feature, layer){
    layer.bindPopup('Field Seat'+'<br>Capacity:  '+feature.properties.capacity);
  },
  pointToLayer:function(geoJsonPoint, latLng){
    return L.marker(latLng,{icon: L.AwesomeMarkers.icon({
      icon:'star',
      markerColor:'purple',
      prefix:'fa'
    })
  });
  }
});

// $.getJSON("/static/data/stpts.geojson").done(function(data){
//   sittng_points.addData(data);
// }).fail(function(error){alert(e)});

map.fitBounds(boundary.getBounds());

$.getJSON('http://127.0.0.1:8000/data/')
.done(function(data){

  roads.addData(JSON.parse(data.road));
  scp_block.addData(JSON.parse(data.scp_blocks));
  scp_road.addData(JSON.parse(data.scp_road));
  street_light.addData(JSON.parse(data['street']));
  water_point.addData(JSON.parse(data['water_point']));
  sittng_points.addData(JSON.parse(data['seats']));
  forest.addData(JSON.parse(data['forest_cover']));
  coffee.addData(JSON.parse(data['coffee']));
  pitch.addData(JSON.parse(data['play']));

  marker_cluster.addLayers(water_point);
  marker_cluster.addLayer(street_light);
  marker_cluster.addLayer(sittng_points);

}).fail(function(errorxhr, errmsg){
  console.log(errmsg+" Failed to load the data");
});
    // BASEMAPAS objects
var baselayer ={
 'Street Map':tile,
 'Grayscale':street,
};

    //  MAP OVERLAYS object
var overlays={
  'Conservancy':forest,
  'Coffee Plantation':coffee,
  'Playing Field':pitch,
  'Building':building,
  'Roads':roads,
  'Sciencepark Blocks':scp_block,
  'Sciencepark Road':scp_road
};

    //    ADD OVERLAYS AND BASEMAPA=S TO THE MAP
L.control.layers(baselayer,overlays).addTo(map);

let geolocate = L.control({position:'topleft'});
geolocate.onAdd = function(map){
 let div = L.DomUtil.create('button','btn btn-success geolocate');
 div.innerHTML = 'G';
 div.addEventListener('click', function(e){
   e.stopPropagation;
   map.on('locationfound',foundLocation);
  	map.on('locationerror',NotfoundLocation);
  	map.locate({setView:true,zoom:10});

 	function foundLocation(e){
 		var date = new Date(e.timestamp);

 		L.marker(e.latlng).addTo(map).bindPopup('Your Location is: <br> '+e.latlng + date.toString()).openPopup();
 	}

   function NotfoundLocation(e){
   	 alert("Enable location in your gadget");
   	}
 });

 return div
}

// geolocate.addTo(map);
L.easyButton('<img src="http://127.0.0.1:8000/static/images/locate.png" height="25px" width=25>',function(){
  map.on('locationfound',foundLocation);
   map.on('locationerror',NotfoundLocation);
   map.locate({setView:true,zoom:10});

 function foundLocation(e){
   var date = new Date(e.timestamp);

   L.marker(e.latlng).addTo(map).bindPopup('Your Location is: <br> '+e.latlng + date.toString()).openPopup();
 }

  function NotfoundLocation(e){
    alert("Enable location in your gadget");
   }
}).addTo(map);
// SEARCH ELEMENT USING LEAFLET-SEARCH
var layers = new L.LayerGroup([building]);

var controlSearch = new L.Control.Search({
     position:'topleft',
     layer:layers,
     propertyName:'pk',
     marker: false,

    moveToLocation: function(LatLng,title,map){
      var zoom = map.getBoundsZoom(LatLng.layer.getBounds());
      map.setView(LatLng,20);
    }
});

controlSearch.on('search:locationfound', function(e) {
  e.layer.setStyle({fillColor: 'red', color: 'purple', fillOpacity:1});

  // A call to indoor layer to change the building level and level control
  indoorLayer.setLevel(e.layer.feature.properties.level);
  levelControl.options.level = e.layer.feature.properties.level.toString();
  e.layer.openPopup();

  if(e.layer){
    let layer = e.layer;

    let description_string = "<p><strong>"+ layer.feature.properties.name+"</strong> is located at <strong>"
    +layer.feature.properties.block+"</strong>.Currently the room is "+layer.feature.properties.name
    +" and can serve a lecture for "+ layer.feature.properties.capacity+" students</p>";

    document.getElementById('section_vid').innerHTML =  "<img src='/media/"+ layer.feature.properties.image+"' class='pop-img' >"
    document.getElementById('pic').innerHTML = description_string;
}
}).on('search:collapsed', function(e) {

  building.eachLayer(layer => building.resetStyle(layer));

  document.getElementById('section_vid').innerHTML = section_vid;
  document.getElementById('pic').innerHTML = section_pic;
  // indoorLayer.setLevel('0');
});

map.addControl( controlSearch );
// Dealing with layer visibility on zoom
var currentZoom;

map.on('zoomend', function () {
    currentZoom = map.getZoom();
    if (currentZoom < 17) {
      map.removeLayer(building);
      map.removeLayer(scp_road);
      map.removeLayer(scp_block);
    }
    else {
      building.addTo(map);
      map.addLayer(scp_road);
      map.addLayer(scp_block);
    }
});

function layer_visibility(){
  currentZoom = map.getZoom();
  if(currentZoom < 15){
    map.removeLayer(building);
    map.removeLayer(scp_road);
    map.removeLayer(scp_block);
  }
}

layer_visibility();
// Routing
// var router = L.Routing.control({
//   waypoints:[
//        L.latLng(-0.39333481585309227,36.96599006652832),
//        L.latLng(-0.39985779190345594, 36.9565486907959)
//   ],
//     routeWhileDragging:true,
//     geocoder: L.Control.Geocoder.nominatim(),
//     showAlternatives:true,
//     altLineOptions:true,
//     router: L.Routing.mapbox('pk.eyJ1IjoiZGF1ZGk5NyIsImEiOiJjanJtY3B1bjYwZ3F2NGFvOXZ1a29iMmp6In0.9ZdvuGInodgDk7cv-KlujA')
//  });
//
//  map.addControl(router);
//
//  L.Routing.errorControl(router).addTo(map);
var selectedPoint,source,target;
var startmarker = L.marker([-0.3986940286699416, 36.96141992555946], {
  draggable:true,
  icon:L.AwesomeMarkers.icon({
    markerColor:'green',
    prefix:'fa'
  })
}).on('dragend', function(e){
  selectedPoint = e.target.getLatLng();
  getVertex(selectedPoint);
  getRoute();
}).on('move',function(e){
  selectedPoint = e.target.getLatLng();
  getVertex(selectedPoint);
  getRoute();
}).addTo(map);

var endmarker = L.marker([-0.3921448087740955,36.95807436383337],{
  draggable:true,
  icon:L.AwesomeMarkers.icon({
    markerColor:'green',
    prefix:'fa'
  })
}).on('dragend', function(e){
  selectedPoint = e.target.getLatLng();
  getVertex(selectedPoint);
  getRoute();
}).on('move',function(e){
  selectedPoint = e.target.getLatLng();
  getVertex(selectedPoint);
  getRoute();
}).addTo(map);

var routeLayer = L.geoJson(null).addTo(map);
var townLayer = L.geoJson(null).addTo(map);
var style = {
    color:'green',
    opacity:1,
};

function getVertex(selectedPoint){
  var url = `http://localhost:8090/geoserver/kimathi/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=kimathi:shortest_path&EPSG:4326&outputformat=application/json&viewparams=x:${selectedPoint.lng};y:${selectedPoint.lat};`;

  $.ajax({
    type:'GET',
    url:url,
    dataType:'json',
    async:false,
    success: function(data){
      loadVertex(data, selectedPoint.toString() == startmarker.getLatLng().toString());
    },
    fail:function(error){
      console.log(error);
    }
  });
}

function loadVertex(response, isSource){
  var features = response.features;
  map.removeLayer(routeLayer);

  if(isSource){
    source = features[0].properties.id;
  }
  else {
    target = features[0].properties.id;
  }
}


function getRoute(){

  var route_url = `http://localhost:8090/geoserver/kimathi/wfs?service=WFS&version=1.1.0&request=GetFeature&typeNames=kimathi:dijkstra_path&styles=&bbox=-180.0,-90.0,180.0,90.0&width=768&height=384&srs=EPSG:4326&outputformat=application/json&viewparams=source:${source};target:${target}`
  $.getJSON(route_url)
    .done(function(data){
      if(data.features.length > 0){
        map.removeLayer(routeLayer);
        routeLayer = L.geoJson(data,{style:style}).addTo(map);
        console.log(routeLayer.toGeoJSON());
        map.fitBounds(routeLayer.getBounds());

        // Extract distances from the linestring and provide turn direction
        // turn right, left, go up,
      }else{
        alert('No route found.Try adjusting the marker \n closer to the road level');
      }
    }).fail(function(error){
      console.log(error);
    });
}

getVertex(startmarker.getLatLng());
getVertex(endmarker.getLatLng());
getRoute();

// PGROUTING
// TODO: MAKE IT COLLAPSIBLE, CONNECT TO GEOLOCATION
// TODO: ADD PGROUTING; Add output distances and address for the roads. combine the corridor with the roads
// IMPLEMENT A GOTO TAB: [36.958045890333295, -0.391424338661615] specify the NESW in metres
//
L.easyButton('<strong>S</strong>',function(){
  // Give a story on location of various a facilities in the University
  // Provide a story in terms of Departure to Destination
  // Find area Bounds: Divide the university into sections
  $('#exampleModalLive').modal('show');

}).addTo(map);


L.easyButton('<strong>A</strong>',function(){
  // Create a collapsible analysis
    $('#exampleModalLive').modal('show');

}).addTo(map);


$('#form').on('submit', function(e){
  e.preventDefault();

  let form = $(this);
  // form.serialize(),
  $.ajax({
			url:form.attr("action"),
			data:form.serialize(),
			type: form.attr("method"),
			dataType:'json',
			success:function(data){
        // add the layer as a point cirles
        console.log(data);
          L.geoJson(data,{
            pointToLayer:function(geofeat, latlng){
            return L.circleMarker(latlng,{radius:8,color:'red',fillColor:'red'})
          }
        }).addTo(map);

      },
      error:function(xhr,errmsg,err){
        console.log(xhr.status+': '+xhr.response);
      }
    });
});

$('#form').on('submit', function(e){
  e.preventDefault();

  let form = $(this);
  // form.serialize(),
  $.ajax({
			url:form.attr("action"),
			data:form.serialize(),
			type: form.attr("method"),
			dataType:'json',
			success:function(data){
        // add the layer as a point cirles
        console.log(data);
          L.geoJson(data,{
            pointToLayer:function(geofeat, latlng){
            return L.circleMarker(latlng,{radius:8,color:'red',fillColor:'red'})
          }
        }).addTo(map);

      },
      error:function(xhr,errmsg,err){
        console.log(xhr.status+': '+xhr.response);
      }
    });
});


});

// TODO: search activates routing,
// Routing panel: from and to: (Try indoor routing using turf and aninate the marker to);
// Restyle the indoor layer instead of building layer;
// Update popup if view is real time view
// Add a filter control for maintenace: electrical work, plumbing, capentry
// User initiated routing: collapsible panel, on submit route
// Day filter
