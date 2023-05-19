/**
 * 支付相关
 */
export default {
  // 开启命名空间
  namespaced: true,
  state: {
    paymentModal: false //
  },
  mutations: {
    updatePaymentModal(state, val) {
      state.paymentModal = val;
    }
  }
};
