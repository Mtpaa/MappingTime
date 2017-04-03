//-- ************************* -->
//-- ******Leaflet_Map******** -->
//-- ************************* -->

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






 // Konstruktorfunktion Point, LineString, Polygon

    //new Point
    function Point(name_point, start_point, end_point, type_point, x_point, y_point){
      var that = this;
      that.name_point = name_point;
      //that.description is missing
      that.start_point = start_point;
      that.end_point = end_point;
      that.type_point = type_point;
      that.x_point = x_point;
      that.y_point = y_point;

      //that.point_feature = function(){
      return '{"type":'+'"Feature","properties":{"name":"'+name_point+'",'+'"start":'+'"'+start_point+'"'+','+'"end":'+'"'+end_point+'"'+"},"+'"geometry"'+':{"type":"'+type_point +'",'+'"coordinates":['+x_point+","+y_point+']}},'
     //}
   };

         //new LineString
    function Line(name_line, start_line, end_line, type_line, theLineCoords){
     var that = this;
     that.name_line = name_line;
     //that.description =  that.description;
     that.start_line = start_line;
     that.end_line = end_line;
     that.type_line = type_line;
     that.theLineCoords = theLineCoords;



     return '{"type":'+'"Feature","properties":{"name":"'+name_line+'",'+'"start":'+'"'+start_line+'"'+","+'"end":'+'"'+end_line+'"'+"},"+'"geometry"'+':{"type":"'+type_line +'",'+'"coordinates":['+theLineCoords+']}},'

    };

    //new Polygon
    function Polygon(name_polygon, start_polygon, end_polygon, type_polygon, coord_poly_string) {
      var that = this;
      that.name_polygon = name_polygon;
      //that.description =  that.description;
      that.start_polygon = start_polygon;
      that.end_polygon = end_polygon;
      that.type_polygon = type_polygon;
      that.coord_poly_string = coord_poly_string;


      return '{"type":'+'"Feature","properties":{"name":"'+name_polygon+'",'+'"start":'+'"'+start_polygon+'"'+","+'"end":'+'"'+end_polygon+'"'+"},"+'"geometry"'+':{"type":"'+type_polygon +'",'+'"coordinates":'+coord_poly_string+'}},'

    }; /// ENDE Klasse Polygon
//ENDE (Funktionen) Klassen definition




function dataForTimeline(data, map){
  console.log(data);
  var point_Array = [];
  var line_Array = [];
  var polygon_Array = [];
  var count = 0

  //Loop geojson-auslesen
  for(var i = 0; i <data.features.length; i++){
    count++;


    //Polygon
    if(data.features[i].geometry.type ==="Polygon"){

      var name_polygon = data.features[i].properties.TITLE;
       //alert(name_polygon);
      var type_polygon = data.features[i].geometry.type;


    //Time/Date extrahieren
   var start_polygon = data.features[i].properties.SYEAR+"-"+data.features[i].properties.SMONTH+"-"+data.features[i].properties.SDAY

    var end_polygon = data.features[i].properties.EYEAR +"-"+data.features[i].properties.EMONTH+"-"+data.features[i].properties.EDAY

    start_polygon = new Date(start_polygon);
    end_polygon = new Date (end_polygon);

   //Koordinaten
    var coord_poly = data.features[i].geometry.coordinates;
    //console.log(coord_poly);
    coord_poly = coord_poly.toString();
    coord_poly = coord_poly.split(",");



     var x_poly_coord_A =[];
     var y_poly_coord_A = [];
     var coord_poly_Array = []; //="";
     var coord_poly_string = "";

      //Alle Y-Koordinaten
      for (m = 1; m<coord_poly.length; m+=2){
        y_poly_coord_A.push(coord_poly[m]);
      };
  //Array full of y_koordibnaten
  //Alle X-Koordinaten
      for (n = 0; n<coord_poly.length; n+=2){
        x_poly_coord_A.push(coord_poly[n]);
      };


    var coord_poly_pair = [];  //="";

      for (var j=0; j<x_poly_coord_A.length; j++){
        coord_poly_pair.push([x_poly_coord_A[j],[y_poly_coord_A[j]]])
      }
      coord_poly_pair.toString();


    var  pair_string = JSON.stringify(coord_poly_pair);
    pair_string = pair_string.replace(/"/g,"");
    pair_string = pair_string.replace(/(\,\[)/g,",");
    pair_string = pair_string.replace(/\]\]\,/g,"], [");
    pair_string = pair_string.replace(/\]\]\]/g,"]]");

    //Array x u. y zu Koordinatenpaare ordnen
    $.each(x_poly_coord_A,function(i, item){
      coord_poly_pair = x_poly_coord_A[i]+", "+ y_poly_coord_A[i];
      coord_poly_pair = coord_poly_pair.toString();
    });

  coord_poly_string = "["+pair_string+"]";
 // alert(coord_poly_string);

  var myPolygon = Polygon(name_polygon, start_polygon, end_polygon, type_polygon, coord_poly_string)
    //alert(myPolygon);
 polygon_Array.push(myPolygon);

  //alert(polygon_Array);









    }//if-Polygon
///////////////////////////////







    //Point
    if(data.features[i].geometry.type ==="Point"){

      name_point = data.features[i].properties.TITLE;
      type_point = data.features[i].geometry.type;
         //console.log(name_point);
      //Koordinaten extrahieren
      var coord_points = data.features[i].geometry.coordinates;
      point_item = i+";"+ data.features[i].geometry.type +";"+coord_points;
      var split_point_item = point_item.split(";");
      split_point_item_to_string = split_point_item.toString();
      var itemsxy_point = split_point_item_to_string.split(",");
      x_point = itemsxy_point[2];
      y_point = itemsxy_point[3];

      //Time/Date extrahieren
      var start = data.features[i].properties.SYEAR+"-"+data.features[i].properties.SMONTH+"-"+data.features[i].properties.SDAY

      var end = data.features[i].properties.EYEAR +"-"+data.features[i].properties.EMONTH+"-"+data.features[i].properties.EDAY

      start_point = new Date(start);
      end_point = new Date(end);


      //extrahierete Daten an Klasse übergeben
      var mypoint =  Point(name_point, start_point, end_point, type_point, x_point, y_point);
      //console.log(mypoint); /
        //mypoint_string = JSON.stringify(mypoint);//importent step for an other difficult way(replace)
        point_Array.push(mypoint);

    }//if-Point
//////////////////////////
   //LineString
    if(data.features[i].geometry.type ==="LineString"){

        //alert (count); //18

      name_line = data.features[i].properties.TITLE;
      type_line = data.features[i].geometry.type;
      console.log(name_line);
    //Koordinaten extrahieren von einem LineString
      var coord_line = data.features[i].geometry.coordinates;
      coord_line = coord_line.toString();
      coord_line = coord_line.split(",")

      var x_coord_A =[];
      var y_coord_A = [];
      var coord_line_point = "";
      var coord_string = "";

      //Alle Y-Koordinaten
      for (k = 1; k<coord_line.length; k+=2){
        //console.log("y = "+i +"--"+coord_line[i]); //i =-1 66 //all y
        y_coord_A.push(coord_line[k]+"]");
      };

      //Alle X-Koordinaten
      for (j = 0; j<coord_line.length; j+=2){
        //console.log("x= "+i +"--"+coord_line[i]); //i = 0-66 //all x
          x_coord_A.push("["+coord_line[j]);
      };

    //Array x u. y zu Koordinatenpaare ordnen
    $.each(x_coord_A,function(i, item){
      //console.log(x_coord_A[i]+","+ y_coord_A[i]);
      coord_line_point = x_coord_A[i]+", "+ y_coord_A[i]
      //console.log(coord_line_point);
      coord_string += coord_line_point+", ".toString();
    });

    coord_string = coord_string.substr(0,coord_string.length-2);
    coord_string = coord_string;

  //Time/Date extrahieren
  var start_line = data.features[i].properties.SYEAR+"-"+data.features[i].properties.SMONTH+"-"+data.features[i].properties.SDAY
  var end_line = data.features[i].properties.EYEAR +"-"+data.features[i].properties.EMONTH+"-"+data.features[i].properties.EDAY

  start_line = new Date(start_line);
  end_line = new Date(end_line);

  //extrahierete Daten an Klasse (Line) übergeben
  var myline =  Line(name_line, start_line, end_line, type_line, coord_string);
 // alert(myline);

  line_Array.push(myline);


    }//if-LineString
   // alert(line_Array.length);
///////////////////////////////////


  }//loop Ende
  //console.log(point_Array);
  console.log(line_Array);
  //console.log("Länge = "+point_Array.length); //21
  //console.log(point_Array[0]);
    var polygonInOneString = "";
    var featuresInOneString =""; //muss vielleicht globale Variable werden
    var lineInString = "";

for (var k = 0; k<polygon_Array.length; k++){
  polygonInOneString +=polygon_Array[k].toString();
}

polygonInOneString = polygonInOneString.replace(/,\s*$/, ""); //letztes Komma entfernen


for (var k = 0; k <point_Array.length; k++) {
  featuresInOneString +=point_Array[k].toString();
}

featuresInOneString = featuresInOneString.replace(/,\s*$/, ""); //letztes Komma entfernen


for(var k = 0; k <line_Array.length; k++){
  lineInString +=line_Array[k].toString();
}
lineInString = lineInString.replace(/,\s*$/, "");
//alert(lineInString);

var example_data = '{"type"'+':'+'"FeatureCollection","features"'+':'+'['+featuresInOneString+","+lineInString+","+polygonInOneString+']}';
//alert(example_data);
//var polygon_example = '{"type"'+':'+'"FeatureCollection","features"'+':'+'['+polygonFeatures_2_String+linefeaturesInOneString+featuresInOneString+']}';

//hier muss später Polygon und LineString hinzugefügt werden
// document.write(example_data);

 example_data = example_data.toString();
  // Transform to a JSON-Object
var example_data_for_map = JSON.parse(example_data);
//console.log(obj);
//var mypointsLayer =  L.geoJson(obj);
   var slider = L.timelineSliderControl({
  steps: 1000, //standard 1000 //9131steps=9131Tage
  duration: 10000,//9131000,// standard 10000 = 9131000 sekunden
  showTicks: true,
  enableKeyboardControls:true,
  formatOutput: function(date){
    return moment(date).format("YYYY-MM-DD");

  }

});
map.addControl(slider);

var timeline = L.timeline(example_data_for_map,{
  //getInterval:
    });
timeline.addTo(map);
slider.addTimelines(timeline);




}//End function dataForTimeline


$.getJSON("./map.geojson", function(data) {
  //addDataToMap(data, map);
  dataForTimeline(data, map);  //delete maybe map
});

//JQuery
