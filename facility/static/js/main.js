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

// tile.addTo(map);

      //   Overlay elements
var boundary = L.geoJson([Boundary],{
  style:function(feature, layer){
    return{
      color:'black',
      width:1
    };
  }
}).addTo(map);

var sciencep = L.geoJson([sciencepark],{
  style:function(feature,layer){
    return{
      fillColor:'#ffffff10',
      color:'',
      fillOpacity:0.1
    };
  },
  onEachFeature:function(feature,layer){layer.on('click',zoomTo);
    layer.bindPopup("<h6>Name: "+feature.properties.names+"</h6>");
  }
}).addTo(map);

var coffee = L.geoJson([coffee],{
  style:function( feature,layer){
    return{
    color:'',fillOpacity:0.6,
    fillColor:"brown",
    Opacity:1
  };
  },
  onEachFeature:function(feature,layer){layer.on('click',zoomTo);
      layer.bindPopup("<h4>Name: "+ feature.properties.names+"</h4>");
  }
}).addTo(map);

function getRoadColor(feature){
  return feature.properties.Type ="Footpath"?'#FF0000':'#FF0000';
}

var roads = L.geoJson(null,{
  style:function(feature, layer){
    return{
      color:getRoadColor(feature),
      lineWidth:0.5,
      Opacity:0.6
    };
  }
}).addTo(map);

$.getJSON('/static/data/rds.geojson').done(function(data){roads.addData(data)});

var forest = L.geoJson([forest],{
  style:function(feature,layer){
    return{
      fillColor:'green',
      color:'',fillOpacity:0.6,fillOpacity:0.6,
      blur:3
    };
  },
  onEachFeature:function(feature,layer){layer.on('click',zoomTo);
    layer.bindPopup("<h6>Name: "+feature.properties.names+"</h6>");
    // layer.bindLabel(feature.properties.names.toString());

  }
}).addTo(map);


var building = L.geoJson(null,{
  style:function(feature,layer){
    return{
      fillColor:'black',
      fillOpacity:0.6,
      color:'#0000060',
      dashArray:0.2,
      linewidth:0
    };
  },
  onEachFeature:function(feature,layer){
    layer.bindPopup("<h6>"+feature.properties.names+"</h6><p>Use: "
    +feature.properties.use+"</p><p>Sockets:     "+feature.properties.sockets
    +"</p><p>Teaching Capacity:  "+feature.properties.capacity
    +"</p><p>Exam Capacity: "+feature.properties.capacity*2/3
    +"</p><p>Maintenace:    "+feature.properties.maintenace
    +"<img src='images/kims/rc123.jpg' class='pop-img' >"
    +'<br><a href="http://127.0.0.1:8000/building_update/'+feature.properties.pk +'/">Edit</a>');
  }
}).addTo(map);

$.getJSON("http://127.0.0.1:8000/build/").done(function(data){
  building.addData(data);
}).fail(function(error){alert(error)});

function zoomTo(e){
  console.log(e);

  let layer = e.target;
  map.setView(layer.getBounds().getCenter(),21);
}
var pitch = L.geoJson([football],{
  style:function(feature,layer){
    return{
      fillColor:'LawnGreen',
      color:'',fillOpacity:0.6,fillOpacity:0.6,fillOpacity:0.6
    };
  },
  onEachFeature:function(feature,layer){
    layer.on('click',function(e){
      console.log(e);
    });
    layer.bindPopup("<h6>Name: "+feature.properties.names+"</h6>");
  }
}).addTo(map);

var maizep = L.geoJson([maize],{
  style:function( feature,layer){
    return{
    fillColor:"green",
    color:"",
    fillOpacity:0.7
  };
  },
  onEachFeature:function(feature,layer){layer.on('click',zoomTo);
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

let dt;

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

$.getJSON("/static/data/sc_road.geojson").done(function(data){
  scp_road.addData(data);
}).fail(function(error){alert(e)});

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
}).addTo(map);

$.getJSON("http://127.0.0.1:8000/street/").done(function(data){
  street_light.addData(data);
  marker_cluster.addLayer(street_light);
}).fail(function(error){alert(error)});

var water_point = L.geoJson(null,{
  onEachFeature:function(feature, layer){
    layer.bindPopup('Id: '+feature.properties.id+'<br>Water Point<br> Water Status:  '+
          feature.properties.type+'<br><a href="http://127.0.0.1:8000/water_update/'+feature.properties.id +'/">Edit</a>');
  },
  pointToLayer:function(geoJsonPoint, latLng){
    return L.marker(latLng,{icon: L.AwesomeMarkers.icon({
      icon: 'tint',
      markerColor:'blue',
      prefix:'fa'
    })
  });
  }
}).addTo(map);

$.getJSON("/static/data/water_point.geojson").done(function(data){
  water_point.addData(data);
  marker_cluster.addLayers(water_point);

}).fail(function(error){alert(e)});

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
}).addTo(map);

$.getJSON("/static/data/stpts.geojson").done(function(data){
  sittng_points.addData(data);
}).fail(function(error){alert(e)});

map.fitBounds(boundary.getBounds());

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
  'Science Park':sciencep,
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
var layers = new L.LayerGroup([building,coffee,pitch,maizep,sciencep]);

var controlSearch = new L.Control.Search({
     position:'topleft',
     layer:layers,
     propertyName:'names',
     marker: false,

    moveToLocation: function(LatLng,title,map){
      var zoom = map.getBoundsZoom(LatLng.layer.getBounds());
      map.setView(LatLng,20);
    }
});

controlSearch.on('search:locationfound', function(e) {
  e.layer.setStyle({fillColor: '#3f0', color: '#000000'});
  e.layer.openPopup();

  if(e.layer.feature.properties.names == "Sciencepark"){
    document.getElementById('section_vid').innerHTML =  '<div id="carousel1" class="carousel slide" data-ride="carousel">'+
       	// '<!--Indicator  -->'+
   			'<ol class="carousel-indicators">'+
   				'<li data-target="#carousel1" data-slide-to="0" class="active">'+'</li>'+
   				'<li data-target="#carousel1" data-slide-to="1">'+'</li>'+
   				'<li data-target="#carousel1" data-slide-to="2">'+'</li>'+
   				'<li data-target="#carousel1" data-slide-to="3">'+'</li>'+
   			'</ol>'+

   			// '<!--Carousel carousel-item  -->'+
   			'<div class="carousel-inner" role="listbox">'+
   				'<div class="carousel-item active">'+
   					'<img src="images/master-plan.jpg" alt="usplash" />'+
   					'<div class="carousel-caption">'+
              '<h3>Master Plan</h3>'+
              '<p>Proposed Science Park block</p>'+
   		      '</div>'+
   				'</div>'+

   				'<div class="carousel-item">'+
   					'<img src="images/gallery-hotel-drawing.jpg" alt="ryan_wilson" />'+
            '<div class="carousel-caption">'+
              '<h3>Hotel </h3>'+
              '<p>Proposed Hotel</p>'+
   		      '</div>'+
   				'</div>'+

   				'<div class="carousel-item">'+
   					'<img src="images/gallery-agrotech-drawing.jpg" alt="luiz centenaro" />'+
            '<div class="carousel-caption">'+
              '<h3>Agrotech </h3>'+
              '<p>Proposed Agrotech Building</p>'+
   		      '</div>'+
   				'</div>'+

   				'<div class="carousel-item">'+
   					'<img src="images/gallery-agrotech-drawing.jpg" alt="john mark" />'+
            '<div class="carousel-caption">'+
   		        '<h3>Agrotech </h3>'+
   		        '<p>Proposed Agrotech Building</p>'+
   		      '</div>'+
   				'</div>'+
   			'</div>'+

   			'<a  class="carousel-control-prev" href="#carousel1" role="button" data-slide="prev" >'+
   				'<span class="carousel-control-prev-icon" aria-hidden="true">'+'</span>'+
   				'<span class="sr-only">Previous</span>'+
   			'</a>'+

   			'<a  class="carousel-control-next" href="#carousel1" role="button" data-slide="next" >'+
   				'<span class="carousel-control-next-icon" aria-hidden="true">'+'</span>'+
   				'<span class="sr-only">Next</span>'+
   			'</a>'+
       '</div>'+
     '</div>';

  document.getElementById('pic').innerHTML = '<h4>Proposed Sciencepark</h4><br>'+
  '<p>The park will be the first in Kenya and in East and CentraL Africa.In pursuit of transforming Kenya into a knowledge economy, the Ministry of Education, State Department of University Education is supporting the establishment of a Science and Technology Park at Dedan Kimathi University of Technology. The DeKUT STP is anchored on the Ministry of Education, Science and Technology’s vision, which is to promote science,technology and innovation and quality higher education for prosperity and global competitiveness</p>';

}
}).on('search:collapsed', function(e) {
    building.eachLayer(function(layer) {
        layer.resetStyle();
    });

});

map.addControl( controlSearch );

$.getJSON("/static/data/gfloor.geojson").done(function(geoJSON) {

    var indoorLayer = new L.Indoor(geoJSON, {
        getLevel: function(feature) {
            return feature.properties.level
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(JSON.stringify(feature.properties));
        },
        style: function(feature) {
            var fill = 'white';

            if (feature.properties.Room  === 'Corridor') {
              fill = '#169EC6';
            } else if (feature.properties.Room === 'OFFICE') {
              fill = '#0A485B';
            }

            return {
            fillColor: fill,
            weight: 1,
            color: '#666',
            fillOpacity: 1
            };
        }
});

indoorLayer.setLevel("0");
// map.addLayer(indoorLayer);

var levelControl = new L.Control.Level({
    level: "0",
    levels: indoorLayer.getLevels()
});

// Connect the level control to the indoor layer
levelControl.addEventListener("levelchange", indoorLayer.setLevel, indoorLayer);
levelControl.addTo(map);
});

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

var startmarker = L.marker([-0.39746, 36.96484], {
  draggable:true,
  icon:L.AwesomeMarkers.icon({
    markerColor:'green',
    prefix:'fa'
  })
}).on('dragend', function(e){
  selectedPoint = e.target.getLatLng();
  getVertex(selectedPoint);
  getRoute();
}).addTo(map);

var endmarker = L.marker([-0.40445808,36.96536293],{
  draggable:true,
  icon:L.AwesomeMarkers.icon({
    markerColor:'green',
    prefix:'fa'
  })
}).on('dragend', function(e){
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


}).addTo(map);


L.easyButton('<strong>A</strong>',function(){
  // Create a collapsible analysis
  let ui = $('#ui');
  let control = $('.control');
  let analysis = document.getElementById('analysis');

  if (analysis.style.display == 'none') {
    control.hide();
    $('#analysis').css('display','block');
  }
  else{
    control.show();
    $('#analysis').css('display','none');
  }

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
        //   L.geoJson(data,{
        //     pointToLayer:function(latlng){
        //     return L.circleMarker([latlng],{radius:4,color:'green'}).addTo(map);
        //   }
        // });
        console.log(data);
      },
      error:function(xhr,errmsg,err){
        console.log(xhr.status+': '+xhr.response);
      }
    });
});
