import {createContext, FC, useContext, useMemo, useState} from "react";
import Globe from "../features/ObjectLayer/Objects/Globe";
import {ModelProps} from "../features/ObjectLayer";
import BlackGlobe from "../features/ObjectLayer/Objects/Globe/Blackglobe";

export type ModelContextType = {
    modelVisibility: boolean;
    setModelVisibility: (visibility: boolean) => void;
    currentModelIndex: number;
    setCurrentModelIndex: (index: number) => void;
    availableModels: FC<ModelProps>[];
}

export const ModelContext = createContext<ModelContextType>({
    modelVisibility: true,
    setModelVisibility: () => {
    },
    currentModelIndex: 0,
    setCurrentModelIndex: () => {
    },
    availableModels: [Globe,BlackGlobe]
});

export const useModelState = () => (useContext(ModelContext));

type modelProviderProps = {
    children: any;
}

export function ModelContextProvider({children}: modelProviderProps) {
    const [modelVisibility, setModelVisibility] = useState<boolean>(true);
    const [currentModelIndex, setCurrentModelIndex] = useState<number>(0);
    const [availableModels, setAvailableModels] = useState<FC<ModelProps>[]>([Globe,BlackGlobe]);

    const modelContext = useMemo(() => (
        {
            modelVisibility,
            setModelVisibility,
            currentModelIndex,
            setCurrentModelIndex,
            availableModels,
            setAvailableModels

        }
    ), [modelVisibility, setModelVisibility, currentModelIndex, setCurrentModelIndex, availableModels, setAvailableModels]);

    return (
        <ModelContext.Provider value={modelContext}>
            {children}
        </ModelContext.Provider>
    );
}