import { createContext, useReducer } from "react";
//import Logger from "../Logger";
import OverviewReducer, { INITIAL_STATE } from "./OverviewReducer";


export const OverviewContext = createContext(INITIAL_STATE);


export const OverviewContextProvider = ({ children }) => {
    const [state, overviewDispatch] = useReducer(OverviewReducer, INITIAL_STATE);

    return (
        <OverviewContext.Provider value={{
            overview_name: state.overview_name,
            overview_company: state.overview_company,
            overview_session: state.overview_session,
            overview_config: state.overview_config,
            overview_visual: state.overview_visual,
            overview_setting: state.overview_setting,
            overview_lastid: state.overview_lastid,
            overview_control: state.overview_control,
            overview_device: state.overview_device,
            overviewDispatch
        }}
        >
            {children}
        </OverviewContext.Provider>
    )

}