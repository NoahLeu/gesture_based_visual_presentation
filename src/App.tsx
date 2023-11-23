import React from "react";
import PresentationScreen from "./features/PresentationScreen";
import {ModelContextProvider} from "./context";

function App() {
    return (
        <>
            <ModelContextProvider>
                <PresentationScreen/>
            </ModelContextProvider>
        </>
    );
}

export default App;
