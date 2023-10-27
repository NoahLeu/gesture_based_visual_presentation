import React, { useEffect, useRef, useState } from "react";
import useGestureRecognizer from "../GestureDetector/GestureDetector";

function CameraStream() {
	const gestureRecognizer = useGestureRecognizer();
	const videoRef = useRef();

	// useEffect(() => {
	// 	navigator.mediaDevices
	// 		.getUserMedia({ video: true })
	// 		.then((stream) => {
	// 			videoRef.current.srcObject = stream;

	// 			const recognizeGestures = async () => {
	// 				try {
	// 					const gestureRecognitionResult =
	// 						gestureRecognizer.recognizeForVideo(videoRef.current);
	// 					console.log(gestureRecognitionResult);
	// 					// Process the gestureRecognitionResult as needed
	// 				} catch (error) {
	// 					console.error("Error recognizing gestures:", error);
	// 				}
	// 			};

	// 			// Start recognizing gestures
	// 			recognizeGestures();

	// 			// Clean up when the component unmounts
	// 			// return () => {
	// 			// 	// Stop or clean up any ongoing gesture recognition if needed
	// 			// };
	// 		})
	// 		.catch((err) => {
	// 			console.error(err);
	// 		});
	// }, []);

	return (
		<div className="w-full h-full flex justify-center items-center bg-gray-900 relative overflow-hidden">
			<video
				ref={videoRef}
				className="absolute w-1/2 h-1/2 object-cover"
				autoPlay
			/>
		</div>
	);
}

export default CameraStream;
