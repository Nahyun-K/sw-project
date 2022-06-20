import * as d3 from "d3";
import { useEffect, useState } from "react";

import input_data1 from "./lyj_data/1월top123Time.csv";
import input_data2 from "./lyj_data/2월top123Time.csv";
import input_data3 from "./lyj_data/3월top123Time.csv";
import input_data4 from "./lyj_data/4월top123Time.csv";
import input_data5 from "./lyj_data/5월top123Time.csv";
import input_data6 from "./lyj_data/6월top123Time.csv";
import input_data7 from "./lyj_data/7월top123Time.csv";
import input_data8 from "./lyj_data/8월top123Time.csv";
import input_data9 from "./lyj_data/9월top123Time.csv";
import input_data10 from "./lyj_data/10월top123Time.csv";
import input_data11 from "./lyj_data/11월top123Time.csv";
import input_data12 from "./lyj_data/12월top123Time.csv";


export default function Prac4({count}) {
    var input_data = input_data1;
    let monthTemp = 20;

    const color_now = "#ffc703";
    const color_middle = "#74BFE0";
    const color_high = "#E0697D";

    var margin = {top: 20, right: 20, bottom: 60, left: 50},
    width = 500 - margin.left/2 - margin.right/2,
    height = 395 - margin.top/2 - margin.bottom/2;

    const [data, setdata] = useState();

    function mainFunc({count}) {
        if (monthTemp == 20) {
            d3.select("#ttlChart").select("svg").remove();
            d3.csv(input_data).then(function(data) {
                setdata(data);

                var svg = d3.select("#ttlChart")
                    .append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);

                const sumstat = d3.group(data, d => d.Top);
                const max = d3.max(data, function(d) { return +d.빈도수; })

                var x = d3
                    .scaleBand()
                    .domain(data.map(function(d){return d.시;}))
                    .range([0, width])
                    .padding(0);
                svg.append("g")
                    .attr("transform", "translate(0,"+height+")")
                    .call(d3.axisBottom(x).ticks(5))
                    .style("text-anchor", "middle")
            .text("21년도 남자/여자")
                    //.html("DW");

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
                
                var y = d3
                    .scaleLinear()
                    .domain([0,max+10])
                    .range([height, 0]);
                svg.append("g").call(d3.axisLeft(y))

                var color = d3.scaleOrdinal()
                    .range([color_now,color_middle,color_high])

                svg.selectAll(".line")
                    .data(sumstat)
                    .join("path")
                        .attr("id", "lines")
                        .attr("fill", "none")
                        .attr("stroke", function(d){ return color(d[0]) })
                        .attr("stroke-width", 3.3)
                        .attr("d", function(d){
                            return d3.line()
                                .x(function(d) { return x(d.시); })
                                .y(function(d) { return y(+d.빈도수); })
                                (d[1])})
                    .on("mouseover", function(evt, i) {
                        tooltip.style("visibility", "visible");
                    })
                    .on("mousemove", function(event, d){
                        tooltip
                            .html(d[1][0].대여소)
                            .style("top", (event.pageY-10)+"px")
                            .style("left",(event.pageX+10)+"px");
                        d3.select(this).attr("stroke", color(d[0]));
                        d3.select(this).attr("stroke-width", 6.5);
                    })
                    .on("mouseout", function() {
                        tooltip.html(``).style("visibility", "hidden");
                        d3.select(this).attr("stroke-width", 3.3);
                    })
                var top3= document.querySelector("#top3");
                var text = "";
                    for (let i=0; i<70; i = i + 24) {
                        text = text+ "Top " + data[i].Top + " : " + data[i].대여소 + '\n';
                    }
                top3.innerText = text;
            });
            monthTemp = count;

        } else if (monthTemp != count) {
            d3.select("#ttlChart").select("svg").remove();
            d3.csv(input_data).then(function(data) {
                setdata(data);

                var svg = d3.select("#ttlChart")
                    .append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);

                const sumstat = d3.group(data, d => d.Top);
                const max = d3.max(data, function(d) { return +d.빈도수; })

                var x = d3
                    .scaleBand()
                    .domain(data.map(function(d){return d.시;}))
                    .range([0, width])
                    .padding(0.6);
                svg.append("g")
                    .attr("transform", "translate(0,"+height+")")
                    .call(d3.axisBottom(x).ticks(5));

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
                
                var y = d3
                    .scaleLinear()
                    .domain([0,max+10])
                    .range([height, 0]);
                svg.append("g").call(d3.axisLeft(y))

                var color = d3.scaleOrdinal()
                    .range([color_now,color_middle,color_high])
            svg.append("text")
            .attr("transform", "translate(" + (width/2+78) + " ," + (height+30) + ")")
            .style("text-anchor", "middle")
            .text("21년도 남자/여자"); 
          svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -(height/2))
                .attr("y", 15)
                .style("text-anchor", "middle")
                .text("Population");        
                svg.selectAll(".line")
                    .data(sumstat)
                    .join("path")
                        .attr("id", "lines")
                        .attr("fill", "none")
                        .attr("stroke", function(d){ return color(d[0]) })
                        .attr("stroke-width", 3.3)
                        .attr("d", function(d){
                            return d3.line()
                                .x(function(d) { return x(d.시); })
                                .y(function(d) { return y(+d.빈도수); })
                                (d[1])})
                    .on("mouseover", function(evt, i) {
                        tooltip.style("visibility", "visible");
                    })
                    .on("mousemove", function(event, d){
                        tooltip
                            .html(d[1][0].대여소)
                            .style("top", (event.pageY-10)+"px")
                            .style("left",(event.pageX+10)+"px");
                        d3.select(this).attr("stroke", color(d[0]));
                        d3.select(this).attr("stroke-width", 6.5);
                    })
                    .on("mouseout", function() {
                        tooltip.html(``).style("visibility", "hidden");
                        d3.select(this).attr("stroke-width", 3.3);
                    })

                
                
                var top3= document.querySelector("#top3");
                var text = "";
                    for (let i=0; i<70; i = i + 24) {
                        text = text+ "Top " + data[i].Top + " : " + data[i].대여소 + '\n';
                    }
                top3.innerText = text;
            });
            monthTemp = count;
        }
    }    
    
    useEffect(() => {
        if(count == "1"){ input_data = input_data1; }
        if(count == "2"){ input_data = input_data2; }
        if(count == "3"){ input_data = input_data3; }
        if(count == "4"){ input_data = input_data4; }
        if(count == "5"){ input_data = input_data5; }
        if(count == "6"){ input_data = input_data6; }
        if(count == "7"){ input_data = input_data7; }
        if(count == "8"){ input_data = input_data8; }
        if(count == "9"){ input_data = input_data9; }
        if(count == "10"){ input_data = input_data10; }
        if(count == "11"){ input_data = input_data11; }
        if(count == "12"){ input_data = input_data12; }

        mainFunc(count);
    }, [count])

    return (
        <>
            <h2 id="top3"></h2>
            <div id="ttlChart"></div>
        </>); 
}