import { useEffect, useRef, useState } from "react";
import CameraDisplay from "../CameraDisplay";
import useGestureRecognition from "../../hooks/gestureRecognition";
import ObjectLayer from "../ObjectLayer";
import Logo from "../Logo";
import ObjectSelectionCard from "../ObjectSelectionCard";
import { useModelState } from "../../context";

const customScrollIntoView = (id: string) => {
	const selectedObjectElement = document.getElementById(id);
	if (selectedObjectElement) {
		selectedObjectElement.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "start",
		});
	}
};

export default function PresentationScreen() {
	const {
		videoRef,
		canvasRef,
		gestureOutputRef,
		gestureDetectionOutputLeft,
		hasRecognizerLoaded,
		hasEnvironmentLoaded,
		enableCam,
		objectPosition,
		objectZoom,
		objectRotationX,
		objectRotationY,
	} = useGestureRecognition();

	const [showTrackingInformation, setShowTrackingInformation] =
		useState<boolean>(true);
	const [hasStartedLoadingPresentation, setHasStartedLoadingPresentation] =
		useState<boolean>(false);
	const gestureTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const { modelVisibility, setModelVisibility, setCurrentModelIndex, currentModelIndex, availableModels } = useModelState();

	const handleStartPresentation = () => {
		setHasStartedLoadingPresentation(true);
		enableCam();
	};

	useEffect(() => {
		if (
			!hasRecognizerLoaded &&
			!hasStartedLoadingPresentation &&
			!hasEnvironmentLoaded
		) {
			return;
		}

		// If the gesture changes and a timeout was already set, clear it
		if (gestureTimeoutRef.current) {
			clearTimeout(gestureTimeoutRef.current);
		}

		if (gestureDetectionOutputLeft === "Victory") {
			// Set a new timeout
			gestureTimeoutRef.current = setTimeout(() => {
				// This function will run after 2 seconds
				// Toggle the view only if the currentGesture has not changed
				setShowTrackingInformation((prev) => !prev);
			}, 2000);
		}

		// Cleanup function to clear timeout when the component unmounts
		return () => {
			if (gestureTimeoutRef.current) {
				clearTimeout(gestureTimeoutRef.current);
			}
		};
	}, [gestureDetectionOutputLeft]);

	const handleNextModel = () => {
		if (currentModelIndex !== availableModels.length - 1) {
			setCurrentModelIndex(currentModelIndex + 1);
			customScrollIntoView(getModelName(currentModelIndex));
		} else {
			setCurrentModelIndex(0);
			customScrollIntoView(getModelName(0));
		};
	};

	const handlePreviousModel = () => {
		if (currentModelIndex !== 0) {
			setCurrentModelIndex(currentModelIndex - 1);
			customScrollIntoView(getModelName(currentModelIndex));
		} else {
			setCurrentModelIndex(availableModels.length - 1);
			customScrollIntoView(getModelName(availableModels.length - 1));
		};
	};

	const handleSelectModel = (index: number) => {
		setCurrentModelIndex(index);
		customScrollIntoView(getModelName(index));
	};

	const getModelName = (index: number) => {
		return `model-${index}`;
	};

	const renderObjectSelection = () => {
		return availableModels.map((model, index) => {
			return (
				<ObjectSelectionCard
					id={`model-${index}`}
					isActive={index === currentModelIndex}
					selectObject={() => handleSelectModel(index)}
					name={availableModels[index].name}
					src="/3d-cube.png"
				/>
			);
		});
	}

	return (
		<div className="w-screen h-screen overflow-hidden grid grid-cols-5 items-center justify-center bg-primary">
			{hasEnvironmentLoaded ? (
				<>
					{/* side bar */}
					<div className=" relative col-span-1 grid grid-cols-1 grid-rows-5 grid-flow-row gap-y-6 items-center justify-between bg-accent h-full max-h-full overflow-y-scroll p-6">
						{/* model selection */}
						<div className="w-full flex flex-col row-span-4 max-h-full gap-y-4">
							<div className="w-full flex items-center justify-between">
								<h2 className="text-primary text-lg font-bold">
									Select Model to display
								</h2>
								<div className="w-fit flex justify-between gap-x-4">
									<button
										className="btn-secondary"
										onClick={handlePreviousModel}
									>
										&lt;
									</button>
									<button className="btn-secondary" onClick={handleNextModel}>
										&gt;
									</button>
								</div>
							</div>
							<div className="w-full flex flex-col overflow-y-scroll max-h-full gap-y-4">
								{renderObjectSelection()}
							</div>
						</div>

						<div className="relative w-full row-span-1 bg-primary flex flex-col rounded-xl shadow-lg items-start justify-start transition-all duration-200 ease-in-out p-6 max-h-full h-full overflow-y-scroll">
							<span className="w-full text-lg text-white font-bold">
								Gesture Meta Data
							</span>
							<p
								id="gesture_output"
								ref={gestureOutputRef}
								className="text-white w-full text-sm"
							></p>
						</div>
					</div>
					{/* main presentation view */}
					<div className="col-span-4 flex flex-col items-start justify-start w-2/3 h-full mx-auto">
						{/* top bar */}
						<div className="w-full flex items-center justify-center py-6">
							<Logo
								className="h-14
						"
							/>
						</div>
						<div className="w-full flex gap-x-10 justify-center items-center pb-2 pt-6">
							{/* Controls */}
							<button className="btn-primary" onClick={handleStartPresentation}>
								Start Presentation
							</button>
							<button
								className="btn-primary"
								onClick={() => setModelVisibility(!modelVisibility)}
							>
								{ modelVisibility ? "Hide Model" : "Show Model"}
							</button>
							<button
								className="btn-primary"
								// onClick={handleStartPresentation}
							>
								Stop Presentation
							</button>
						</div>
						{/* Presentation View */}
						<div className="relative my-auto w-full flex items-center justify-center aspect-video overflow-hidden rounded-lg">
							{!hasRecognizerLoaded && hasStartedLoadingPresentation && (
								<div className="w-full h-auto overflow-hidden flex flex-col items-center justify-center">
									<span className="loader"></span>
									<p className="text-center mt-4 text-accent font-bold text-lg">
										Loading Presentation...
									</p>
								</div>
							)}
							<div
								className={`relative w-full h-auto overflow-hidden flex-col items-center justify-center z-0 ${
									hasRecognizerLoaded && hasStartedLoadingPresentation
										? "flex"
										: "hidden"
								}`}
							>
								<CameraDisplay videoRef={videoRef} />
								<canvas
									className="absolute z-10"
									style={{
										WebkitTransform: "rotateY(180deg)",
										transform: "rotateY(180deg)",
										opacity: showTrackingInformation ? "object-1" : "0",
									}}
									ref={canvasRef}
									width={videoRef.current ? videoRef.current.clientWidth : 0}
									height={videoRef.current ? videoRef.current.clientHeight : 0}
									// width={document && document.getElementById("webcam").offsetWidth}
									// height={ document ? document.getElementById("webcam").offsetHeight : window.innerHeight / 2}
								></canvas>
								{hasRecognizerLoaded && hasStartedLoadingPresentation && (
									<ObjectLayer
										objectPosition={objectPosition}
										objectZoom={objectZoom}
										objectRotationX={objectRotationX}
										objectRotationY={objectRotationY}
									/>
								)}
							</div>
						</div>
					</div>
				</>
			) : (
				<>
					<div className="w-full h-auto overflow-hidden flex flex-col items-center justify-center col-span-5">
						<span className="loader loader-huge"></span>
						<p className="text-center mt-4 text-accent font-bold text-2xl">
							Loading Environment...
						</p>
					</div>
				</>
			)}
		</div>
	);
}
