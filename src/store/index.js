import { createStore } from 'vuex'
import session from './modules/session'

export default createStore({
    modules:{
        session
    }
})