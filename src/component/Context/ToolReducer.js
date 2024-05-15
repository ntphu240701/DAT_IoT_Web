
const INITIAL_STATE = {
    lastid: {},
    setting: {},
    visual: {},
    config: {},
    name: {},
    control: {},

};

const ToolReducer = (state, action) => {
    // var x,y,z,t,n,c;
    switch (action.type) {
        case 'LOAD_DEVICE':

            // x = state.config
            // x[action.payload.tab] = { stt: false }

            return {
                ...state,
                config: {
                    ...state.config,
                    [action.payload.tab]: { stt: false }

                },
                visual: {
                    ...state.visual,
                    [action.payload.tab]: action.payload.visual
                },
                setting: {
                    ...state.setting,
                    [action.payload.tab]: action.payload.setting

                },
                lastid: {
                    ...state.lastid,
                    [action.payload.tab]: action.payload.lastid
                },
                name: {
                    ...state.name,
                    [action.payload.tab]: action.payload.name
                },
                control: {
                    ...state.control,
                    [action.payload.tab]: { stt: false, type: '', cal: '0', id: 0, w: '', h: '' }
                }
            }
        case 'SET_CONFIG':
            return {
                ...state,
                config: action.payload
            }
        case 'SET_CONTROL':
            return {
                ...state,
                control: action.payload
            }

        case 'SET_STATUS':
            return {
                ...state,
                status: action.payload
            }
        case 'LOAD_VISUAL':
            return {
                ...state,
                visual: {
                    ...state.visual,
                    [action.payload.tab]: action.payload.visual
                }
            }
        case 'LOAD_SETTING':
            return {
                ...state,
                setting: {
                    ...state.setting,
                    [action.payload.tab]: action.payload.setting
                }
            }
        case 'LOAD_ID':

            return {
                ...state,
                lastid: action.payload
            }
        case 'REMOVE_NAME':
            var newname = state.name
            delete newname[action.payload]

            return {
                ...state,
                name: newname
            }
        case 'RE_NAME':
           

            return {
                ...state,
                name: action.payload
            }
        case 'RESET_TOOL':
            return {
                config: {},
                lastid: {},
                visual: {},
                setting: {},
                name: {},
                control: {}
            }
        default:
            return state;
    }


}

export { INITIAL_STATE }
export default ToolReducer;