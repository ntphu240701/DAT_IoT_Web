import { current } from "@reduxjs/toolkit";

/* eslint eqeqeq: 0 */
const INITIAL_STATE = {
    // whatdevice: '',
    // listdevice: [],
    // listdevice2: [],
    screen: [],
    currentID: '',
    currentSN: '',
    currentName: '',
    // currentState: 0,
    lasttab: 0,
    defaulttab:0,
    // sttdata: false,

};

const SettingReducer = (state, action) => {

    switch (action.type) {

        case "RESET":
            return {
                screen: [],
                currentID: '',
                currentSN: '',
                currentName: '',
                lasttab: 0,

            };

        case "LOAD_ENABLE":
            return {
                ...state,
                currentState: action.payload

            };

        case "LOAD_LASTTAB":
            return {
                ...state,
                lasttab: action.payload

            };
        case "LOAD_DEFAULT":
            return {
                ...state,
                defaulttab: action.payload

            };

        case "LOAD_SCREEN":
            return {
                ...state,
                currentID: action.payload.currentID,
                currentSN: action.payload.currentSN,
                currentName: action.payload.currentName,
                screen: action.payload.screen,
  

            };


        case "REMOVE_SCREEN":
            var newscreen = [...state.screen];
            newscreen = newscreen.filter(newscreen => newscreen.tab_ != action.payload)
            return {
                ...state,
                screen: newscreen
            }
        case 'ADD_SCREEN':
            return {
                ...state,
                screen: [...state.screen, action.payload]
            }
        case 'RELOAD_SCREEN':
            return {
                ...state,
                screen: action.payload
            }

        case "REMOVE_CURRENTID":


            return {
                ...state,
                currentID: '',
                currentSN: '',
            };


        default:
            return state;
    }


}

export { INITIAL_STATE }
export default SettingReducer;