
const INITIAL_STATE = {

    overview_name: '',
    overview_company: '',
    overview_session: false,
    overview_lastid: '0',
    overview_setting: {},
    overview_visual: [],
    overview_config: false,
    overview_control: { stt: false, type: '',  id: '0', w: 0, h: 0 },
    overview_device: ['0']

};

const OverviewReducer = (state, action) => {

    switch (action.type) {
        case 'LOAD_DEVICE':

            return {
                ...state,

                overview_name: action.payload.name,
                overview_company: action.payload.company,
                overview_visual: action.payload.visual,
                overview_setting: action.payload.setting,
                overview_lastid: action.payload.id,


            }
        case 'SET_SESSION':
            return {
                ...state,
                overview_session: action.payload
            }
        case 'SET_CONFIG':
            return {
                ...state,
                overview_config: action.payload
            }
        case 'SET_LASTID':
            return {
                ...state,
                overview_lastid: action.payload
            }
        case 'SET_ID':

            return {
                ...state,
                overview_device: action.payload
            }
        case 'LOAD_VISUAL':

            return {
                ...state,
                overview_visual: action.payload
            }
        case 'RESET_TOOLOVERVIEW':
            return {
                overview_session: false,
                overview_lastid: '0',
                overview_setting: {},
                overview_visual: [],
                overview_config: false,
                overview_control: { stt: false, type: '', id: '0', w: 0, h: 0 },
                overview_device: ['0']
            }
        default:
            return state;
    }


}

export { INITIAL_STATE }
export default OverviewReducer;