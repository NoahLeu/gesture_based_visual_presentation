import {createContext, ReactNode, useContext, useMemo, useState} from "react";
import Globe from "../features/ObjectLayer/Objects/Globe";
import {iFrameProps, ModelProps, twoD_ModelProps} from "../features/ObjectLayer";
import BlackGlobe from "../features/ObjectLayer/Objects/Globe/Blackglobe";
import IFrame from "../features/ObjectLayer/Objects/IFrame";
import Diagram from "../features/ObjectLayer/Objects/Diagram";

export type ModelContextType = {
    modelVisibility: boolean;
    setModelVisibility: (visibility: boolean) => void;
    currentModelIndex: number;
    setCurrentModelIndex: (index: number) => void;
    availableModels: Array<{
        name: string,
        model: React.FC<ModelProps> | React.FC<twoD_ModelProps> | React.FC<iFrameProps>
    }>;
}

export type modelProviderProps = {
    children: ReactNode;
}

export const useModelState = () => (useContext(ModelContext));

const initialModels = [
    {name: "Globe", model: Globe},
    {name: "Black Globe", model: BlackGlobe},
    {name: "Bar Chart", model: Diagram},
    {name: "iFrame", model: IFrame}
];

export const ModelContext = createContext<ModelContextType>({
    modelVisibility: true,
    setModelVisibility: () => {
    },
    currentModelIndex: 0,
    setCurrentModelIndex: () => {
    },
    availableModels: initialModels,
});

export function ModelContextProvider({children}: modelProviderProps) {
    const [modelVisibility, setModelVisibility] = useState<boolean>(true);
    const [currentModelIndex, setCurrentModelIndex] = useState<number>(0);

    const modelContext = useMemo(() => ({
        modelVisibility,
        setModelVisibility,
        currentModelIndex,
        setCurrentModelIndex,
        availableModels: initialModels
    }), [currentModelIndex, modelVisibility]);

    return (
        <ModelContext.Provider value={modelContext}>
            {children}
        </ModelContext.Provider>
    );
}