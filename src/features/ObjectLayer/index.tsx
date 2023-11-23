import * as d3 from "d3";
import {useModelState} from "../../context";
import {RefObject, useRef} from "react";

export type ObjectLayerProps = {
    objectPosition: { x: number; y: number; z: number; angle: number };
    objectZoom: number;
    objectRotationX: number;
    objectRotationY: number;
};

export interface ModelProps {
    objectPosition: { x: number; y: number; z: number; angle: number };
    objectZoom: number;
    objectRotationX: number;
    objectRotationY: number;
    nodeRef: RefObject<HTMLDivElement>;
    drawModel: any;
}

export interface IDrawModel {
    map: d3.Selection<SVGGElement, unknown, null, undefined>;
    path: d3.GeoPath<any, d3.GeoPermissibleObjects>;
}

const setupMap = (nodeRef: RefObject<HTMLDivElement>, width: number, height: number) => {
    const svg = d3
        .select(nodeRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    return svg.append("g");
}

const configureProjection = (width: number, height: number, objectRotationY: number, objectRotationX: number) => {
    const projection = d3
        .geoOrthographic()
        .scale(100)
        .center([0, 0])
        .rotate([objectRotationX, objectRotationY])
        .translate([width / 2, height / 2]);

    let path: any = d3.geoPath().projection(projection);
    return path;
}

const drawModel = (
    nodeRef: RefObject<HTMLDivElement>,
    width: number,
    height: number,
    objectRotationX: number,
    objectRotationY: number
): IDrawModel => {
    const path = configureProjection(width, height, objectRotationX, objectRotationY);
    d3.select(nodeRef.current).selectAll("*").remove();
    const map = setupMap(nodeRef, width, height);

    return {map, path};
};


export default function ObjectLayer({
                                        objectPosition,
                                        objectZoom,
                                        objectRotationX,
                                        objectRotationY,
                                    }: ObjectLayerProps) {
    const {modelVisibility, currentModelIndex, availableModels} = useModelState();
    const nodeRef = useRef<HTMLDivElement>(null);
    let CurrentModel = availableModels[currentModelIndex];

    return (
        <div className="w-full h-full absolute z-20">
            {modelVisibility && (
                <CurrentModel
                    objectPosition={objectPosition}
                    objectZoom={objectZoom}
                    objectRotationX={objectRotationX}
                    objectRotationY={objectRotationY}
                    nodeRef={nodeRef}
                    drawModel={drawModel}
                />
            )}
        </div>
    );
}
