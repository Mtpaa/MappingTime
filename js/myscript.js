//global variables
var timeline;
var example_data_for_map;
var popupText;
////////////////////////////////////
//         Leaflet_Map           //
//////////////////////////////////

// Create Layer of a slippy map with some options
var ownlayer = L.tileLayer('http://{s}.tiles.mapbox.com/v3/github.map-xgq2svrz/{z}/{x}/{y}.png',{
  continuousWorld: 'false',
});

//Create a Map conect to <div-element>Css and  with some options
var map = new L.map ('map', {
 center:[60.39453125, 40.267804],
  zoom: 2,
  attribution: true,
 layers:[ownlayer],
});


var SW = map.getBounds().getSouthWest();
var NE = map.getBounds().getNorthEast();

var bounds = new L.LatLngBounds (SW, NE);

map.setMaxBounds(bounds); //ruckle Bug?

var sidebar = L.control.sidebar('sidebar',{
  position: 'left'
});
map.addControl(sidebar);

///////////////////////////////////////////////////////
// Construktorfunction Point, LineString, Polygon   //
//////////////////////////////////////////////////////

    //new Point
    function Point(name_point, description_point, start_point, end_point, type_point, x_point, y_point){//(here)
      var that = this;
      that.name_point = name_point;
      that.description_point = description_point; //Here()
      that.start_point = start_point;
      that.end_point = end_point;
      that.type_point = type_point;
      that.x_point = x_point;
      that.y_point = y_point;

      //that.point_feature = function(){
      return '{"type":'+'"Feature","properties":{"name":"'+name_point+'",'+'"description":'+'"'+description_point+'"'+','+'"start":'+'"'+start_point+'"'+','+'"end":'+'"'+end_point+'"'+"},"+'"geometry"'+':{"type":"'+type_point +'",'+'"coordinates":['+x_point+","+y_point+']}},'
     //}                                                                        //Here
   };          // +'"description":'+'"'+description_point+'"'+

    //new LineString
    function Line(name_line, description_line, start_line, end_line, type_line, theLineCoords){//here
     var that = this;
     that.name_line = name_line;
     that.description_line = description_line;
     that.start_line = start_line;
     that.end_line = end_line;
     that.type_line = type_line;
     that.theLineCoords = theLineCoords;

     return '{"type":'+'"Feature","properties":{"name":"'+name_line+'",'+'"description":'+'"'+description_line+'"'+','  +'"start":'+'"'+start_line+'"'+","+'"end":'+'"'+end_line+'"'+"},"+'"geometry"'+':{"type":"'+type_line +'",'+'"coordinates":['+theLineCoords+']}},'
   };

    //new Polygon
    function Polygon(name_polygon,description_polygon, start_polygon, end_polygon, type_polygon, coord_poly_string) {//here
      var that = this;
      that.name_polygon = name_polygon;
      that.description_polygon =  description_polygon;
      that.start_polygon = start_polygon;
      that.end_polygon = end_polygon;
      that.type_polygon = type_polygon;
      that.coord_poly_string = coord_poly_string;

      return '{"type":'+'"Feature","properties":{"name":"'+name_polygon+'",' +'"description":'+'"'+description_polygon+'"'+','          +'"start":'+'"'+start_polygon+'"'+","+'"end":'+'"'+end_polygon+'"'+"},"+'"geometry"'+':{"type":"'+type_polygon +'",'+'"coordinates":'+coord_poly_string+'}},'
    }; /// END Class Polygon
//end Class-Defintions




function dataForTimeline(data, map){
  //console.log(data);
  var point_Array = [];
  var line_Array = [];
  var polygon_Array = [];
  var count = 0

          ///////////////////////////////
          //  read out GeoJSON-Loop   //
          /////////////////////////////

  for(var i = 0; i <data.features.length; i++){
    //count++;


    //Loop here if it is Polygon
    if(data.features[i].geometry.type ==="Polygon"){

      var name_polygon = data.features[i].properties.TITLE;
      var description_polygon = data.features[i].properties.DESCRIPTION; //Here
      var type_polygon = data.features[i].geometry.type;


    //extract Time(Date)
   var start_polygon = data.features[i].properties.SYEAR+"-"+data.features[i].properties.SMONTH+"-"+data.features[i].properties.SDAY

    var end_polygon = data.features[i].properties.EYEAR +"-"+data.features[i].properties.EMONTH+"-"+data.features[i].properties.EDAY

    start_polygon = new Date(start_polygon);
    end_polygon = new Date (end_polygon);

   //Coordinates
    var coord_poly = data.features[i].geometry.coordinates;

    coord_poly = coord_poly.toString();
    coord_poly = coord_poly.split(",");



     var x_poly_coord_A =[];
     var y_poly_coord_A = [];
     var coord_poly_Array = [];
     var coord_poly_string = "";

      //Array full of Y-Koords
      for (m = 1; m<coord_poly.length; m+=2){
        y_poly_coord_A.push(coord_poly[m]);
      };

      //Array full of X-Coords
      for (n = 0; n<coord_poly.length; n+=2){
        x_poly_coord_A.push(coord_poly[n]);
      };


    var coord_poly_pair = [];

      for (var j=0; j<x_poly_coord_A.length; j++){
        coord_poly_pair.push([x_poly_coord_A[j],[y_poly_coord_A[j]]])
      }
      coord_poly_pair.toString();


    var  pair_string = JSON.stringify(coord_poly_pair);
    pair_string = pair_string.replace(/"/g,"");
    pair_string = pair_string.replace(/(\,\[)/g,",");
    pair_string = pair_string.replace(/\]\]\,/g,"], [");
    pair_string = pair_string.replace(/\]\]\]/g,"]]");

    //array x & y  put in order to Coordpairs
    $.each(x_poly_coord_A,function(i, item){
      coord_poly_pair = x_poly_coord_A[i]+", "+ y_poly_coord_A[i];
      coord_poly_pair = coord_poly_pair.toString();
    });

  coord_poly_string = "["+pair_string+"]";


  var myPolygon = Polygon(name_polygon,description_polygon, start_polygon, end_polygon, type_polygon, coord_poly_string) //(here)

    //push class Point to array
    polygon_Array.push(myPolygon);


}//if-end-Polygon
///////////////////////////////
    // Loop  is here, if it is a Point
    if(data.features[i].geometry.type ==="Point"){

      name_point = data.features[i].properties.TITLE;
      type_point = data.features[i].geometry.type;
      description_point = data.features[i].properties.DESCRIPTION; //Here

      //extract Coordinates
      var coord_points = data.features[i].geometry.coordinates;
      point_item = i+";"+ data.features[i].geometry.type +";"+coord_points;
      var split_point_item = point_item.split(";");
      split_point_item_to_string = split_point_item.toString();
      var itemsxy_point = split_point_item_to_string.split(",");
      x_point = itemsxy_point[2];
      y_point = itemsxy_point[3];

      //extract Time(Date)
      var start = data.features[i].properties.SYEAR+"-"+data.features[i].properties.SMONTH+"-"+data.features[i].properties.SDAY

      var end = data.features[i].properties.EYEAR +"-"+data.features[i].properties.EMONTH+"-"+data.features[i].properties.EDAY

      start_point = new Date(start);
      end_point = new Date(end);


      //extracted data pass over to Class
      var mypoint =  Point(name_point,description_point, start_point, end_point, type_point, x_point, y_point);//(here)
        //class feature push to Array(Point)
        point_Array.push(mypoint);

    }//if-end-Point
//////////////////////////
    //Loop her if it is a LineString
    if(data.features[i].geometry.type ==="LineString"){



      name_line = data.features[i].properties.TITLE;
      description_line = data.features[i].properties.DESCRIPTION; //Here
      type_line = data.features[i].geometry.type;
      //console.log(name_line);
      //extract Coordinates of LineString
      var coord_line = data.features[i].geometry.coordinates;
      coord_line = coord_line.toString();
      coord_line = coord_line.split(",")

      var x_coord_A =[];
      var y_coord_A = [];
      var coord_line_point = "";
      var coord_string = "";

      //all Y-Coordinates
      for (k = 1; k<coord_line.length; k+=2){

        y_coord_A.push(coord_line[k]+"]");
      };

      //all X-Coordinates
      for (j = 0; j<coord_line.length; j+=2){

          x_coord_A.push("["+coord_line[j]);
      };

    //array x & y put in order
    $.each(x_coord_A,function(i, item){

      coord_line_point = x_coord_A[i]+", "+ y_coord_A[i]

      coord_string += coord_line_point+", ".toString();
    });

    coord_string = coord_string.substr(0,coord_string.length-2);
    coord_string = coord_string;

  //Time(Date) extract
  var start_line = data.features[i].properties.SYEAR+"-"+data.features[i].properties.SMONTH+"-"+data.features[i].properties.SDAY
  var end_line = data.features[i].properties.EYEAR +"-"+data.features[i].properties.EMONTH+"-"+data.features[i].properties.EDAY

  start_line = new Date(start_line);
  end_line = new Date(end_line);

  //extracted data hand over to class Line
  var myline =  Line(name_line, description_line, start_line, end_line, type_line, coord_string); //Here

  //class feature push to Array(Line)
  line_Array.push(myline);


    }//if-LineString

///////////////////////////////////


  }//loop-end

  console.log(line_Array);

    var polygonInOneString = "";
    var featuresInOneString ="";
    var lineInString = "";

for (var k = 0; k<polygon_Array.length; k++){
  polygonInOneString +=polygon_Array[k].toString();
}

polygonInOneString = polygonInOneString.replace(/,\s*$/, ""); //delete last ,

for (var k = 0; k <point_Array.length; k++) {
  featuresInOneString +=point_Array[k].toString();
}

featuresInOneString = featuresInOneString.replace(/,\s*$/, ""); //delete last ,


for(var k = 0; k <line_Array.length; k++){
  lineInString +=line_Array[k].toString();
}
lineInString = lineInString.replace(/,\s*$/, "");


var example_data = '{"type"'+':'+'"FeatureCollection","features"'+':'+'['+featuresInOneString+","+lineInString+","+polygonInOneString+']}';
    example_data = example_data.toString();

// Transform to a JSON-Object
//var example_data_for_map = JSON.parse(example_data);
//document.write(example_data);
 example_data_for_map = JSON.parse(example_data);
console.log(example_data_for_map);



        //////////////////////////
        //  Leaflet.timeline   //
        ////////////////////////

  var slider = L.timelineSliderControl({
  steps: 1000, //standard 1000 //9131steps=9131Days(map.geojson(Interval))
  duration: 10000,//9131000,// standard 10000 = 9131000 seconds
  showTicks: true,
  enableKeyboardControls:true,
  formatOutput: function(date){
    return moment(date).format("YYYY-MM-DD");

  }

});
map.addControl(slider);


timeline = L.timeline(example_data_for_map,
    // Here are the code tho show the data of the features in a POPUP
  {

  waitToUpdateMap: true,
    onEachFeature:function(feature, layer){
      layer.bindPopup("Title: "+feature.properties.name
      +"<br>Description: "+ feature.properties.description
      +"<br>from:<br> "+feature.properties.start
      +"<br> to : <br>"+feature.properties.end);
    }
  }
);
timeline.addTo(map)//.bindPopup(example_data_for_map.features.properties);//(features.properties.name);
slider.addTimelines(timeline);
///////////////////////////////////////////////////////
//  These code pass over the data to the sidebar    // ????git whyasd add
/////////////////////////////////////////////////////
      var displayed = timeline.getLayers();
      var list = document.getElementById('displayed-list');
      list.innerHTML = "";
      displayed.forEach(function(layer){
        var li = document.createElement('li');
        li.innerHTML = "Hello World"+layer.feature.properties.name//  quake.feature.properties.title;
        list.appendChild(li);
      });

}//End-Function dataForTimeline
 //github Problem ikjijol
//jhkjhkjh







$.getJSON("./map.geojson", function(data) {
  //addDataToMap(data, map);
  dataForTimeline(data, map);  //delete maybe map
  //updateList(data, map);
});
