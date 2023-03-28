<template>
  <div class="chat-room">
    <h1>{{ title }}</h1>
    <ul class="chat-messages">
      <li v-for="message in messages" :key="message.id" :class="{ 'sent': message.isSent, 'received': !message.isSent }">
        <div class="message-author">{{ message.author }}</div>
        <div class="message-text">{{ message.text }}</div>
      </li>
    </ul>
    <form class="chat-form" @submit.prevent="sendMessage">
      <input v-model="newMessage" placeholder="Type your message here...">
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script>
import { reactive, onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'ChatRoom',
  props: {
    title: {
      type: String,
      default: 'Chat Room'
    }
  },
  setup(props) {
    const state = reactive({
      messages: [],
      newMessage: ''
    });

    function sendMessage() {
      if (state.newMessage.trim()) {
        state.messages.push({
          id: Date.now(),
          author: 'User',
          text: state.newMessage.trim(),
          isSent: true // 标记消息是否由当前用户发送
        });
        state.newMessage = '';
      }
    }

    onMounted(() => {
      // connect to chat server and fetch initial messages
      console.log('Mounted');
    });

    onBeforeUnmount(() => {
      // disconnect from chat server
      console.log('Unmounted');
    });

    return {
      messages: state.messages,
      newMessage: state.newMessage,
      sendMessage
    };
  }
}
</script>

<style>
.chat-room {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.chat-messages {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.chat-messages li {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: #f2f2f2;
  clear: both;
  overflow: auto;
}

.chat-messages li.sent {
  float: right;
  background-color: #0084ff;
  color: #fff;
}

.chat-messages li.received {
  float: left;
  background-color: #eaeaea;
}

.message-author {
  font-weight: bold;
  margin-bottom: 5px;
}

.message-text {
  font-size: 14px;
}

.chat-form {
  margin-top: 20px;
}

.chat-form input {
  width: 70%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #f2f2f2;
  box-sizing: border-box;
}

.chat-form button {
  width: 28%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #0084ff;
  color: #fff;
  box-sizing: border-box;
}
</style>
