type CameraDisplayProps = {
	videoRef: React.RefObject<HTMLVideoElement>;
};

export default function CameraDisplay({ videoRef }: CameraDisplayProps) {
	return (
		<div className="z-0 w-full h-auto overflow-hidden flex items-center justify-center">
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
	);
}
