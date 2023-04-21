import { onMounted, ref, watch, reactive, nextTick, onBeforeUnmount } from 'vue';
import { useRoute, onBeforeRouteUpdate, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { message as antMessage } from 'ant-design-vue';
import { copyText } from '@/utils/tools.js';
import systemAvatar from '@/assets/logo.jpg';
import defaultUserAvatar from '@/assets/default_user.jpg';
import { streamChat, chatHistory } from '@/service/chat';
import { SESSIONTYPE } from '@/common/constants';

export default () => {
  const route = useRoute();
  const router = useRouter();
  const newMessage = ref('');
  const chatWrapDom = ref();
  const controller = ref(null);
  let disabledInput = ref(false);
  let messages = reactive([]);
  const store = useStore();
  const historyParams = reactive({
    pageNum: 1,
    pageSize: 10,
    total: 0,
    loading: false
  });

  watch(
    () => store.state.session.detail,
    () => {
      let { detail } = store.state.session;
      if (!detail) return messages.shift(1, messages.length);
      if (detail) {
        let { history } = detail;
        if (detail.sessionType === SESSIONTYPE.chat) {
          if (history.total == 0 && route.query.msg) {
            newMessage.value = route.query.msg || detail.title;
            sendMessage();
          } else {
            processHistory(history.data);
          }
          if (messages.length == 0) {
            messages[0] = {
              id: Date.now(),
              author: 'AI',
              text: `你好！我是基于人工智能诞生的AI对话助手。\n我可以告诉你菜谱、帮你写作文、查问题、拟邮件、解决难懂的题目，并且还可以基于上下文与你进行深入讨论。\n`,
              isSent: false,
              avatar: systemAvatar
            };
          }
        } else {
          // 后期需要处理message list;
          if (history.total == 0 && detail.parseFinish) {
            messages[0] = {
              id: Date.now(),
              author: 'AI',
              text: detail.mainIdea,
              isSent: false,
              avatar: systemAvatar
            };
          } else {
            processHistory(history.data);
          }
        }
        historyParams.pageNum = history.pageNum + 1;
        historyParams.pageSize = history.pageSize;
        historyParams.total = history.total;
      }
    }
  );

  onMounted(() => {
    chatWrapDom.value?.addEventListener('scroll', scrollChange, true);
  });

  onBeforeRouteUpdate(() => {
    controller.value?.abort();
    disabledInput.value = false;
  });

  onBeforeUnmount(() => {
    chatWrapDom.value?.addEventListener('scroll', scrollChange, true);

    controller.value?.abort();
    disabledInput.value = false;
  });

  /**
   * 下拉获取历史记录
   */
  const scrollChange = async () => {
    const scrollTop = chatWrapDom.value.scrollTop;

    if (scrollTop == 0 && !historyParams.loading) {
      if (historyParams.total > (historyParams.pageNum - 1) * historyParams.pageSize) {
        historyParams.loading = true;
        const param = {
          pageNum: historyParams.pageNum,
          pageSize: historyParams.pageSize,
          sessionCode: store.state.session.active
        };
        const result = await chatHistory(param);
        historyParams.loading = false;
        if (result.code == 200) {
          historyParams.pageNum++;
          historyParams.total = result.data.total;
          processHistory(result.data.data, true);
        }
      }
    }
  };

  /**
   * 滚动到底部
   */
  const scrollBottom = () => {
    nextTick(() => {
      const domheight = chatWrapDom.value?.scrollHeight;
      chatWrapDom.value &&
        chatWrapDom.value?.scrollTo({
          top: domheight,
          behavior: 'smooth'
        });
    });
  };

  /**
   * 处理历史消息
   * @param {*} data
   * @param {*} isConcat
   */
  const processHistory = (data, isConcat) => {
    if (!isConcat) {
      // 清空message
      messages.splice(0, messages.length);
    }
    data = data.reverse();
    const historyData = data.map((item) => {
      return {
        id: item.chatTime,
        author: item.roleType == 1 ? 'AI' : 'User',
        text: item.chatContext,
        isSent: item.roleType == 2,
        avatar: item.roleType == 1 ? systemAvatar : defaultUserAvatar
      };
    });
    if (historyData.length > 0) {
      if (isConcat) {
        messages.unshift(...historyData);
      } else {
        messages.push(...historyData);
        scrollBottom();
      }
    }
  };

  /**
   * 复制信息
   */
  const copyMessage = (content) => {
    copyText(content, () => {
      antMessage.success('复制成功');
    });
  };

  /**
   * 发送消息
   * @param {*} text
   * @returns
   */
  const sendMessage = () => {
    if (!newMessage.value.trim() || disabledInput.value) {
      return;
    }
    const sendMsg = newMessage.value.trim();
    messages.push({
      id: Date.now(),
      author: 'User',
      text: sendMsg,
      isSent: true, // 标记消息是否由当前用户发送
      avatar: defaultUserAvatar
    });

    setTimeout(() => {
      newMessage.value = undefined;
    }, 100);

    disabledInput.value = true;

    let responseMsg = {
      id: Date.now(),
      author: 'AI',
      isSent: false,
      isLoading: true, // 加载中 TODO: 预留的加载口子
      text: '',
      avatar: systemAvatar
    };

    const newLength = messages.push(responseMsg);
    scrollBottom();
    let msgStreamData = ''; // 拼接流的数据
    controller.value = streamChat(
      {
        message: sendMsg,
        sessionCode: store.state.session.active
      },
      {
        onopen: (response) => {
          msgStreamData = '';
          messages[newLength - 1]['isLoading'] = false;
        },
        onmessage: (message) => {
          const streamObj = JSON.parse(message.data);
          const { code, data, msg } = streamObj;
          if (code == 200) {
            const { content } = data;
            msgStreamData += (content && content.data) || '';
            messages[newLength - 1]['text'] = msgStreamData + '_';
            if (messages[newLength - 1]['isLoading']) {
              messages[newLength - 1]['isLoading'] = false;
            }
            scrollBottom();
          } else {
            switch (code) {
              case 40000:
                antMessage.warning('登录超时');
                router.push({ name: 'login' });
                break;
              default:
                msgStreamData = msg;
                break;
            }
          }
        },
        onclose: () => {
          disabledInput.value = false;
          messages[newLength - 1]['text'] = msgStreamData;
        },
        onerror: (err) => {
          console.log('message onerror====>>', err);
          disabledInput.value = false;
          controller.value.abort();
        }
      }
    );
  };

  return {
    copyMessage,
    messages,
    disabledInput,
    chatWrapDom,
    newMessage,
    historyParams,
    sendMessage
  };
};
