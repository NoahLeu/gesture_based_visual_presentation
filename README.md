# Gesture Based Visual Presentation

## Introduction

This project is a web application that allows users to stream a live augmented reality presentation of their webcam using gesture tracking. The application is streaming video from the user's webcam and using a machine learning model to track the user's hand gestures. The user can choose between different 3D models to display on the screen and can control the model's position, rotation, and scale using their hand gestures.
This project is based on the mediapipe library and the hand tracking module. The 3D models are loaded using the D3.js library.

The project is still in development and is not yet ready for production.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/NoahLeu/gesture_based_visual_presentation.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Start the application
   ```sh
   npm run start
   ```

## Usage

1. Open the application in your browser at [http://localhost:3000](http://localhost:3000)
2. Click the enable camera button
3. Allow the application to access your webcam when prompted
4. Choose a 3D model from the menu (coming soon)
5. Use your hand gestures to control the model's position, rotation, and scale

### Hand Gestures

currently supported gestures:

#### Left Hand

- **Open Hand** - Scale the model up (hold to continue scaling)
- **Closed Fist** - Scale the model down (hold to continue scaling)

#### Right Hand

- **Closed Fist** - Move the model and release by opening your hand (hold to continue moving)

## Roadmap

1. Add more 3D models to choose from
2. Add more hand gestures to control the models
3. Add more features to the models (e.g. color, texture, etc.)
4. ...

## Contributing

This project is being created by [Noah Leu](https://github.com/NoahLeu) and [Noah Garkisch](https://github.com/NNG0)
as part of the Visualisation course at the University of Rostock. If you have any questions or suggestions, feel free to contact us or open an issue.

## Development

This project was bootstrapped with [Create React App](https://https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
Currently there are no major tests implemented.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
