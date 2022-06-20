import * as d3 from "d3";
import { useEffect, useState } from 'react';
import input_data_Jan from "./sek_data/Jan_data.csv";
import input_data_Feb from "./sek_data/Feb_data.csv";
import input_data_Mar from "./sek_data/Mar_data.csv";
import input_data_Apr from "./sek_data/Apr_data.csv";
import input_data_May from "./sek_data/May_data.csv";
import input_data_Jun from "./sek_data/Jun_data.csv";
import input_data_Jul from "./sek_data/Jul_data.csv";
import input_data_Aug from "./sek_data/Aug_data.csv";
import input_data_Nov from "./sek_data/Nov_data.csv";
import input_data_Sep from "./sek_data/Sep_data.csv";
import input_data_Dec from "./sek_data/Dec_data.csv";
import input_data_Oct from "./sek_data/Oct_data.csv";
import out_of_etc from "./sek_data/OutOfEtc.csv";
import out_of_pedal from "./sek_data/OutOfPedal.csv";
import out_of_chain from "./sek_data/OutOfChain.csv";
import out_of_saddle from "./sek_data/OutOfSaddle.csv";
import out_of_terminal from "./sek_data/OutOfTerminal.csv";
import out_of_tire from "./sek_data/OutOfTire.csv";
import out_of_total from "./sek_data/OutOfTotal.csv";

export default function BarSek({month}) {
    let input_data = input_data_Mar;
    let out_of_Order = out_of_tire;
    let monthTemp = 20;
    let reTemp = '';

    const color = "#8ecad1";
    const color_high = "#ffc703";
    
    const [data, setdata] = useState();
    const [dataline, setdataline] = useState();

    var margin = {top: 20, right: 25, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
  
    function shadeColor(color, percent) {

        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);
    
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
    
        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  
    
        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
    
        return "#"+RR+GG+BB;
    }

    function drillDown(item) {
        if (item === '기타') { out_of_Order = out_of_etc; }
        else if (item === '타이어') { out_of_Order = out_of_tire; }
        else if (item === '체인') { out_of_Order = out_of_chain; }
        else if (item === '단말기') { out_of_Order = out_of_terminal; }
        else if (item === '안장') { out_of_Order = out_of_saddle; }
        else if (item === '페달') { out_of_Order = out_of_pedal; }
        else if (item === '총 고장수') { out_of_Order = out_of_total; }

        if (reTemp === '') {
            console.log("정상출력");
            d3.csv(out_of_Order).then(function(dataline) {
               var svgL = d3.select("#barChart").append("svg")
                             .attr("id", "#SVG_Create")
                             .attr("width", width + margin.left + margin.right)
                             .attr("height", height + margin.top + margin.bottom);
    
                setdataline(dataline)
                console.log(dataline)
    
                const xScale = d3.scaleBand()
                    .domain(dataline.map(function(d){return d.Month;}))
                    .range([18, width + 20])
                    .padding(0.6);
                
                const yScale = d3.scaleLinear()
                                .domain([0, 22000])
                                .range([height, 20]);
            
                const xAxis = d3.axisBottom(xScale);
    
                const yAxis = d3.axisRight(yScale)         
                    .ticks(6, 'd');
                
                svgL.append('g')
                    .attr("transform", "translate(0," + (height) + ")")
                    .call(xAxis);
    
                svgL.append('g')
                    .style("transform", "translateX(0px)").call(yAxis);
    
                const tooltip = d3.select("body")
                    .append("div")
                    .attr("class","d3-tooltip")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .style("visibility", "hidden")
                    .style("padding", "15px")
                    .style("background", "rgba(0,0,0,0.6)")
                    .style("border-radius", "5px")
                    .style("color", "#fff")
                    .text(function(d) { return d; });
    
                svgL.selectAll("bar")
                    .data(dataline)
                    .enter()
                    .append("rect")
                    .attr("id","the_SVG_ID")
                    .attr("x", function(d){ return xScale(d.Month);})
                    .attr("y", function(d){ return yScale(d.Product);})
                    .attr("width", xScale.bandwidth())
                    .attr("height", function(d){return height - yScale(d.Product);})
                    .style('fill', function(d) {return (d.mm == month ?color_high:color)})
                    .on("mouseover", function(evt, i) {
                        console.log("mouseover");
                        tooltip.style("visibility", "visible");
                    })
                    .on("mousemove", function(event, d){
                        console.log("mousemove");
                        tooltip
                            .html(d.Month + " : " + d.Product)
                            .style("top", (event.pageY-10)+"px")
                            .style("left",(event.pageX+10)+"px");
                    })
                    .on("mouseout", function() {
                        console.log("mouseout");
                        tooltip.html(``).style("visibility", "hidden");
                    });

                    // svgL.append("text")
                    // .attr("transform", "translate(" + (width/2) + " ," + (height+40) + ")")
                    // .style("text-anchor", "middle")
                    // .text("2021년(월)");

                    
          svgL.append("text")
            .attr("transform", "translate(" + (width/2+78) + " ," + (height+30) + ")")
            .style("text-anchor", "middle")
            .text("월별"); 
          svgL.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -(height/2))
                .attr("y", 15)
                .style("text-anchor", "middle")
                .text("고장건수");


            });
            reTemp = item;
        }
        else if (reTemp === item) {
            console.log("닫기");
            d3.select("#barChart").select("svg").remove();
            reTemp = '';
        }
        else {
            console.log("교체");
            d3.select("#barChart").select("svg").remove();
            d3.csv(out_of_Order).then(function(dataline) {
                var svgL = d3.select("#barChart").append("svg")
                              .attr("id", "#SVG_Create")
                              .attr("width", width + margin.left + margin.right)
                              .attr("height", height + margin.top + margin.bottom);
     
                 setdataline(dataline)
                 console.log(dataline)
     
                 const xScale = d3.scaleBand()
                     .domain(dataline.map(function(d){return d.Month;}))
                     .range([18, width + 20])
                     .padding(0.6);
                 
                 const yScale = d3.scaleLinear()
                                 .domain([0, 22000])
                                 .range([height, 20]);
             
                 const xAxis = d3.axisBottom(xScale);
     
                 const yAxis = d3.axisRight(yScale)         
                     .ticks(6, 'd');
                 
                 svgL.append('g')
                     .attr("transform", "translate(0," + (height) + ")")
                     .call(xAxis);
     
                 svgL.append('g')
                     .style("transform", "translateX(0px)").call(yAxis);
     
                 const tooltip = d3.select("body")
                     .append("div")
                     .attr("class","d3-tooltip")
                     .style("position", "absolute")
                     .style("z-index", "10")
                     .style("visibility", "hidden")
                     .style("padding", "15px")
                     .style("background", "rgba(0,0,0,0.6)")
                     .style("border-radius", "5px")
                     .style("color", "#fff")
                     .text(function(d) { return d; });
     
                 svgL.selectAll("bar")
                     .data(dataline)
                     .enter()
                     .append("rect")
                     .attr("id","the_SVG_ID")
                     .attr("x", function(d){ return xScale(d.Month);})
                     .attr("y", function(d){ return yScale(d.Product);})
                     .attr("width", xScale.bandwidth())
                     .attr("height", function(d){return height - yScale(d.Product);})
                     .style('fill', function(d) {return (d.mm == month ?color_high:color)})
                     .on("mouseover", function(evt, i) {
                         console.log("mouseover");
                         tooltip.style("visibility", "visible");
                     })
                     .on("mousemove", function(event, d){
                         console.log("mousemove");
                         tooltip
                             .html(d.Month + " : " + d.Product)
                             .style("top", (event.pageY-10)+"px")
                             .style("left",(event.pageX+10)+"px");
                     })
                     .on("mouseout", function() {
                         console.log("mouseout");
                         tooltip.html(``).style("visibility", "hidden");
                     });
 
                     svgL.append("text")
                     .attr("transform", "translate(" + (width/2) + " ," + (height+40) + ")")
                     .style("text-anchor", "middle")
                     .text("2021년(월)");
             });
            reTemp = item;
        }
    }

    function mainCh(month) {
        if (monthTemp === 20) {
            d3.select("#barChart").select("svg").remove();
            d3.select("#mainChart").select("svg").remove();
            d3.csv(input_data).then(function(data) {
                setdata(data);
                var svg = d3.select("#mainChart").append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom);
    
                const xScale = d3.scaleBand()
                    .domain(data.map(function(d){return d.MonthItem;}))
                    .range([20, width + 20])
                    .padding(0.5);
                
                const yScale = d3.scaleLinear()
                                .domain([0, 24000])
                                .range([height, 20]);
            
                const xAxis = d3.axisBottom(xScale);
    
                svg.append('g')
                    .attr("transform", "translate(0," + (height) + ")")
                    .call(xAxis);
    
                const yAxis = d3.axisRight(yScale)       
                    .ticks(6, 'd');
    
                svg.append('g')
                    .style("transform", "translateX(0px)")
                    .call(yAxis);
    
                const tooltip = d3.select("body")
                    .append("div")
                    .attr("class","d3-tooltip")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .style("visibility", "hidden")
                    .style("padding", "15px")
                    .style("background", "rgba(0,0,0,0.6)")
                    .style("border-radius", "5px")
                    .style("color", "#fff")
                    .text(function(d) { return d; });
                
                svg.selectAll("bar")
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d){ return xScale(d.MonthItem);})
                    .attr("y", function(d){ return yScale(d.Month);})
                    .attr("width", xScale.bandwidth())
                    .attr("height", function(d){return height - yScale(d.Month);})
                    .style('fill', color)
                    .on("click", function (clickedItem, selectedItem) {
                        console.log(selectedItem);
                        let item = selectedItem.MonthItem;
                        console.log(item);
                        drillDown(item);
                    })
                    .on("mouseover", function(evt, i) {
                        tooltip.style("visibility", "visible");
                        d3.select(this)
                            .style("fill", shadeColor(color, -15));
                    })
                    .on("mousemove", function(event, d){
                        tooltip
                            .html(d.MonthItem + " : " + d.Month)
                            .style("top", (event.pageY-10)+"px")
                            .style("left",(event.pageX+10)+"px");
                    })
                    .on("mouseout", function() {
                        tooltip.html("").style("visibility", "hidden");
                        d3.select(this).style("fill", color);
                    });
                    
                svg.append("text")
            .attr("transform", "translate(" + (width/2+78) + " ," + (height+30) + ")")
            .style("text-anchor", "middle")
            .text("고장 부품 종류"); 
          svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -(height/2))
                .attr("y", 15)
                .style("text-anchor", "middle")
                .text("고장건수");
                svg.selectAll("bar")
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d){ return xScale(d.MonthItem);})
                    .attr("y", function(d){ return yScale(d.MonthPre);})
                    .attr("width", xScale.bandwidth())
                    .attr("height", 3)
                    .style('fill', '#888888')
                    .on("click", function (clickedItem, selectedItem) {
                        console.log(selectedItem);
                        let item = selectedItem.MonthItem;
                        drillDown(item);
                    })
                    .on("mouseover", function(evt, i) {
                        tooltip.style("visibility", "visible");
                        d3.select(this)
                            .style("fill", shadeColor("#888888", -50));
                    })
                    .on("mousemove", function(event, d){
                        tooltip
                            .html((month-1 == 0? ("작년 ") : (month -1 + "월 ")) + d.MonthItem + " : " + d.MonthPre)
                            .style("top", (event.pageY-10)+"px")
                            .style("left",(event.pageX+10)+"px");
                    })
                    .on("mouseout", function() {
                        tooltip.html("").style("visibility", "hidden");
                        d3.select(this).style("fill", '#888888');
                    });

                // svg.append("text")
                //     .attr("transform", "translate(" + (width/2) + " ," + (height+30) + ")")
                //     .style("text-anchor", "middle")
                //     .text("고장 부품");
            });
            monthTemp = month;
        }
        else if (monthTemp != month) {
            console.log("메인차트 월 변경");
            d3.select("#barChart").select("svg").remove();
            d3.select("#mainChart").select("svg").remove();
            d3.csv(input_data).then(function(data) {
                setdata(data);
                var svg = d3.select("#mainChart").append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom);
    
                const xScale = d3.scaleBand()
                    .domain(data.map(function(d){return d.MonthItem;}))
                    .range([20, width + 20])
                    .padding(0.5);
                
                const yScale = d3.scaleLinear()
                                .domain([0, 24000])
                                .range([height, 20]);
            
                const xAxis = d3.axisBottom(xScale);
    
                svg.append('g')
                    .attr("transform", "translate(0," + (height) + ")")
                    .call(xAxis);
    
                const yAxis = d3.axisRight(yScale)       
                    .ticks(6, 'd');
    
                svg.append('g')
                    .style("transform", "translateX(0px)")
                    .call(yAxis);
    
                const tooltip = d3.select("body")
                    .append("div")
                    .attr("class","d3-tooltip")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .style("visibility", "hidden")
                    .style("padding", "15px")
                    .style("background", "rgba(0,0,0,0.6)")
                    .style("border-radius", "5px")
                    .style("color", "#fff")
                    .text(function(d) { return d; });
                
                svg.selectAll("bar")
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d){ return xScale(d.MonthItem);})
                    .attr("y", function(d){ return yScale(d.Month);})
                    .attr("width", xScale.bandwidth())
                    .attr("height", function(d){return height - yScale(d.Month);})
                    .style('fill', color)
                    .on("click", function (clickedItem, selectedItem) {
                        console.log(selectedItem);
                        let item = selectedItem.MonthItem;
                        console.log(item);
                        drillDown(item);
                    })
                    .on("mouseover", function(evt, i) {
                        tooltip.style("visibility", "visible");
                        d3.select(this)
                            .style("fill", shadeColor(color, -15));
                    })
                    .on("mousemove", function(event, d){
                        tooltip
                            .html(d.MonthItem + " : " + d.Month)
                            .style("top", (event.pageY-10)+"px")
                            .style("left",(event.pageX+10)+"px");
                    })
                    .on("mouseout", function() {
                        tooltip.html("").style("visibility", "hidden");
                        d3.select(this).style("fill", color);
                    });
    
                svg.selectAll("bar")
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d){ return xScale(d.MonthItem);})
                    .attr("y", function(d){ return yScale(d.MonthPre);})
                    .attr("width", xScale.bandwidth())
                    .attr("height", 3)
                    .style('fill', '#888888')
                    .on("click", function (clickedItem, selectedItem) {
                        console.log(selectedItem);
                        let item = selectedItem.MonthItem;
                        drillDown(item);
                    })
                    .on("mouseover", function(evt, i) {
                        tooltip.style("visibility", "visible");
                        d3.select(this)
                            .style("fill", shadeColor("#888888", -50));
                    })
                    .on("mousemove", function(event, d){
                        tooltip
                            .html((month-1 == 0? ("작년 ") : (month -1 + "월 ")) + d.MonthItem + " : " + d.MonthPre)
                            .style("top", (event.pageY-10)+"px")
                            .style("left",(event.pageX+10)+"px");
                    })
                    .on("mouseout", function() {
                        tooltip.html("").style("visibility", "hidden");
                        d3.select(this).style("fill", '#888888');
                    });

                // svg.append("text")
                //     .attr("transform", "translate(" + (width/2) + " ," + (height+30) + ")")
                //     .style("text-anchor", "middle")
                //     .text("고장 부품");
            });
            monthTemp = month;
        }
    }

    useEffect(() => {
        if (month == 1) { input_data = input_data_Jan; }
        else if (month == 2) { input_data = input_data_Feb; }
        else if (month == 3) { input_data = input_data_Mar; }
        else if (month == 4) { input_data = input_data_Apr; }
        else if (month == 5) { input_data = input_data_May; }
        else if (month == 6) { input_data = input_data_Jun; }
        else if (month == 7) { input_data = input_data_Jul; }
        else if (month == 8) { input_data = input_data_Aug; }
        else if (month == 9) { input_data = input_data_Sep; }
        else if (month == 10) { input_data = input_data_Oct; }
        else if (month == 11) { input_data = input_data_Nov; }
        else if (month == 12) { input_data = input_data_Dec; }
        mainCh(month);
    }, [month])

    return (
    <>
        <span id="mainChart"></span>
        <span id="barChart"></span>
    </>
    );

}

BarSek.defaultProps = {
    month:1
}