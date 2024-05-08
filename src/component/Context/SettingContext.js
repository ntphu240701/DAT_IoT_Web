import { createContext, useReducer } from "react";
//import Logger from "../Logger";
import SettingReducer,{INITIAL_STATE} from "./SettingReducer";

export const SettingContext = createContext(INITIAL_STATE);


export const SettingContextProvider =({children})=>{
    const [state, settingDispatch] = useReducer(SettingReducer, INITIAL_STATE);

    return (
        <SettingContext.Provider value = {{
                whatdevice: state.whatdevice,
                screen: state.screen,
                listdevice: state.listdevice,
                listdevice2: state.listdevice2,
                currentID:state.currentID,
                currentSN:state.currentSN,
                currentName:state.currentName,
                currentState:state.currentState,
                lasttab:state.lasttab,
                defaulttab:state.defaulttab,
                sttdata:state.sttdata,
                settingDispatch
            }}
        >
            {children}
        </SettingContext.Provider>
    )

}