<template>
  <div class="chat-room">
    <header>聊天标题</header>
    <section class="chat-wrap">
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
            <!-- <div class="message-author">{{ message.author }}</div> -->
            <div class="message-text">{{ message.text }}</div>
          </div>
        </li>
      </ul>
    </section>
    <section class="send-wrap">
      <!-- @pressEnter 回车回调 -->
      <a-textarea v-model:value="newMessage" @pressEnter="sendMessage" />
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
import { SendOutlined } from '@ant-design/icons-vue'
import { reactive, onMounted, onBeforeUnmount, ref } from 'vue'

export default {
  components: {
    SendOutlined
  },
  setup() {
    const systemAvatar = '/src/assets/logo.jpg'
    const newMessage = ref('')
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

    const sendMessage = () => {
      if (newMessage.value.trim()) {
        messages.push({
          id: Date.now(),
          author: 'User',
          text: newMessage.value.trim(),
          isSent: true, // 标记消息是否由当前用户发送
          avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
        })
        newMessage.value = ''
      }
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
          background-color: #0084ff;
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
      .message-author {
        font-weight: bold;
        margin-bottom: 5px;
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
</style>
