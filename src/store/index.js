import { createStore } from 'vuex';
import session from './modules/session';
import payment from './modules/payment';

export default createStore({
  modules: {
    session,
    payment
  }
});
