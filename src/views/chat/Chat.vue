<template>
  <div class="chat-room">
    <header>聊天标题</header>
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
          <div class="message-body">
            <!-- <div class="message-text">{{ message.text }}</div> -->
            <MdEditor v-model="message.text" previewOnly />
          </div>
        </li>
        <li style="clear: both; margin: 0"></li>
      </ul>
    </section>
    <section class="send-wrap">
      <!-- @pressEnter 回车回调 -->
      <a-textarea v-model:value="newMessage" />
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
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { SendOutlined } from '@ant-design/icons-vue'
import { reactive, onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import { chat, streamChat } from '@/service/chat'

import defaultUserAvatar from '@/assets/default_user.jpg'
import systemAvatar from '@/assets/logo.jpg'

export default {
  components: {
    SendOutlined,
    MdEditor
  },
  setup() {
    const newMessage = ref('')
    const chatWrapDom = ref()
    const messages = reactive([
      {
        id: Date.now(),
        author: 'AI',
        text: `你好！我是基于人工智能诞生的AI对话助手。\n
我可以告诉你菜谱、帮你写作文、查问题、拟邮件、解决难懂的题目，并且还可以基于上下文与你进行深入讨论。\n`,
        // 以下是一些经典案例：\n`,
        isSent: false,
        avatar: systemAvatar
      }
    ])

    /**
     * 滚动到底部
     */
    const scrollBottom = () => {
      nextTick(() => {
        const domheight = chatWrapDom.value.scrollHeight
        chatWrapDom.value &&
          chatWrapDom.value.scrollTo({
            top: domheight,
            behavior: 'smooth'
          })
      })
    }

    const sendMessage = () => {
      if (!newMessage.value.trim()) {
        return
      }
      const sendMsg = newMessage.value.trim()
      messages.push({
        id: Date.now(),
        author: 'User',
        text: sendMsg,
        isSent: true, // 标记消息是否由当前用户发送
        avatar: defaultUserAvatar
      })
      newMessage.value = ''

      let responseMsg = {
        id: Date.now(),
        author: 'gpt',
        isSent: false,
        isLoading: true, // 加载中 TODO: 预留的加载口子
        avatar: systemAvatar
      }

      scrollBottom()

      const chatParam = {
        context: false, // 上下文
        message: sendMsg, // 信息
        sessionId: 'test', // 会话id
        userId: '101' // 用户id
      }
      chat(chatParam).then((res) => {
        console.log('chat=====>>>', res)
        const { code, data } = res
        if (code == 200) {
          responseMsg.text = data.context
          messages.push(responseMsg)
          scrollBottom()
        }
      })
    }

    onMounted(() => {
      // connect to chat server and fetch initial messages
      console.log('Mounted')
    })

    onBeforeUnmount(() => {
      // disconnect from chat server
      console.log('Unmounted')
    })

    return {
      messages,
      newMessage,
      chatWrapDom,
      sendMessage
    }
  }
}
</script>

<style lang="less" scoped>
header {
  height: 64px;
  line-height: 64px;
  font-size: 16px;
  padding: 0 24px;
  font-weight: 600;
  border-bottom: 1px solid rgba(23, 35, 61, 0.1);
}
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
      .message-body {
        padding: 10px;
        border-radius: 8px;
        background-color: #f2f2f2;
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
</style>
