export type GestureConfig = {
	interactions: {
		move: Interaction;
		zoom_in: Interaction;
		zoom_out: Interaction;
		rotate_x_positive: Interaction;
		rotate_x_negative: Interaction;
		rotate_y_positive: Interaction;
		rotate_y_negative: Interaction;
		tracking_visible: Interaction;
		pointing: Interaction;
	};
};

export type Interaction = {
	hand: Hand;
	gesture: Gesture;
	confidence?: number;
};

type Hand = "Left" | "Right" | "Both";

type Gesture =
	| "Closed_Fist"
	| "Open_Palm"
	| "Thumb_Up"
	| "Thumb_Down"
	| "Victory"
	| "Pointing_Up";
// | "Love" // not supported by us yet
