import * as d3 from "d3";
import { scaleLinear } from "d3";
import { useRef, useEffect, useState} from 'react';
import input_data from "./sek_data/cities.csv";


function Scatter() {
    
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
    
    const color = "#8ecad1";

    const [data, setdata] = useState();
    const svgRef = useRef();

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

    useEffect(() => {

        const svg = d3.select(svgRef.current)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");

        d3.csv(input_data).then(function(data) {
            setdata(data);
        

        const xScale = d3.scaleLinear()
            .domain([0, 27000])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));


        const yScale = scaleLinear()
            .domain([250, 0])
            .range([0, height]);
        svg.append("g")
            .call(d3.axisLeft(yScale))
            .text();

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


           svg.append('g')
             .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return xScale(d.p_d); } )
            .attr("cy", function (d) { return yScale(d.rental); } )
            .attr("r", 7)
            .style("fill", color)
            .style("opacity", 1)
            .style("stroke", "white")
            .on("click", function() {
                console.log("abc");
            })
            .on("mouseover", function(evt, i) {
                    console.log("mouse over");
                    tooltip.style("visibility", "visible");
                })
                .on("mousemove", function(event, d){
                    console.log("mouse move");
                    tooltip.transition()
                
         .duration(200)
         .style("opacity", .9)
         ;
                    tooltip
                        .style("top", (event.pageY-10)+"px")
                        .style("left",(event.pageX+10)+"px")
                        .html(
                            d.region +"<br/>"  + d.rental);
                })
                .on("mouseout", function() {
                        tooltip.html("").style("visibility", "hidden");
                        d3.select(this).style("fill", color);
                    });
            
                svg.append("text")
                    .attr("transform", "translate(" + (width/2) + " ," + (height+30) + ")")
                    .style("text-anchor", "middle")
                    .text("구별 인구 밀도"); 
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("x", -(height/2))
                    .attr("y", 15)
                    .style("text-anchor", "middle")
                    .text("대여소 개수");
        });
    }, []);

    return (
    <>
        <div>
            <svg ref={svgRef} width={1000} height={650}>
            </svg> 
        </div>
    </>
    );


}

export default Scatter;