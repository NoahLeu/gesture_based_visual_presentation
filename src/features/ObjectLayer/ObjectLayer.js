import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import world_json from "./world.json";

function ObjectLayer({ objectPosition, objectZoom }) {
	const nodeRef = useRef(null);

	useEffect(() => {
		const width = nodeRef.current.clientWidth;
		const height = nodeRef.current.clientHeight;
		const sensitivity = 75;

		const projection = d3
			.geoOrthographic()
			.scale(100)
			.center([0, 0])
			.rotate([0, -30])
			.translate([width / 2, height / 2]);

		const initialScale = projection.scale();
		let path = d3.geoPath().projection(projection);

		// clenaup
		d3.select(nodeRef.current).selectAll("*").remove();

		const svg = d3
			.select(nodeRef.current)
			.append("svg")
			.attr("width", width)
			.attr("height", height);

		const globe = svg
			.append("circle")
			.attr("fill", "#EEE")
			.attr("stroke", "#000")
			.attr("stroke-width", "0.2")
			.attr("cx", width / 2)
			.attr("cy", height / 2)
			.attr("r", initialScale);

		// svg
		// 	.call(
		// 		d3.drag().on("drag", () => {
		// 			const rotate = projection.rotate();
		// 			const k = sensitivity / projection.scale();
		// 			projection.rotate([
		// 				rotate[0] + d3.event.dx * k,
		// 				rotate[1] - d3.event.dy * k,
		// 			]);
		// 			path = d3.geoPath().projection(projection);
		// 			svg.selectAll("path").attr("d", path);
		// 		})
		// 	)
		// 	.call(
		// 		d3.zoom().on("zoom", () => {
		// 			if (d3.event.transform.k > 0.3) {
		// 				projection.scale(initialScale * d3.event.transform.k);
		// 				path = d3.geoPath().projection(projection);
		// 				svg.selectAll("path").attr("d", path);
		// 				globe.attr("r", projection.scale());
		// 			} else {
		// 				d3.event.transform.k = 0.3;
		// 			}
		// 		})
		// 	);

		const map = svg.append("g");

		map
			.append("g")
			.attr("class", "countries")
			.selectAll("path")
			.data(world_json.features)
			.enter()
			.append("path")
			.attr("class", (d) => "country_" + d.properties.name.replace(" ", "_"))
			.attr("d", path)
			.attr("fill", "white")
			.style("stroke", "black")
			.style("stroke-width", 0.3)
			.style("opacity", 0.8);

		// Optional rotation
		d3.timer(function (elapsed) {
			const rotate = projection.rotate();
			const k = sensitivity / projection.scale();
			projection.rotate([rotate[0] - 1 * k, rotate[1]]);
			path = d3.geoPath().projection(projection);
			svg.selectAll("path").attr("d", path);
		}, 200);
	}, []);

	return (
		<>
			<div
				id="map"
				ref={nodeRef}
				className="absolute z-10"
				style={{
					// objetPosition as bottom side of div
					top: objectPosition.y * 100 + "%",
					right: objectPosition.x * 100 + "%",
					scale: objectZoom + "%",
					// translate position
					// transition: "top 0.2s, right 0.1s",
					// center and mirror
					transform: "translate(50%, -50%) rotateY(180deg)",
					width: "200px",
					height: "200px",
				}}
			></div>
		</>
	);
}

export default ObjectLayer;
