/**
 * 会话相关数据
 */
import { getSessionList } from '@/service/session';


export default {
  // 开启命名空间
  namespaced: true,
  state: {
    loading: true, //
    active: '', //sessionCode
    list: [],//会话列表
  },
  mutations: {
    updateActive(state, val){
      state.active = val
    },
    updateLoading(state, val) {
      state.loading = val
    },
    updateList(state, val) {
       state.list = val
    }
  },
  actions: {
    async getList({commit}, payload) {
      try{
        commit('updateLoading', true);
       const {code, data} = await getSessionList(payload)
        if(code === 200){
          commit('updateList', data.data);
          commit('updateLoading', false);
        }
      }catch(e){
        commit('updateLoading', false);
      }
    },
    addSession({commit}, payload) {
       
    },
    removeSession({commit}, payload){

    }
  },
  getters: {
    format(state) {
      return state.info.uname + ',nice to meet you~';
    }
  }
};
