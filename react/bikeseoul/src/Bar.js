import * as d3 from "d3";
import { useRef, useEffect, useState } from 'react';
import input_data from "./sek_data/year_classify_gender.csv";

/* 완성본 */
export default function Bar({month}) {
    var margin = {top: 200, right: 200, bottom: 200, left: 200},
    width = 800 - margin.left/2 - margin.right/2,
    height = 800 - margin.top/2 - margin.bottom/2;

    const color = "#8ecad1";
    const color_high = "#f6d560";

    const [data, setdata] = useState();
    const svgRef = useRef();


    useEffect(() => {

        const svg = d3.select(svgRef.current);

        d3.csv(input_data).then(function(data) {
        
            setdata(data);
            
            const xScale = d3
                .scaleBand()
                .domain(data.map(function(d){return d.years;}))
                .range([0, width+200])
                .padding(0.6);
            
           const yScale = d3
                .scaleLinear()
                .domain([0, 50000])
                .range([height, 0]);
            
            const xAxis = d3.axisBottom(xScale).ticks(data.length);
            svg.select('.x-axis').style('transform', 'translateY(600px)').call(xAxis);
            const yAxis = d3.axisRight(yScale);
            svg.select('.y-axis').style("transform", "translateX(0px)").call(yAxis);
        

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
                .attr("x", function(d){ return xScale(d.years);}) // x축 값
                .attr("y", function(d){ return yScale(d.F);}) // y축 값
                .attr("width", xScale.bandwidth()) // 막대그래프 가로
                .attr("height", function(d){return height - yScale(d.F);})
                .on("mouseover", function(evt, i) {
                    tooltip.style("visibility", "visible");
                })
                .on("mousemove", function(event, d){
                    console.log("mouse move");
                    tooltip
                        .html(d.years + " : " + d.F)
                        .style("top", (event.pageY-10)+"px")
                        .style("left",(event.pageX+10)+"px");
                })
                .on("mouseout", function() {
                    tooltip.html(``).style("visibility", "hidden");
                })
                .attr('fill', function(d) {return (d.sex === "female" ? color : color_high)});

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
        });
        
    }, []);
    
    return (
    <>
        <svg ref={svgRef} width={800} height={680}>
            <g className="x-axis"></g>
            <g className="y-axis"></g>
        </svg>
        
    </>
    );

}