import {RefObject, useEffect} from "react";
import world_json from "./world.json";
import {ModelProps} from "../../index";

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
    const {map, path} = drawModel(nodeRef, width, height, objectRotationX, objectRotationY);

    map.append('g')
        .attr('class', 'countries')
        .selectAll('path')
        .data(world_json.features)
        .enter()
        .append('path')
        .attr('class', (d: any) => 'country_' + d.properties.name.replace(' ', '_'))
        .attr('d', path) // Use the projection for path creation
        .attr('fill', 'black')
        .style('stroke', 'white')
        .style('stroke-width', 0.3)
        .style('opacity', 0.8);
};

export default function BlackGlobe({
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
        <div
            id="map"
            ref={nodeRef}
            className="absolute z-20"
            style={{
                // objetPosition as bottom side of div
                top: objectPosition.y * 100 + "%",
                right: objectPosition.x * 100 + "%",
                transform: `translate(50%, -50%) scale(${
                    objectZoom / 100
                }) rotateY(180deg)`,
                transformOrigin: "center",
                width: "200px",
                height: "200px",
            }}
        />
    );
}
