import { createContext, useReducer } from "react";
//import Logger from "../Logger";
import ToolReducer,{INITIAL_STATE} from "./ToolReducer";

export const ToolContext = createContext(INITIAL_STATE);


export const ToolContextProvider =({children})=>{
    const [state, toolDispatch] = useReducer(ToolReducer, INITIAL_STATE);

    return (
        <ToolContext.Provider value = {{
                config:state.config,
                visual:state.visual,
                setting:state.setting,
                lastid:state.lastid,
                name:state.name,
                control:state.control,
                toolDispatch
            }}
        >
            {children}
        </ToolContext.Provider>
    )

}