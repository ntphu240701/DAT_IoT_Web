export const INITSTATE = {

        cloud: {}

};



const Reducer = (state, action) => {

        switch (action.type) {

                case 'LOAD_DATA':
                        //console.log(action.payload.deviceid)
                        state.cloud[action.payload.deviceid] =   action.payload.data     

                        return {
                                ...state,
                                cloud: state.cloud
                        }
                case 'RESET_DATA':
                        return {
                                ...state,
                                cloud: {}
                        }



                default:
                        throw new Error('invalid tyre');
        }

}


export default Reducer