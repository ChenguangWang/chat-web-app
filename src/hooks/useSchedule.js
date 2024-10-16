import { onMounted, ref, onBeforeUnmount, watch } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import { message } from 'ant-design-vue';
import { useStore } from 'vuex';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { getToken } from '@/utils/auth';

export default () => {
  let route = useRoute();
  let progress = ref(0); //进度
  let stepText = ref('');
  let error = ref('');
  let state = ref(0); //状态
  let store = useStore()
  let sseCtrl = ref(null);

  watch(() => store.state.session.detail, () => {
    let {detail} = store.state.session;
    if(detail && detail.parseFinish === false){
      sseCtrl.value = createSSE(route.params.id);
    }
  })


  const createSSE = (id) => {
    let _id = id || route.params.id;

    let controller = new AbortController();
    fetchEventSource(`/sse/session/schedule/${_id}`,{
      headers: {
        'Content-Type': 'application/json',
        hi_smart_token_key: getToken()
      },
      signal: controller.signal,
      onopen: (event) => {
        // message.success('连接成功');
        state.value = 1
      },
      onmessage: (event) => {
        let _data = JSON.parse(event.data);
        progress.value = _data.schedule;
        stepText.value = _data.detail;
        // 处理完成之后断开
        if(_data.schedule === 100){
          controller.abort();
        }
      },
      onerror: () => {
        // message.warning('连接失败');
        error.value = '连接断开';
      }
    })
    // 处理如何建立链接1分钟内还没有连接成功 就关闭连接
    setTimeout(function(){
        if(state.value === 0){
            // sse.value.close();
            controller.abort();
            error.value = '连接超时，刷新后重试！';
        }
    }, 60*1000)

    return controller;
  };
 
  onBeforeRouteUpdate((to, from) => {
    sseCtrl.value?.abort();
  });

  onBeforeUnmount(() => {
    sseCtrl.value?.abort();
  });

  return {
    progress,
    stepText,
    error
  };
};
