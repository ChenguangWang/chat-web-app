<template>
  <div class="chat-room">
    <div class="detail-info" v-if="detail !== null">
      <h5>
        {{ !detail.parseFinish && progress < 100 ? '解析中:' + progress + '%' : '解析完成' }} 【<span class="detail-info-title" :title="detail?.title">{{ detail?.title }}</span>】
      </h5>
      <p :style="{ width: !detail.parseFinish ? progress + '%' : '100%' }"></p>
    </div>
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
      <a-button :disabled="disabledInput" class="send-btn" type="primary" shape="round" @click="sendMessage">
        <template #icon>
          <send-outlined />
        </template>
        发送
      </a-button>
    </section>
  </div>
</template>

<script>
import {
  computed,
  watch,
  onBeforeMount
} from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { SendOutlined } from '@ant-design/icons-vue';
import useMessage from '@/hooks/useMessage';

// 静态图片引入
import systemAvatar from '@/assets/logo.jpg';
import loadingGIF from '@/assets/loading.gif';
import { useStore } from 'vuex';
import useSchedule from '../../hooks/useSchedule';

export default {
  components: {
    SendOutlined,
    MdEditor
  },
  setup() {
    const route = useRoute();
    const loadingImg = loadingGIF;
    let store = useStore();
    let { progress } = useSchedule();
    let { sendMessage, messages, disabledInput, newMessage, copyMessage, chatWrapDom, historyParams } = useMessage();

    const changeEffect = async (to) => {
      let sessionCode = to ? to.params.id : route.params.id;
      store.commit('session/updateDetail', null);
      store.commit('session/updateActive', sessionCode);
      await store.dispatch('session/getDetail', sessionCode);
      
      store.commit('session/addToList', {
        sessionCode
      });
      if(store.state.session.detail.parseFinish){
        disabledInput.value = false
      }else{
        disabledInput.value = true
      }
    };

    onBeforeMount(changeEffect);
    onBeforeRouteUpdate(changeEffect);

    watch(() => progress.value, () => {
        if (progress.value == 100) {
          store.dispatch('session/getDetail', route.params.id);
          disabledInput.value = false
        }else{
          disabledInput.value = true
        }
      }
    );


    return {
      loadingImg,
      historyParams,
      progress, //解析进度
      messages,
      newMessage,
      chatWrapDom,
      disabledInput,
      detail: computed(() => store.state.session.detail),
      copyMessage,
      sendMessage
    };
  }
};
</script>

<style lang="less" scoped>
.chat-wrap {
  padding: 24px;
  padding-top: 54px;
  height: calc(100vh - 208px);
  box-sizing: border-box;
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
        min-height: 46px;
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

.detail-info {
  height: 1px;
  line-height: 30px;
  padding: 0 24px;
  position: relative;
  h5 {
    color: #333;
    // text-shadow: 1px 1px 0px #fff;
    font-weight: 400;
    position: absolute;
    z-index: 1;
  }
  p {
    height: 30px;
    width: 0;
    margin: 0;
    left: 0;
    top: 0;
    z-index: 0;
    bottom: 0;
    background-color: rgba(219, 28, 12, 0.44);
    position: absolute;
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
  .detail-info-title {
    display: inline-block;
    vertical-align: bottom;
    width: 248px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
