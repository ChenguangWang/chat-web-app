<template>
  <div class="home-wrap">
    <h1 class="title">爱能智慧助手</h1>
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
    <div class="input-wrap">
      <a-input
        v-model:value="inputValue"
        placeholder="和AI聊点什么"
        size="large"
        @pressEnter="createSession()"
      >
        <template #suffix>
          <send-outlined />
        </template>
      </a-input>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { SendOutlined } from '@ant-design/icons-vue';
import Const from './const';
export default {
  components: {
    SendOutlined
  },
  setup() {
    const exampleData = Const.exampleData();
    const inputValue = ref();
    const router = useRouter();

    const createSession = (data) => {
      const startMsg = data || inputValue.value;
      router.push({
        name: 'chat',
        query: {
          msg: startMsg
        }
      });
    };
    return {
      inputValue,
      exampleData,
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
    font-size: 40px;
  }
  &-guide {
    margin: 0 24px;
    display: flex;
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
}
</style>
