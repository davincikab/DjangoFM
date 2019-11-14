$(function(){
// Get the data via asynchronous call
var rooms_data;
var use;
var utility;
var use_filter = $("#usefilter");
var blocks;

$.ajax({
  url:"http://127.0.0.1:8000/build/",
  data:'',
  type:'get',
  dataType:'json',
  success:function(res){
    let room_use = processData(res);
    createBlockFilter(blocks);
    roomUse(room_use['use'], res, "all");
  },
  error:function(error){

  }
});

$('#usefilter').on('change', function(e){
  filterRoomsByBlock($(this).val().toString());
  e.stopPropagation();
});

// Function responsible for extracting type of graphical analysis
function processData(res){
  rooms_data = res;
  uses = [... new Set(Object.values(res.features.map(k => k.properties.use)))];
  blocks = [...new Set(Object.values(res.features.map(k=>k.properties.block)))];

  return {'use':uses,
    'utilities':[... new Set(Object.keys(res.features[0].properties))],
    'blocks':blocks
  }

}

function createBlockFilter(blocks){
  use_filter.append($('<option></option>').text("all"));
  for (let block of blocks) {
    let option = $('<option></option>').text(block);
    use_filter.append(option);
  }

}

function roomUse(uses, data, block = "all"){
  var clean_data = [];
  if(block !== "all"){
    data_filter(data.features.filter(en => en.properties.block == block));
  }else{
    data_filter(data.features);
  }

 // let data = {};
  function data_filter(datum){
    for (let use of uses ){
      clean_data.push(datum.filter(dt =>dt.properties.use == use).length );
    }
  }

  plot([{name:"Count",data:clean_data}], 'column','utility', uses, "Room Use Building Data");
}

function filterRoomsByBlock(block_name){
  roomUse(uses, rooms_data, block_name);
}

function filterRepair(){
  // Plumbing, capenter, electrical works

}

// Ploting function
function plot(data_values, type, id, category, title){
  // Column plots
  areacolors = (function(){
      let colors= ['#d73027','#f46d43'];
      return colors
  }());

  let xAxis;
  let series;

  if (type != "line") {
    // Check plot type
    xAxis = [{
        categories: category,
        reversed: false,
        labels: {
            step: 1
        }
    }
    ];
    series = {
          label: {
              connectorAllowed: false,
          },
          stacking: 'normal',
          // color:['#d73027','#f46d43'],
      }
  }else{
    xAxis = [{
      crosshair:true,
    }
  ];

    series = {
          label: {
              connectorAllowed: false,
          },
          pointStart: 2015
      }
  }


    // Column plots
    Highcharts.chart(id, {
        chart: {
            backgroundColor:'#ffffff',
            type: type
        },
        title: {
            text: `${title} `
        },
        xAxis:xAxis,
        yAxis: {
            // min: 0,
            title: {
                text: null
            },labels: {
                formatter: function () {
                    return Math.abs(this.value) + '';
                }
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
         series: series
       },
        series:  data_values,
        responsive: {
          rules: [{
              condition: {
              maxWidth: 500
            },
            chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
        }
        }]
      }
    });
}

});
