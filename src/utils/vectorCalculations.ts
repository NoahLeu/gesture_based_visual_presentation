import { Point } from "../types/point";

export function calculateNormalVector(
	point1: Point,
	point2: Point,
	point3: Point
) {
	const vector1 = {
		x: point1.x - point2.x,
		y: point1.y - point2.y,
		z: point1.z - point2.z,
	};
	const vector2 = {
		x: point3.x - point2.x,
		y: point3.y - point2.y,
		z: point3.z - point2.z,
	};

	const normalVector = {
		x: vector1.y * vector2.z - vector1.z * vector2.y,
		y: vector1.z * vector2.x - vector1.x * vector2.z,
		z: vector1.x * vector2.y - vector1.y * vector2.x,
	};

	return normalVector;
}

export function calculateCenterPoint(
	point1: Point,
	point2: Point,
	point3: Point
) {
	const centerPoint = {
		x: (point1.x + point2.x + point3.x) / 3,
		y: (point1.y + point2.y + point3.y) / 3,
		z: (point1.z + point2.z + point3.z) / 3,
	};

	return centerPoint;
}

export function calculatePointAwayFromPlane(
	point1: Point,
	point2: Point,
	point3: Point,
	distance: number
) {
	const normalVector = calculateNormalVector(point1, point2, point3);
	const centerPoint = calculateCenterPoint(point1, point2, point3);

	const pointOnPlane = {
		x: centerPoint.x + normalVector.x * distance,
		y: centerPoint.y + normalVector.y * distance,
		z: centerPoint.z + normalVector.z * distance,
	};

	return pointOnPlane;
}
