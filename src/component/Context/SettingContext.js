import { createContext, useReducer } from "react";
//import Logger from "../Logger";
import SettingReducer,{INITIAL_STATE} from "./SettingReducer";

export const SettingContext = createContext(INITIAL_STATE);


export const SettingContextProvider =({children})=>{
    const [state, settingDispatch] = useReducer(SettingReducer, INITIAL_STATE);

    return (
        <SettingContext.Provider value = {{
 
                screen: state.screen,
                currentID:state.currentID,
                currentSN:state.currentSN,
                currentName:state.currentName,
                lasttab:state.lasttab,
                defaulttab:state.defaulttab,
                settingDispatch
            }}
        >
            {children}
        </SettingContext.Provider>
    )

}