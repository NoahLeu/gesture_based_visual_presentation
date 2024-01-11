import { GestureConfig } from "../types/gestureConfig";

// as typescript obejct:
export const gestureConfig: GestureConfig = {
	interactions: {
		move: {
			hand: "Right",
			gesture: "Closed_Fist",
		},
		zoom_in: {
			hand: "Left",
			gesture: "Open_Palm",
		},
		zoom_out: {
			hand: "Left",
			gesture: "Closed_Fist",
		},
		rotate_x_positive: {
			hand: "Left",
			gesture: "Thumb_Up",
		},
		rotate_x_negative: {
			hand: "Left",
			gesture: "Thumb_Down",
		},
		rotate_y_positive: {
			hand: "Right",
			gesture: "Thumb_Up",
			confidence: 0.6,
		},
		rotate_y_negative: {
			hand: "Right",
			gesture: "Thumb_Down",
			confidence: 0.6,
		},
		tracking_visible: {
			hand: "Right",
			gesture: "Victory",
		},
	},
};
