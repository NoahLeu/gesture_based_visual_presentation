import {RefObject, useEffect} from 'react';
import * as d3 from 'd3';
import {twoD_ModelProps} from "../../index";

const drawBarChart = (data: any[], nodeRef: RefObject<HTMLDivElement>) => {
    if (!nodeRef.current) {
        return;
    }

    // Clear the SVG
    d3.select(nodeRef.current).selectAll("svg").remove();

    const width = nodeRef.current.clientWidth;
    const height = nodeRef.current.clientHeight;
    const svg = d3.select(nodeRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * 70)
        .attr("y", (d, i) => height - d * 10)
        .attr("width", 65) // Adjust bar width to prevent overlap
        .attr("height", (d, i) => d * 10)
        .attr("fill", "green");

    // Add labels
    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text((d) => d)
        .attr("x", (d, i) => i * 70 + 65 / 2) // Center the text in the bar
        .attr("y", (d, i) => height - d * 10 - 5) // Position the text slightly above the bar
        .attr("text-anchor", "middle"); // Center the text horizontally
};

const BarChart = ({
                      objectPosition,
                      objectZoom,
                      nodeRef,
                  }: twoD_ModelProps) => {

    useEffect(() => {
        const data = [2, 4, 2, 6, 8];
        drawBarChart(data, nodeRef);
    }, []);

    return <div id="barChart"
                ref={nodeRef}
                className="absolute z-20"
                style={{
                    top: objectPosition.y * 100 + "%",
                    right: objectPosition.x * 100 + "%",
                    transform: `translate(50%, -50%) scale(${
                        objectZoom / 100
                    })`,
                    transformOrigin: "center",
                    width: "200px",
                    height: "200px",
                    backgroundColor: "#fff",
                }}/>;
};

export default BarChart;