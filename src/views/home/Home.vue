<template>
  <div class="home-wrap" ref="dragContainer">
    <div class="drag-container" :style="{ opacity: !state.uploading ? 0 : 1 }">
      <svg class="drag-effect" xmlns="http://www.w3.org/2000/svg">
        <rect rx="30" ry="30" id="shapesvg" ref="dragEffect" class="shape" />
      </svg>
      <div class="upload-tips">
        <h3>{{ state.uploadTip }}</h3>
        <a-progress :percent="state.uploadProgress" :steps="10" stroke-color="rgba(219, 28, 12, 0.64)" />
      </div>
    </div>
    <section class="chat-container" :style="{ opacity: state.uploading ? 0.1 : 1 }">
      <h1 class="title">智能问答机器人</h1>
      <div class="home-wrap-guide">
        <div class="guide-item-wrap" v-for="example in exampleData" :key="example.label">
          <h2>
            <div>
              <span class="iconfont" :class="example.iconClass"></span>
            </div>
            {{ example.label }}
          </h2>
          <ul>
            <li v-for="item in example.list" :key="item" @click="createSession(item)">
              {{ item }} →
            </li>
          </ul>
        </div>
      </div>
      <!-- <h4 class="new-tips">
        文献阅读助手，点击上传或拖拽pdf文件试试 <span class="icon-new">NEW</span>
      </h4> -->
      <div class="input-wrap">
        <a-input
          v-model:value="inputValue"
          placeholder="和AI聊点什么"
          size="large"
          @pressEnter="createSession()"
        >
          <template #suffix>
            <send-outlined @click="createSession()"/>
          </template>
        </a-input>
      </div>
    </section>
  </div>
</template>

<script>
import { onMounted, ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { uploadFile } from '@/service/file';
import { SendOutlined } from '@ant-design/icons-vue';
import Const from './const';
import { addSession } from '@/service/session.js';
import { useStore } from 'vuex';

export default {
  components: {
    SendOutlined
  },
  setup() {
    const exampleData = Const.exampleData();
    const inputValue = ref();
    const router = useRouter();
    const dragEffect = ref(null);
    const dragContainer = ref(null);
    const store =  useStore();
    const state = reactive({
      uploading: false,
      uploadProgress: 0,
      uploadTip: '松开上传文件'
    });

    function dragEndHandler(e) {
      e.preventDefault();
      const dragEffectDom = dragEffect.value;
      dragEffectDom.classList.remove('anim');
      state.uploading = false;
      // console.log('dragEndHandler',dragEffectDom.classList);
      return false;
    }

    function dragMoveHandler(e) {
      e.preventDefault();
      const dragEffectDom = dragEffect.value;
      dragEffectDom.classList.add('anim');
      state.uploading = true;
      return false;
    }

    async function dropHandler(e) {
      e.preventDefault();
      let file = e.dataTransfer.files[0];

      console.log(
        `File is ${[file.name, file.size, file.type, file.lastModified].join(' ')}`,
        file instanceof FormData
      );
      if (file.size === 0 || file.type !== 'application/pdf') {
        state.uploading = false;
        const dragEffectDom = dragEffect.value;
        dragEffectDom.classList.remove('anim');
        message.warning('请上传pdf文件');
      } else {
        let formData = new FormData();
        formData.append('file', file);
        try {
          const {code, data} = await uploadFile(formData, (res) => {
            state.uploadProgress = parseInt(res.progress * 100)
            state.uploadTip = '正在上传...'
          });
          if(code == 200){
            console.log('upload data', data)
            setTimeout(()=>{
              router.push({
                name: 'file',
                params: {
                  id: data.session
                }
              })
            }, 500)
          }
          
        } catch (err) {
          console.log(err);
        }
      }

      return false;
    }

    onMounted(() => {
      const dragContainerDom = dragContainer.value;
      dragContainerDom.ondragover = dragMoveHandler;
      dragContainerDom.ondragleave = dragEndHandler;
      dragContainerDom.ondrop = dropHandler;
      document.getElementById('shapesvg').style.height = window.innerHeight - 20 + 'px';
    });

    const createSession = (data) => {
      const startMsg = data || inputValue.value;
      addSession({
        message: startMsg,
        sessionType: 1 // 普通对话
      }).then((res) => {
        if (res.code == 200) {
          store.dispatch('session/getList');
          router.push({
            name: 'chat',
            query: {
              msg: startMsg
            },
            params: {
              id: res.data.session
            }
          });
        }
      });
    };
    return {
      inputValue,
      exampleData,
      dragContainer,
      dragEffect,
      state,
      createSession
    };
  }
};
</script>

<style lang="less" scoped>
.home-wrap {
  position: relative;
  text-align: center;
  height: 100%;
  overflow: scroll;
  padding-bottom: 24px;
  .title {
    padding-top: 10vh;
    font-weight: 600;
    margin-bottom: 60px;
    font-size: 36px;
  }
  &-guide {
    margin: 0 24px;
    display: flex;
    padding-bottom: 50px;
    justify-content: center;
    .guide-item-wrap {
      width: 250px;
      margin-right: 24px;
      &:last-child {
        margin-right: 0;
      }
    }
    h2 {
      margin-bottom: 24px;
      .iconfont {
        font-size: 24px;
      }
    }
    ul {
      padding: 0;
    }
    li {
      padding: 16px;
      margin-bottom: 12px;
      background-color: #f1f1f4;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      list-style-type: none;
      &:hover {
        background-color: rgba(217, 217, 227, 1);
      }
    }
  }

  .chat-container {
    height: 100%;
    transition: all 0.5s linear;
  }
  .input-wrap {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%);
    width: 65%;
    margin: 34px auto;
    .ant-input-affix-wrapper {
      border-radius: 6px;
      box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.02), 0px 1px 3px 0px rgba(0, 0, 0, 0.02);
    }
  }
  .new-tips {
    display: inline-block;
    font-size: 14px;
    font-weight: 400;
    position: relative;
    span {
      position: absolute;
      right: -35px;
      top: -10px;
      background: rgba(219, 28, 12, 0.64);
      color: #fff;
      border-radius: 4px;
      font-size: 12px;
      display: inline-block;
      padding: 0 5px;
    }
  }
}
.drag-container {
  position: absolute;
  opacity: 1;
  left: 10px;
  top: 10px;
  right: 10px;
  bottom: 10px;
  .upload-tips{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.drag-effect {
  width: 100%;
  height: 100%;
}
.shape {
  width: 100%;
  height: 100%;
  stroke-dasharray: 10 10;
  stroke-dashoffset: 0;
  stroke-width: 6px;
  stroke: #ccc;
  opacity: 0;
  border-radius: 30px;
  fill: transparent;
  animation: run 1.2s linear infinite;
}

.anim {
  opacity: 1;
  stroke: #ccc;
  animation: run 0.2s linear infinite;
}

@keyframes run {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -20px;
  }
}
</style>
