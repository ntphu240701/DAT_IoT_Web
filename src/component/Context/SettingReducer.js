/* eslint eqeqeq: 0 */
const INITIAL_STATE = {
    whatdevice: '',
    listdevice: [],
    listdevice2: [],
    screen: [],
    currentID: '',
    currentName: '',
    currentState: 0,
    lasttab: 0,
    defaulttab:0,
    sttdata: false,

};

const SettingReducer = (state, action) => {

    switch (action.type) {

        case "RESET":
            return {
                whatdevice: '',
                listdevice2: [],
                listdevice: [],
                screen: [],
                currentID: '',
                currentName: '',
                currentState: 0,
                lasttab: 0,
                sttdata: false,

            };

        case "LOAD_ENABLE":
            return {
                ...state,
                currentState: action.payload

            };

        case "LOAD_STATE":
            return {
                ...state,
                sttdata: action.payload

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
                currentName: action.payload.currentName,
                screen: action.payload.screen,
                sttdata: action.payload.sttdata

            };


        case "REMOVE_SCREEN":
            var newscreen = [...state.screen];
            newscreen = newscreen.filter(newscreen => newscreen.tab != action.payload)
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
        case "LOAD_LISTDEVICE":
            return {
                ...state,
                listdevice: action.payload

            };
        case "LOAD_LISTDEVICE2":
            return {
                ...state,
                listdevice2: action.payload

            };
        case "WHAT_DEVICE":


            return {
                ...state,
                whatdevice: action.payload,
            };

        case "RESET_WHAT_DEVICE":


            return {
                ...state,
                whatdevice: '',
            };

        case "REMOVE_CURRENTID":


            return {
                ...state,
                currentID: '',
            };


        default:
            return state;
    }


}

export { INITIAL_STATE }
export default SettingReducer;