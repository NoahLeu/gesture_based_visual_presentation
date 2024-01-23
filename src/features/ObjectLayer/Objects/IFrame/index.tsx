import { iFrameProps } from "../../index";

export default function IFrame({
	nodeRef,
	objectPosition,
	objectZoom,
}: iFrameProps) {
	return (
		<iframe
			id="iframe-model"
			ref={nodeRef}
			className={"absolute z-20"}
			src="https://www.youtube.com/embed/9d8wWcJLnFI"
			title="YouTube video player"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			onClick={(e) => {
				e.stopPropagation();

				let iframe = document.getElementById(
					"iframe-model"
				) as HTMLIFrameElement;

				if (!iframe) return;

				if (iframe.src.includes("youtube.com")) {
					console.log("toggle playing");

					let symbol = iframe.src.includes("?") ? "&" : "?";

					if (iframe.src.includes("autoplay")) {
						iframe.src = iframe.src.replace("autoplay", "");
					} else {
						iframe.src = iframe.src + symbol + "autoplay=1";
					}
				}
			}}
			style={{
				width: `${objectZoom}px`,
				border: "none",
				top: objectPosition.y * 100 + "%",
				right: objectPosition.x * 100 + "%",
				transform: `translate(50%, -50%)`,
				transformOrigin: "center",
				aspectRatio: 16 / 9,
			}}
		/>
	);
}
