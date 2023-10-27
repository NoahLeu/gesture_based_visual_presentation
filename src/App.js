import useGestureRecognition from "./features/GestureDetector/GestureDetector";

// function App() {
// 	return (
// 		<div className="w-screen h-screen overflow-hidden flex justify-center items-center">
// 			<CameraStream />
// 		</div>
// 	);
// }

// export default App;

const GestureDetectionApp = () => {
	const { videoRef, canvasRef, gestureOutputRef, enableCam } =
		useGestureRecognition();

	return (
		<div className="relative w-screen h-screen flex flex-col items-center justify-center bg-gray-800">
			<button
				id="webcamButton"
				className="absolute top-10 left-1/2 -translate-x-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				onClick={enableCam}
			>
				Enable webcam
			</button>
			<div className="relative w-1/2 h-1/2 flex justify-center items-center">
				<div className="w-full h-auto overflow-hidden flex items-center justify-center">
					<video
						id="webcam"
						style={{
							WebkitTransform: "rotateY(180deg)",
							transform: "rotateY(180deg)",
						}}
						className="w-full h-auto"
						ref={videoRef}
						autoPlay
						playsInline
					></video>
				</div>
				<canvas
					className="absolute"
					style={{
						WebkitTransform: "rotateY(180deg)",
						transform: "rotateY(180deg)",
					}}
					ref={canvasRef}
					width={videoRef.current ? videoRef.current.clientWidth : 0}
					height={videoRef.current ? videoRef.current.clientHeight : 0}
					// width={document && document.getElementById("webcam").offsetWidth}
					// height={ document ? document.getElementById("webcam").offsetHeight : window.innerHeight / 2}
				></canvas>
			</div>

			<div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-center">
				<p id="gesture_output" ref={gestureOutputRef} className="output"></p>
			</div>
		</div>
	);
};

export default GestureDetectionApp;
