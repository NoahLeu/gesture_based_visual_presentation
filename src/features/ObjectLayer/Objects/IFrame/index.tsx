import {iFrameProps} from "../../index";

export default function IFrame({
                                   nodeRef,
                                   objectPosition,
                                   objectZoom,
                               }: iFrameProps) {
    return (
        <iframe
            ref={nodeRef}
            className={"absolute z-20"}
            src="https://www.youtube.com/embed/9d8wWcJLnFI"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={true}
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