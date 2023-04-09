import { onMounted, ref, watch, reactive, nextTick, onBeforeUnmount } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import { useStore } from 'vuex';
import { copyText } from '@/utils/tools.js';
import systemAvatar from '@/assets/logo.jpg';
import defaultUserAvatar from '@/assets/default_user.jpg';
import { streamChat } from '@/service/chat';
import { SESSIONTYPE } from '@/common/constants';

export default () => {
  const router = useRoute();
  const newMessage = ref('');
  const chatWrapDom = ref();
  const controller = ref(null);
  let disabledInput = ref(false);
  let messages = reactive([]);
  const store = useStore();

  watch(
    () => store.state.session.detail,
    () => {
      let { detail } = store.state.session;
      if (!detail) return messages.shift(1, messages.length);
      if (detail) {
        let { history } = detail;
        if (detail.sessionType === SESSIONTYPE.chat) {
          // 后期需要处理message list;
          if (!history.total) {
            if (router.query.msg) {
              newMessage.value = router.query.msg;
              sendMessage();
            } else {
              messages[0] = {
                id: Date.now(),
                author: 'AI',
                text: `你好！我是基于人工智能诞生的AI对话助手。\n我可以告诉你菜谱、帮你写作文、查问题、拟邮件、解决难懂的题目，并且还可以基于上下文与你进行深入讨论。\n`,
                isSent: false,
                avatar: systemAvatar
              };
            }
          }
        } else {
          // 后期需要处理message list;
          if (!history.total && detail.parseFinish) {
            messages[0] = {
              id: Date.now(),
              author: 'AI',
              text: `你好，你现在可以问我关于「${detail.title}」的内容`,
              isSent: false,
              avatar: systemAvatar
            };
          }
        }
      }
    }
  );

  onBeforeRouteUpdate(() => {
    controller.value?.abort();
  });

  onBeforeUnmount(() => {
    controller.value?.abort();
  });

  /**
   * 滚动到底部
   */
  const scrollBottom = () => {
    nextTick(() => {
      const domheight = chatWrapDom.value.scrollHeight;
      chatWrapDom.value &&
        chatWrapDom.value.scrollTo({
          top: domheight,
          behavior: 'smooth'
        });
    });
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

    nextTick(() => {
      newMessage.value = '';
    });
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
        message: sendMsg
      },
      {
        onopen: (response) => {
          msgStreamData = '';
          messages[newLength - 1]['isLoading'] = false;
          if (response.status != 200) {
            switch (response.status) {
              case 40000:
                antMessage.warning('登录超时');
                router.push({ name: 'login' });
                break;
              default:
                msgStreamData = '服务异常';
                break;
            }
          }
        },
        onclose: () => {
          disabledInput.value = false;
          messages[newLength - 1]['text'] = msgStreamData;
        },
        onerror: (err) => {
          controller.value.abort();
        },
        onmessage: (message) => {
          const streamObj = JSON.parse(message.data);
          const { code, data } = streamObj;
          if (code == 200) {
            const { content } = data;
            msgStreamData += (content && content.data) || '';
            messages[newLength - 1]['text'] = msgStreamData + '_';
            if (messages[newLength - 1]['isLoading']) {
              messages[newLength - 1]['isLoading'] = false;
            }
            scrollBottom();
          }
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
    sendMessage
  };
};
