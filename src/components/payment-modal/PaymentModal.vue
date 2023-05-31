<template>
  <a-modal
    v-model:visible="iframeModal"
    :bodyStyle="{ padding: 0, height: '430px' }"
    :width="910"
    title="升级"
    :maskClosable="false"
    :footer="null"
    @cancel="closeIframeModal"
  >
    <iframe
      v-if="iframeModal"
      :src="src"
      id="createAppIframe"
      style="width: 100%; height: 100%; border: 0"
    >
    </iframe>
  </a-modal>
</template>

<script setup>
import { getToken } from '@/utils/auth';
import { useStore } from 'vuex';
import { onMounted, ref, watch, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useStore();
const src = ref('');
const iframeModal = ref(false);
const openFrame = () => {
  iframeModal.value = true;
  src.value = `${import.meta.env.VITE_PAYMENT_URL}?token=${getToken()}`;
  // src.value = `https://hi-smart.chat/page/payment-frame?token=${getToken()}`;
};
const closeIframeModal = () => {
  iframeModal.value = false;
  store.commit('payment/updatePaymentModal', false);
  router.push({ name: 'userInfo' });
};
/**
 * 支付成功回调
 */
const iframeMsgHandler = (event) => {
  const data = event.data;
  let msg = '';
  if (typeof data === 'string') {
    const obj = JSON.parse(data);
    msg = obj.msg ? obj.msg : '';
  }
  switch (msg) {
    case 'paymentSuccess':
      closeIframeModal();
      break;
    default:
      break;
  }
};

onMounted(() => {
  // 监听支付成功后的消息
  window.addEventListener('message', iframeMsgHandler);
});

onUnmounted(() => {
  window.removeEventListener('message', iframeMsgHandler);
});

watch(
  () => store.state.payment.paymentModal,
  (val) => {
    if (val) {
      openFrame();
    }
  }
);
</script>
