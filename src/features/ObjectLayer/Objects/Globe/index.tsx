import { RefObject, useEffect } from "react";
import world_json from "./world.json";
import { ModelProps } from "../../index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const drawGlobe = (
	nodeRef: RefObject<HTMLDivElement>,
	objectRotationX: number,
	objectRotationY: number,
	drawModel: any
) => {
	if (!nodeRef.current) {
		return;
	}

	const width = nodeRef.current.clientWidth;
	const height = nodeRef.current.clientHeight;
	const { map, path } = drawModel(
		nodeRef,
		width,
		height,
		objectRotationX,
		objectRotationY
	);

	map
		.append("g")
		.attr("class", "countries")
		.selectAll("path")
		.data(world_json.features)
		.enter()
		.append("path")
		.attr("class", (d: any) => "country_" + d.properties.name.replace(" ", "_"))
		.attr("d", path) // Use the projection for path creation
		.attr("fill", "white")
		.style("stroke", "black")
		.style("stroke-width", 0.3)
		.style("opacity", 0.8)
		// @ts-ignore
		.on("click", (event, d) => {
			// This function will be executed when a country is clicked
			// 'd' contains the data of the clicked country
			toast("You clicked on country: " + d.properties.name);
			// console.log("You clicked on country: ", d.properties.name);
		});
};

export default function Globe({
	objectPosition,
	objectZoom,
	objectRotationX,
	objectRotationY,
	nodeRef,
	drawModel,
}: ModelProps) {
	useEffect(() => {
		if (nodeRef.current) {
			drawGlobe(nodeRef, objectRotationX, objectRotationY, drawModel);
		}
	}, [nodeRef, objectRotationX, objectRotationY]);

	return (
		<>
			<div
				id="map"
				ref={nodeRef}
				className="absolute z-30"
				style={{
					// objetPosition as bottom side of div
					top: objectPosition.y * 100 + "%",
					right: objectPosition.x * 100 + "%",
					transform: `translate(50%, -50%) scale(${objectZoom / 100})`,
					transformOrigin: "center",
					width: "200px",
					height: "200px",
					// animate transform changes
					transition: "all 0.12s ease-in-out",
				}}
			/>
			<ToastContainer />
		</>
	);
}
