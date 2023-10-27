import {
	GestureRecognizer,
	FilesetResolver,
	DrawingUtils,
} from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";

function calculateNormalVector(point1, point2, point3) {
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

function calculateCenterPoint(point1, point2, point3) {
	const centerPoint = {
		x: (point1.x + point2.x + point3.x) / 3,
		y: (point1.y + point2.y + point3.y) / 3,
		z: (point1.z + point2.z + point3.z) / 3,
	};

	return centerPoint;
}

function calculatePointAwayFromPlane(point1, point2, point3, distance) {
	const normalVector = calculateNormalVector(point1, point2, point3);
	const centerPoint = calculateCenterPoint(point1, point2, point3);

	const pointOnPlane = {
		x: centerPoint.x + normalVector.x * distance,
		y: centerPoint.y + normalVector.y * distance,
		z: centerPoint.z + normalVector.z * distance,
	};

	return pointOnPlane;
}

function getHandDirection(handLandmarks, switchSide = false) {
	// get landmarks 0, 5, 17 for palm
	const palmLandmarks = [handLandmarks[0], handLandmarks[5], handLandmarks[17]];

	const pointOnPalm = calculateCenterPoint(
		palmLandmarks[0],
		palmLandmarks[1],
		palmLandmarks[2]
	);

	// get point on palm plane
	const pointAwayFromPlane = calculatePointAwayFromPlane(
		palmLandmarks[0],
		palmLandmarks[1],
		palmLandmarks[2],
		switchSide ? -10 : 10
	);

	return {
		pointOnPalm,
		pointAwayFromPlane,
	};
}

const useGestureRecognition = () => {
	const [gestureRecognizer, setGestureRecognizer] = useState(null);
	const [results, setResults] = useState(null);
	const [runningMode, setRunningMode] = useState("VIDEO");
	const [webcamRunning, setWebcamRunning] = useState(false);

	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const gestureOutputRef = useRef(null);

	useEffect(() => {
		const createGestureRecognizer = async () => {
			const vision = await FilesetResolver.forVisionTasks(
				"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
			);
			const recognizer = await GestureRecognizer.createFromOptions(vision, {
				baseOptions: {
					modelAssetPath: "/models/gesture_recognizer.task",
					delegate: "GPU",
				},
				runningMode: runningMode,
				numHands: 2,
				minHandDetectionConfidence: 0.5,
				minDetectionConfidence: 0.5,
			});
			setGestureRecognizer(recognizer);
		};

		createGestureRecognizer();
	}, [runningMode]); // Run when runningMode changes

	const drawDirection = (pointOnPalm, pointAwayFromPlane) => {
		const canvasCtx = canvasRef.current.getContext("2d");
		canvasCtx.beginPath();
		canvasCtx.moveTo(
			pointOnPalm.x * canvasCtx.canvas.width,
			pointOnPalm.y * canvasCtx.canvas.height
		);
		canvasCtx.lineTo(
			pointAwayFromPlane.x * canvasCtx.canvas.width,
			pointAwayFromPlane.y * canvasCtx.canvas.height
		);
		canvasCtx.lineWidth = 5;
		canvasCtx.strokeStyle = "#0000FF";
		canvasCtx.stroke();
		canvasCtx.closePath();
	};

	const enableCam = (event) => {
		if (!gestureRecognizer) {
			alert("Please wait for gestureRecognizer to load");
			return;
		}

		if (webcamRunning) {
			return;
		}

		const constraints = {
			video: true,
		};

		navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
			videoRef.current.srcObject = stream;
			videoRef.current.addEventListener("loadeddata", predictWebcam);
		});
	};

	// let lastVideoTime = -1;

	async function predictWebcam() {
		const webcamElement = videoRef.current;
		if (runningMode === "IMAGE") {
			setRunningMode("VIDEO");
			await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
		}
		let nowInMs = Date.now();
		let tempResults = null;
		// if (webcamElement.currentTime !== lastVideoTime) {
		// lastVideoTime = webcamElement.currentTime;
		const predictionResults = gestureRecognizer.recognizeForVideo(
			webcamElement,
			nowInMs
		);

		tempResults = predictionResults;

		setResults(predictionResults);
		// }

		const canvasCtx = canvasRef.current.getContext("2d");
		canvasCtx.save();
		canvasCtx.clearRect(
			0,
			0,
			canvasRef.current.width,
			canvasRef.current.height
		);
		const drawingUtils = new DrawingUtils(canvasCtx);

		canvasRef.current.style.height =
			document.getElementById("webcam").offsetHeight + "px";
		canvasRef.current.style.width =
			document.getElementById("webcam").offsetWidth + "px";
		// canvasRef.current.style.height = window.innerHeight / 2 + "px";
		// webcamElement.style.height = window.innerHeight / 2 + "px";
		// canvasRef.current.style.width = window.innerWidth / 2 + "px";
		// webcamElement.style.width = window.innerWidth / 2 + "px";

		if (!tempResults) {
			return;
		}

		if (tempResults.landmarks && tempResults.landmarks.length > 0) {
			for (const landmarks of tempResults.landmarks) {
				drawingUtils.drawConnectors(
					landmarks,
					GestureRecognizer.HAND_CONNECTIONS,
					{
						color: "#00FF00",
						lineWidth: 5,
					}
				);
				drawingUtils.drawLandmarks(landmarks, {
					color: "#FF0000",
					lineWidth: 2,
				});
			}

			for (let i = 0; i < tempResults.handednesses.length; i++) {
				const { pointOnPalm, pointAwayFromPlane } = getHandDirection(
					tempResults.landmarks[i],
					tempResults.handednesses[i][0].categoryName === "Left" ? true : false
				);

				drawDirection(pointOnPalm, pointAwayFromPlane);
			}
		}
		canvasCtx.restore();
		if (tempResults.gestures.length > 0) {
			gestureOutputRef.current.style.display = "block";
			gestureOutputRef.current.style.width = webcamElement.width + "px";
			const categoryName = tempResults.gestures[0][0].categoryName;
			const categoryScore = parseFloat(
				tempResults.gestures[0][0].score * 100
			).toFixed(2);
			const handedness = tempResults.handednesses[0][0].displayName;
			gestureOutputRef.current.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %\n Handedness: ${handedness}`;
		} else {
			gestureOutputRef.current.style.display = "none";
		}

		window.requestAnimationFrame(predictWebcam);
	}

	return {
		videoRef,
		canvasRef,
		gestureOutputRef,
		enableCam,
		// handleClick,
	};
};

// modelAssetPath: "/models/gesture_recognizer.task",

export default useGestureRecognition;
