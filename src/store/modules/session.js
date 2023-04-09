/**
 * 会话相关数据
 */
import { getSessionList, deleteSession, getSessionDetail } from '@/service/session';
import { clearAll } from '../../service/session';


export default {
  // 开启命名空间
  namespaced: true,
  state: {
    loading: true, //
    active: '', //sessionCode
    detail: null, //当前打开的会话详情
    list: [],//会话列表
  },
  mutations: {
    updateActive(state, val){
      state.active = val
    },
    updateDetail(state, val){
      state.detail = val;
    },
    addToList(state, val){
      if(state.list.filter(item => item.sessionCode === val.sessionCode).length > 0){
        return;
      }
      state.list.unshift({
        ...val,
        sessionType: state.detail.sessionType,
        showTitle: state.detail.title,

      })
    },
    updateLoading(state, val) {
      state.loading = val
    },
    updateList(state, val) {
       state.list = val
    }
  },
  actions: {
    async clearAll({commit}, payload) {
      try{
        const {code, data} = await clearAll(payload)
        if(code === 200){
          commit('updateList', []);
        }
      }catch(e){
      }
    },

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
    async getDetail({commit}, payload){
      try{
        const {code, data} = await getSessionDetail(payload)
        if(code === 200){
          console.log('detail', data)
          if(!data.parseFinish){

          }
          commit('updateDetail', data)
        }
      }catch(e){

      }
    },
    
    // 删除制定会话
    async delete({commit, state}, payload){
      try{
        const {code, data} = await deleteSession(payload)
        if(code === 200){
          let list = state.list.filter(item => item.sessionCode !== payload);
          commit('updateList', list);
        }
      }catch(e){
        console.log(e, '删除失败');
      }
    }
  },
  getters: {
    format(state) {
      return state.info.uname + ',nice to meet you~';
    }
  }
};
