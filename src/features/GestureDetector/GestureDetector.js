import {
	GestureRecognizer,
	FilesetResolver,
	DrawingUtils,
} from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";

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
			});
			setGestureRecognizer(recognizer);
		};

		createGestureRecognizer();
	}, [runningMode]); // Run when runningMode changes

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

	let lastVideoTime = -1;

	async function predictWebcam() {
		const webcamElement = videoRef.current;
		if (runningMode === "IMAGE") {
			setRunningMode("VIDEO");
			await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
		}
		let nowInMs = Date.now();
		let tempResults = null;
		// if (webcamElement.currentTime !== lastVideoTime) {
		lastVideoTime = webcamElement.currentTime;
		const predictionResults = gestureRecognizer.recognizeForVideo(
			webcamElement,
			nowInMs
		);

		console.log(predictionResults);

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

		canvasRef.current.style.height = window.innerHeight / 2 + "px";
		webcamElement.style.height = window.innerHeight / 2 + "px";
		canvasRef.current.style.width = window.innerWidth / 2 + "px";
		webcamElement.style.width = window.innerWidth / 2 + "px";

		if (!tempResults) {
			return;
		}

		if (tempResults.landmarks) {
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
