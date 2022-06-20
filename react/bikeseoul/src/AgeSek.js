import * as d3 from "d3";
import { useEffect, useState } from 'react';
import input_data_Jan from "./sek_data/age/202101.csv";
import input_data_Feb from "./sek_data/age/202102.csv";
import input_data_Mar from "./sek_data/age/202103.csv";
import input_data_Apr from "./sek_data/age/202104.csv";
import input_data_May from "./sek_data/age/202105.csv";
import input_data_Jun from "./sek_data/age/202106.csv";
import input_data_Jul from "./sek_data/age/202107.csv";
import input_data_Aug from "./sek_data/age/202108.csv";
import input_data_Sep from "./sek_data/age/202109.csv";
import input_data_Oct from "./sek_data/age/202110.csv";
import input_data_Nov from "./sek_data/age/202111.csv";
import input_data_Dec from "./sek_data/age/202112.csv";

export default function AgeChart({month}) {
    let input_data = input_data_Jan;
    let monthTemp = 20;

    const color = "#8ecad1";

    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 670 - margin.left - margin.right,
    height = 680 - margin.top - margin.bottom;
    
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

    const [data, setdata] = useState();

    function ageCh(month) {
        if (monthTemp === 20) {
            d3.select("#ageChart").select("svg").remove();
            d3.csv(input_data).then(function(data) {
                setdata(data)
    
                 var svg = d3.select("#ageChart")
                        .append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                            .attr("transform",
                                "translate(" + margin.left + "," + margin.top + ")");
    
                var x = d3.scaleBand()
                    .range([ 0, width ])
                    .padding(1);
                var xAxis = svg.append("g")
                            .attr("transform", "translate(0," + height + ")");
    
                var y = d3.scaleLinear()
                    .range([ height, 0]);
                var yAxis = svg.append("g")
                            .attr("class", "myYaxis");
    
                x.domain(data.map(function(d) { return d.age; }));
                xAxis.call(d3.axisBottom(x));
                y.domain([0, d3.max(data, function(d) { return +d.subNum }) ]);
                yAxis.call(d3.axisLeft(y));
        
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
    
                var j = svg.selectAll(".myLine")
                .data(data);
                
                j
                .enter()
                .append("line")
                .attr("class", "myLine")
                .merge(j)
                    .attr("x1", function(d) { console.log(x(d.age)) ; return x(d.age); })
                    .attr("x2", function(d) { return x(d.age); })
                    .attr("y1", y(0))
                    .attr("y2", function(d) { return y(d.subNum); })
                    .attr("stroke", "grey")
                    .attr("stroke-width", 3)
    
                var u = svg.selectAll("circle")
                .data(data);
    
                u
                .enter()
                .append("circle")
                .merge(u)
                .attr("cx", function(d) { return x(d.age); })
                .attr("cy", function(d) { return y(d.subNum); })
                .attr("r", 8)
                .style("fill", color)
                .on("mouseover", function(evt, i) {
                    tooltip.style("visibility", "visible");
                    d3.select(this)
                        .style("fill", shadeColor(color, -15));
                })
                .on("mousemove", function(event, d){
                    tooltip
                        .html(d.age + " : " + d.subNum)
                        .style("top", (event.pageY-10)+"px")
                        .style("left",(event.pageX+10)+"px");
                })
                .on("mouseout", function() {
                    tooltip.html("").style("visibility", "hidden");
                    d3.select(this).style("fill", color);
                });
    
                svg.append("text")
                    .attr("transform", "translate(" + (width/2) + " ," + (height+40) + ")")
                    .style("text-anchor", "middle")
                    .text("연령대");
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("x", -(height/2))
                    .attr("y", 15)
                    .style("text-anchor", "middle")
                    .text(month + "월 이용자수")
            });
            monthTemp = month;
        } else if (monthTemp != month) {
            d3.select("#ageChart").select("svg").remove();
            d3.csv(input_data).then(function(data) {
                setdata(data)
    
                 var svg = d3.select("#ageChart")
                        .append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                            .attr("transform",
                                "translate(" + margin.left + "," + margin.top + ")");
    
                var x = d3.scaleBand()
                    .range([ 0, width ])
                    .padding(1);
                var xAxis = svg.append("g")
                            .attr("transform", "translate(0," + height + ")");
    
                var y = d3.scaleLinear()
                    .range([ height, 0]);
                var yAxis = svg.append("g")
                            .attr("class", "myYaxis");
    
                x.domain(data.map(function(d) { return d.age; }));
                xAxis.call(d3.axisBottom(x));
                y.domain([0, d3.max(data, function(d) { return +d.subNum }) ]);
                yAxis.call(d3.axisLeft(y));
        
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
    
                var j = svg.selectAll(".myLine")
                .data(data);
                
                j
                .enter()
                .append("line")
                .attr("class", "myLine")
                .merge(j)
                    .attr("x1", function(d) { console.log(x(d.age)) ; return x(d.age); })
                    .attr("x2", function(d) { return x(d.age); })
                    .attr("y1", y(0))
                    .attr("y2", function(d) { return y(d.subNum); })
                    .attr("stroke", "grey")
                    .attr("stroke-width", 3)
    
                var u = svg.selectAll("circle")
                .data(data);
    
                u
                .enter()
                .append("circle")
                .merge(u)
                .attr("cx", function(d) { return x(d.age); })
                .attr("cy", function(d) { return y(d.subNum); })
                .attr("r", 8)
                .style("fill", color)
                .on("mouseover", function(evt, i) {
                    tooltip.style("visibility", "visible");
                    d3.select(this)
                        .style("fill", shadeColor(color, -15));
                })
                .on("mousemove", function(event, d){
                    tooltip
                        .html(d.age + " : " + d.subNum)
                        .style("top", (event.pageY-10)+"px")
                        .style("left",(event.pageX+10)+"px");
                })
                .on("mouseout", function() {
                    tooltip.html("").style("visibility", "hidden");
                    d3.select(this).style("fill", color);
                });
    
                svg.append("text")
                    .attr("transform", "translate(" + (width/2) + " ," + (height+40) + ")")
                    .style("text-anchor", "middle")
                    .text("연령대");
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("x", -(height/2))
                    .attr("y", 15)
                    .style("text-anchor", "middle")
                    .text(month + "월 이용자수")
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
        ageCh(month);
    }, [month])

    return (
        <>
            <div id="ageChart"></div>
        </>
    );
}