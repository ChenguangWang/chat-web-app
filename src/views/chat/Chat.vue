<template>
  <div class="chat-room">
    <section class="chat-wrap" ref="chatWrapDom">
      <div class="history-loading-wrap">
        <a-spin v-if="historyParams.loading"/>
      </div>
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
import { onMounted, onBeforeUnmount, ref, onBeforeMount, watch } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { message as antMessage } from 'ant-design-vue';
import { SendOutlined } from '@ant-design/icons-vue';
import { copyText } from '@/utils/tools.js';
import useMessage from '@/hooks/useMessage';

// 静态图片引入
import loadingGIF from '@/assets/loading.gif';
import { useStore } from 'vuex';

export default {
  components: {
    SendOutlined,
    MdEditor
  },
  setup() {
    const store = useStore()
    const route = useRoute();
    const loadingImg = loadingGIF;
    let {sendMessage, messages, disabledInput, newMessage, chatWrapDom, historyParams} = useMessage()

    /**
     * 复制信息
     */
    const copyMessage = (content) => {
      copyText(content, () => {
        antMessage.success('复制成功');
      });
    };


    /**
     * 获取会话详情
     * @param {*} id 
     */
    const changeEffect = async (id) => {
      let sessionCode = id || route.params.id;
      store.commit('session/updateActive', sessionCode);
      store.dispatch('session/getDetail', sessionCode);
    };

    /**
     * 会话详情触发
     */
    onBeforeMount(() => {
      store.commit('session/updateDetail', null);
      changeEffect()
    });

    onBeforeRouteUpdate(function (to, from) {
      store.commit('session/updateDetail', null);
      messages.shift(0, messages.length)
      changeEffect(to.params.id);
    });

    
    watch(() => store.state.session.list, () => {
      let sessionCode = route.params.id;
        store.commit('session/addToList', {
            sessionCode
        });
    })
    if (route.query.msg) {
      messages.shift(0, messages.length)
    }

    return {
      loadingImg,
      historyParams,
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
      max-width: 100%;
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
  .history-loading-wrap {
    text-align: center;
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
