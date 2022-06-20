function closeLayer( obj ) {
	$(obj).parent().parent().hide();
}


$(document).ready(function(){


var placeid = "";


//맵을 만들기 전 구현 1단계 코드
var seoulMapWidth = 600;
var seoulMapHeight = 600;
var initialScale = 65000;

var initialX = seoulMapWidth/2+5;
var initialY = seoulMapHeight/2-30;

var centerX = 126.9895;
var centerY = 37.5651;


//맵 만들기 전 구현 2단계 코드
var mapSvg = d3.select("#mapShow").append("svg")
    .attr("width", seoulMapWidth)
    .attr("height", seoulMapHeight)
    .attr("id", "seoulMap");

var placeProjection, placePath, placeMap,
    seoulProjection, seoulPath, seoulMap
var zoom;



function  displaySeoulMap(){

//맵 만들기 전 구현 3단계 코드
seoulMap = mapSvg.append("g").attr("id", "maps");
placeMap = mapSvg.append("g").attr("id", "places");

seoulProjection = d3.geo.mercator().center([centerX, centerY]).scale(initialScale)
    .translate([initialX, initialY]);
placeProjection = d3.geo.mercator().center([centerX, centerY]).scale(initialScale)
    .translate([initialX, initialY]);


seoulPath = d3.geo.path().projection(seoulProjection);
placePath = d3.geo.path().projection(placeProjection);




//줌기능탑재
zoom = d3.behavior.zoom()
	.center(null) /* zoom에서 center를 지정하지 않으면 즉, 값을 null로 하면 마우스가 있는 곳에서 확대, 축소 함 */
	.size([seoulMapWidth, seoulMapHeight])
	.scaleExtent([1, 10]) /* [0.5, 5] 확대 및 축소 범위 지정 */
    .on("zoom", function()

     {
       seoulMap.attr("transform","translate("+ d3.event.translate + ")scale(" + d3.event.scale + ")");
       placeMap.attr("transform","translate("+ d3.event.translate + ")scale(" + d3.event.scale + ")");
     });



seoulMap.call(zoom).call(zoom.event);
placeMap.call(zoom).call(zoom.event);
// zoom and pan //




//아래부터는 서울시 내에 있는 구의 이름을 명시해주는 명령어인듯

d3.json("./seoul.json", function(error, data)
{ var features = topojson.feature(data, data.objects.seoul_municipalities_geo).features;

  seoulMap.selectAll("path")
          .data(features).enter().append("path")
          .attr("class", function(d) { /* console.log(); */ return "municipality c" + d.properties.code })
          .attr("d", seoulPath);

  seoulMap.selectAll("text")
          .data(features).enter().append("text")
          .attr("transform", function(d) { return "translate(" + placePath.centroid(d) + ")"; })
          .attr("dy", ".35em")
          .attr("class", "municipality-label")
          .text(function(d) { return d.properties.name; });
});

}


/* ------------------------------------------------------------------------ */


displaySeoulMap();

// 특정 점 위에 마우스를 올리고 클릭하면
//그곳에 대한 정보가 뜸

//placeid는 해당 구 이름


$( document )
 .on( "click", "#mapShow .municipality", function(e)
  {  $(this).css({"fill" : "#FF850D"});
    //팝업 기능 잠시 봉인
    //document.querySelector('#pop_info_1').style.display = 'block';

    placeid = $(this).attr('class');
    var tempid = placeid.split(' ');
    placeid = tempid[1];


		var sWidth = window.innerWidth;
		var sHeight = window.innerHeight;

		var oWidth = $('.'+placeid+'1').width();
		var oHeight = $('.'+placeid+'1').height();

		// 레이어가 나타날 위치를 셋팅한다.
		var divLeft = e.clientX + 10;
		var divTop = e.clientY + 5;

		// 레이어가 화면 크기를 벗어나면 위치를 바꾸어 배치한다.
		if( divLeft + oWidth > sWidth ) divLeft -= oWidth;
		if( divTop + oHeight > sHeight ) divTop -= oHeight;

		// 레이어 위치를 바꾸었더니 상단기준점(0,0) 밖으로 벗어난다면 상단기준점(0,0)에 배치하자.
		if( divLeft < 0 ) divLeft = 0;
		if( divTop < 0 ) divTop = 0;

		$('.'+placeid+'1').css({
			"top": divTop,
			"left": divLeft,
			"position": "absolute"
		}).show();
  })

  .on( "click", ".pop_wrap .btn_close", function()
  { document.querySelector('#pop_info_1').style.display = 'none';
  })

 .on( "mouseenter", "#mapShow .municipality", function()
  {$(this).css({"fill" : "#ffc703"});
  })

 .on( "mouseleave", "#mapShow .municipality", function()
  {  $(this).css({"fill" : "#8ecad1"});
  })



});
