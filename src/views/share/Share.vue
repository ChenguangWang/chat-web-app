<template>
  <div class="share-wrap">
    <section>
      <header>
        <div class="title-icon"></div>
        <h4>分享</h4>
      </header>
      <a-row class="content-item">
        <a-col class="label" :span="6">分享链接</a-col>
        <a-col :span="14" style="word-wrap: break-word">{{ shareData.url || '' }}</a-col>
        <a-col :span="4" class="operate-wrap">
          <span v-show="shareData.url" class="operate-btn" @click="copy">复制</span>
        </a-col>
      </a-row>
    </section>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { message as antMessage } from 'ant-design-vue';
import { getShareUrl } from '@/service/user.js';
import { copyText } from '@/utils/tools.js';

const shareData = reactive({
  url: '',
  code: ''
});

const copy = () => {
  copyText(shareData.url, () => {
    antMessage.success('复制成功');
  });
};

onMounted(async () => {
  const res = await getShareUrl();
  if (res.code == 200) {
    shareData.url = res.data.url;
    shareData.code = res.data.code;
  }
});
</script>

<style lang="less" scoped>
.share-wrap {
  width: 80%;
  padding: 30px 56px;
  margin: 24px auto;
  background: #fff;
  font-size: 12px;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
}

header {
  display: flex;
  align-items: center;
  margin: 16px 0;
  h4 {
    font-size: 14px;
    margin-left: 8px;
  }
}

.content-item {
  font-size: 14px;
  border-bottom: 1px solid rgb(220, 220, 220);
  .label {
    font-weight: 500;
  }
  .ant-col {
    padding-left: 14px;
  }
  .operate-wrap {
    color: @primary-color;
    text-align: center;
  }
  .operate-btn {
    cursor: pointer;
  }
  &.context {
    height: auto;
    line-height: normal;
  }
  &:last-child {
    border: none;
  }
}

.title-icon {
  width: 3px;
  height: 16px;
  background: @primary-color;
}

@media only screen and (max-width: 768px) {
  .share-wrap {
    padding: 16px 24px;
  }
}
</style>
