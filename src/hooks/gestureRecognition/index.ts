import {
	GestureRecognizer,
	FilesetResolver,
	DrawingUtils,
} from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";
import { Point } from "../../types/point";
import {
	calculateCenterPoint,
	calculatePointAwayFromPlane,
} from "../../utils/vectorCalculations";
import { gestureConfig } from "../../config/gestureConfig";

type RunningMode = "IMAGE" | "VIDEO";

const handToMirroredHand = (hand: string) => {
	switch (hand) {
		case "Left":
			return "Right";
		case "Right":
			return "Left";
		default:
			return "Both";
	}
};

function getHandDirection(handLandmarks: any[], switchSide = false) {
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

	const angle = Math.atan2(
		pointAwayFromPlane.y - pointOnPalm.y,
		pointAwayFromPlane.x - pointOnPalm.x
	);

	return {
		angle,
		pointOnPalm,
		pointAwayFromPlane,
	};
}

const useGestureRecognition = () => {
	const [hasRecognizerLoaded, setHasRecognizerLoaded] =
		useState<boolean>(false);
	const [gestureRecognizer, setGestureRecognizer] =
		useState<GestureRecognizer | null>(null);
	const [results, setResults] = useState<any>(null);
	const [runningMode, setRunningMode] = useState<RunningMode>("VIDEO");
	const [webcamRunning, setWebcamRunning] = useState<boolean>(false);
	const [objectPosition, setObjectPosition] = useState({
		x: 0,
		y: 0,
		z: 0,
		angle: 0,
	});
	const [gestureDetectionOutputLeft, setGestureDetectionOutputLeft] =
		useState<string>("None");
	const [gestureDetectionOutputRight, setGestureDetectionOutputRight] =
		useState<string>("None");

	const [objectZoom, setObjectZoom] = useState<number>(100);
	const [objectRotationX, setObjectRotationX] = useState<number>(0);
	const [objectRotationY, setObjectRotationY] = useState<number>(0);

	const videoRef = useRef<HTMLVideoElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const gestureOutputRef = useRef<HTMLParagraphElement | null>(null);

	useEffect(() => {
		const createGestureRecognizer = async () => {
			const vision = await FilesetResolver.forVisionTasks(
				"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
			);
			const recognizer = await GestureRecognizer.createFromOptions(vision, {
				baseOptions: {
					// modelAssetPath: "/models/gesture_recognizer.task",
					modelAssetPath:
						"https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
					delegate: "GPU",
				},
				runningMode: runningMode,
				numHands: 2,
				minHandDetectionConfidence: 0.5,
				minHandPresenceConfidence: 0.5,
			});
			setGestureRecognizer(recognizer);
		};

		createGestureRecognizer();
	}, [runningMode]); // Run when runningMode changes

	const drawDirection = (pointOnPalm: Point, pointAwayFromPlane: Point) => {
		if (!canvasRef.current) {
			return;
		}

		const canvasCtx = canvasRef.current.getContext("2d");

		if (!canvasCtx) {
			return;
		}

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

	const enableCam = () => {
		if (!gestureRecognizer) {
			alert("Please wait for gestureRecognizer to load");
			return;
		}

		if (webcamRunning) {
			console.log("webcam already running");
			return;
		}

		const constraints = {
			video: true,
		};

		navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
			if (!videoRef.current) {
				return;
			}

			videoRef.current.srcObject = stream;
			videoRef.current.addEventListener("loadeddata", startImageRecognition);
		});
	};

	async function startImageRecognition() {
		setHasRecognizerLoaded(true);
		predictWebcam();
	}

	// let lastVideoTime = -1;

	async function predictWebcam() {
		if (!gestureRecognizer || !videoRef.current || !canvasRef.current) {
			// wait for gestureRecognizer to load
			requestAnimationFrame(predictWebcam);
			return;
		}

		const webcamElement = videoRef.current;
		if (runningMode === "IMAGE") {
			setRunningMode("VIDEO");
			await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
		}
		let nowInMs = Date.now();
		let tempResults = null;
		const predictionResults = gestureRecognizer.recognizeForVideo(
			webcamElement,
			nowInMs
		);

		tempResults = predictionResults;

		setResults(predictionResults);

		const canvasCtx = canvasRef.current.getContext("2d");

		if (!canvasCtx) {
			requestAnimationFrame(predictWebcam);
			return;
		}

		canvasCtx.save();
		canvasCtx.clearRect(
			0,
			0,
			canvasRef.current.width,
			canvasRef.current.height
		);
		const drawingUtils = new DrawingUtils(canvasCtx);

		canvasRef.current.style.height =
			document.getElementById("webcam")!.offsetHeight + "px";
		canvasRef.current.style.width =
			document.getElementById("webcam")!.offsetWidth + "px";

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

			for (let i = 0; i < tempResults.handedness.length; i++) {
				const { pointOnPalm, pointAwayFromPlane, angle } = getHandDirection(
					tempResults.landmarks[i],
					tempResults.handedness[i][0].categoryName === "Left" ? true : false
				);

				// drawDirection(pointOnPalm, pointAwayFromPlane);

				if (
					tempResults.handedness[i][0].categoryName ===
						handToMirroredHand(gestureConfig.interactions.move.hand) &&
					tempResults.handedness[i][0].score >
						(gestureConfig.interactions.move.confidence ?? 0.7) &&
					tempResults.gestures.length > 0 &&
					tempResults.gestures[0][0].categoryName ===
						gestureConfig.interactions.move.gesture
				) {
					// setObjectPosition({
					// 	x: pointAwayFromPlane.x,
					// 	y: pointAwayFromPlane.y,
					// 	z: pointAwayFromPlane.z,
					// 	angle,
					// });
					setObjectPosition({
						x: pointOnPalm.x,
						y: pointOnPalm.y,
						z: pointOnPalm.z,
						angle,
					});
				}

				// TODO: make this not depend on the zoom in hand to be the same as the zoom out hand
				if (
					tempResults.handedness[i][0].categoryName ===
						handToMirroredHand(gestureConfig.interactions.zoom_in.hand) &&
					tempResults.handedness[i][0].score >
						(gestureConfig.interactions.zoom_in.confidence ?? 0.7) &&
					tempResults.gestures.length > 0
				) {
					if (
						tempResults.gestures[0][0].categoryName ===
						gestureConfig.interactions.zoom_in.gesture
					) {
						setObjectZoom((objectZoom) => objectZoom + 5);
					}

					if (
						tempResults.gestures[0][0].categoryName ===
						gestureConfig.interactions.zoom_out.gesture
					) {
						setObjectZoom((objectZoom) =>
							objectZoom - 5 > 10 ? objectZoom - 5 : 10
						);
					}
				}

				if (
					tempResults.handedness[i][0].categoryName ===
						handToMirroredHand(
							gestureConfig.interactions.rotate_x_positive.hand
						) &&
					tempResults.handedness[i][0].score >
						(gestureConfig.interactions.rotate_x_positive.confidence ?? 0.7) &&
					tempResults.gestures.length > 0
				) {
					if (
						tempResults.gestures[0][0].categoryName ===
						gestureConfig.interactions.rotate_x_positive.gesture
					) {
						setObjectRotationX((objectRotationX) => objectRotationX + 10);
					}

					if (
						tempResults.gestures[0][0].categoryName ===
						gestureConfig.interactions.rotate_x_negative.gesture
					) {
						setObjectRotationX((objectRotationX) => objectRotationX - 10);
					}
				}

				if (
					tempResults.handedness[i][0].categoryName ===
						handToMirroredHand(
							gestureConfig.interactions.rotate_y_positive.hand
						) &&
					tempResults.handedness[i][0].score >
						(gestureConfig.interactions.rotate_y_positive.confidence ?? 0.7) &&
					tempResults.gestures.length > 0
				) {
					if (
						tempResults.gestures[0][0].categoryName ===
						gestureConfig.interactions.rotate_y_positive.gesture
					) {
						setObjectRotationY((objectRotationY) => objectRotationY + 10);
					}

					if (
						tempResults.gestures[0][0].categoryName ===
						gestureConfig.interactions.rotate_y_negative.gesture
					) {
						setObjectRotationY((objectRotationY) => objectRotationY - 10);
					}
				}
			}
		}
		canvasCtx.restore();

		if (tempResults.gestures.length === 0) {
			setGestureDetectionOutputLeft((_prev) => "None");
			setGestureDetectionOutputRight((_prev) => "None");
		}

		if (tempResults.gestures.length > 0 && gestureOutputRef.current) {
			if (tempResults.gestures.length === 1) {
				if (tempResults.handedness[0][0].categoryName === "Left") {
					let newGesture = tempResults.gestures[0][0].categoryName;
					if (
						gestureDetectionOutputLeft !== newGesture ||
						newGesture === "None"
					) {
						setGestureDetectionOutputLeft((_prev) => newGesture);
					}
					if (gestureDetectionOutputRight !== "None") {
						setGestureDetectionOutputRight((_prev) => "None");
					}
				}

				if (tempResults.handedness[0][0].categoryName === "Right") {
					let newGesture = tempResults.gestures[0][0].categoryName;
					if (
						gestureDetectionOutputRight !== newGesture ||
						newGesture === "None"
					) {
						setGestureDetectionOutputRight((_prev) => newGesture);
					}
					if (gestureDetectionOutputLeft !== "None") {
						setGestureDetectionOutputLeft((_prev) => "None");
					}
				}
			}

			if (tempResults.gestures.length === 2) {
				for (let i = 0; i < tempResults.gestures.length; i++) {
					const gesture = tempResults.gestures[i][0];

					if (tempResults.handedness[i][0].categoryName === "Left") {
						let newGesture = gesture.categoryName;
						if (gestureDetectionOutputLeft !== newGesture) {
							setGestureDetectionOutputLeft((_prev) => newGesture);
						}
					}

					if (tempResults.handedness[i][0].categoryName === "Right") {
						let newGesture = gesture.categoryName;
						if (gestureDetectionOutputRight !== newGesture) {
							setGestureDetectionOutputRight((_prev) => newGesture);
						}
					}
				}
			}

			gestureOutputRef.current.style.display = "block";
			// gestureOutputRef.current.style.width = webcamElement.width + "px";
			const categoryName = tempResults.gestures[0][0].categoryName;
			const categoryScore = parseFloat(
				tempResults.gestures[0][0].score * 100 + ""
			).toFixed(2);
			const handedness = tempResults.handedness[0][0].displayName;
			gestureOutputRef.current.innerText = `Gesture: ${categoryName}\n Confidence: ${categoryScore}%\n Hand: ${handedness}`;
		} else {
			if (!gestureOutputRef.current) {
				return;
			}

			gestureOutputRef.current.innerText = `Gesture: None\n Confidence: 100%\n Hand: None`;
		}

		window.requestAnimationFrame(predictWebcam);
	}

	return {
		videoRef,
		canvasRef,
		gestureOutputRef,
		gestureDetectionOutputLeft,
		gestureDetectionOutputRight,
		hasRecognizerLoaded,
		hasEnvironmentLoaded: gestureRecognizer !== null,
		enableCam,
		objectPosition,
		objectZoom,
		objectRotationX,
		objectRotationY,
	};
};

export default useGestureRecognition;
