<template>
  <div class="chat-room">
    <section class="chat-wrap" ref="chatWrapDom">
      <ul class="chat-messages">
        <li
          v-for="message in messages"
          :key="message.id"
          :class="{ sent: message.isSent, received: !message.isSent }"
        >
          <div class="message-avatar">
            <img :src="message.avatar" alt="avatar" />
          </div>
          <div class="message-wrap">
            <div class="message-body">
              <!-- <div class="message-text">{{ message.text }}</div> -->
              <MdEditor v-if="!message.isLoading" v-model="message.text" previewOnly />
              <img class="message-body-loading" v-else :src="loadingImg" />
            </div>
            <div class="message-wrap-operation" v-if="!message.isSent && !message.isLoading">
              <div class="message-wrap-operation-btn" @click="copyMessage(message.text)">
                <i class="iconfont icon-fuzhi"></i> 复制
              </div>
            </div>
          </div>
        </li>
        <li style="clear: both; margin: 0"></li>
      </ul>
    </section>
    <section class="send-wrap">
      <!-- @pressEnter 回车回调 -->
      <a-textarea
        v-model:value="newMessage"
        placeholder="输入消息，Ctrl + Enter 发送"
        @keyup.ctrl.enter="sendMessage"
      />
      <a-button class="send-btn" type="primary" shape="round" @click="sendMessage">
        <template #icon>
          <send-outlined />
        </template>
        发送
      </a-button>
    </section>
  </div>
</template>

<script>
import { reactive, onMounted, onBeforeUnmount, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { message as antMessage } from 'ant-design-vue';
import { SendOutlined } from '@ant-design/icons-vue';
import { chat, streamChat } from '@/service/chat';
import { copyText } from '@/utils/tools.js';
import { getToken } from '@/utils/auth';

// 静态图片引入
import defaultUserAvatar from '@/assets/default_user.jpg';
import systemAvatar from '@/assets/logo.jpg';
import loadingGIF from '@/assets/loading.gif';

import { fetchEventSource } from '@microsoft/fetch-event-source';

export default {
  components: {
    SendOutlined,
    MdEditor
  },
  setup() {
    const route = useRoute();
    const newMessage = ref('');
    const chatWrapDom = ref();
    const loadingImg = loadingGIF;
    let disabledInput = ref(false);
    let messages = reactive([]);

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

    let controller = new AbortController();
    let signal = controller.signal;

    /**
     * 发送信息
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

      const chatParam = {
        message: sendMsg // 信息
      };
      // 非流
      // chat(chatParam).then((res) => {
      //   const { code, data, msg } = res;
      //   if (code == 200) {
      //     messages[newLength - 1]['text'] = data.context;
      //     messages[newLength - 1]['isLoading'] = false;
      //   } else {
      //     messages[newLength - 1]['text'] = msg;
      //     messages[newLength - 1]['isLoading'] = false;
      //   }
      //   disabledInput.value = false;
      //   scrollBottom();
      // });

      let msgStreamData = ''; // 拼接流的数据
      fetchEventSource('/api/stream/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          hi_smart_token_key: getToken()
        },
        signal,
        body: JSON.stringify(chatParam),
        onopen: async (response) => {
          console.log('onopen====>>>', response);
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
        onmessage: (message) => {
          console.log('message====>>>', message);
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
        },
        onclose: () => {
          disabledInput.value = false;
          messages[newLength - 1]['text'] = msgStreamData;
          console.log('onclose====>>>');
        },
        onerror: (err) => {
          controller.abort();
          console.log('onerror=====>>>', err);
        }
      });
    };

    onMounted(() => {
      // connect to chat server and fetch initial messages
      console.log('Mounted');
    });

    onBeforeUnmount(() => {
      // disconnect from chat server
      controller.abort();
      console.log('Unmounted');
    });

    if (!route.query.msg) {
      messages = reactive([
        {
          id: Date.now(),
          author: 'AI',
          text: `你好！我是基于人工智能诞生的AI对话助手。\n
我可以告诉你菜谱、帮你写作文、查问题、拟邮件、解决难懂的题目，并且还可以基于上下文与你进行深入讨论。\n`,
          // 以下是一些经典案例：\n`,
          isSent: false,
          avatar: systemAvatar
        }
      ]);
    } else {
      newMessage.value = route.query.msg;
      sendMessage();
    }

    return {
      loadingImg,
      messages,
      newMessage,
      chatWrapDom,
      disabledInput,
      copyMessage,
      sendMessage
    };
  }
};
</script>

<style lang="less" scoped>
.chat-wrap {
  padding: 24px;
  height: calc(100vh - 188px);
  overflow-y: scroll;
  .chat-messages {
    list-style-type: none;
    padding: 0;
    margin: 0;
    li {
      margin-bottom: 10px;
      clear: both;
      overflow: auto;
      &.sent {
        float: right;
        .message-body {
          color: #fff;
          background-color: #19be6b;
        }
        .message-avatar {
          text-align: right;
        }
      }
      &.received {
        float: left;
        .message-body {
          background-color: #eaeaea;
        }
      }
      .message-wrap {
        &-operation {
          display: inline-block;
          &-btn {
            font-size: 12px;
            color: #808695;
            cursor: pointer;
            &:hover {
              color: #2285f0;
            }
          }
        }
      }
      .message-body {
        padding: 10px;
        border-radius: 8px;
        background-color: #f2f2f2;
        &-loading {
          height: 25px;
        }
      }
      .message-avatar {
        overflow: hidden;
        margin-bottom: 8px;
        img {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
        }
      }
      .message-text {
        font-size: 14px;
      }
    }
  }
}
.send-wrap {
  position: relative;
  height: 100px;
  padding: 0 24px;
  .ant-input {
    border-radius: 8px;
    resize: none;
    height: 100%;
  }
  .send-btn {
    position: absolute;
    bottom: 12px;
    right: 36px;
  }
}

.md-editor {
  --md-bk-color: transparent;
}
:deep .default-theme p {
  line-height: inherit;
  margin: 0;
  padding: 0;
}

// 小屏兼容
@media only screen and (max-width: 768px) {
  header {
    display: none;
  }
}
</style>
