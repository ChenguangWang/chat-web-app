<template>
  <div class="user-info-wrap">
    <section>
      <header>
        <div class="title-icon"></div>
        <h4>帐号信息</h4>
      </header>
      <a-row class="content-item">
        <a-col class="label" :span="6">帐号名</a-col>
        <a-col :span="14">{{ userInfo.userAccount || userInfo.phoneNumber }}</a-col>
        <a-col :span="4" class="operate-wrap">
          <span class="operate-btn" @click="openModal('account')">编辑</span>
        </a-col>
      </a-row>
      <a-row class="content-item">
        <a-col class="label" :span="6">手机号</a-col>
        <a-col :span="18">{{ userInfo.phoneNumber }}</a-col>
      </a-row>
      <a-row class="content-item">
        <a-col class="label" :span="6">密码</a-col>
        <a-col :span="14">已设置</a-col>
        <a-col :span="4" class="operate-wrap">
          <span class="operate-btn" @click="openModal('password')">编辑</span>
        </a-col>
      </a-row>
    </section>
    <section>
      <header>
        <div class="title-icon"></div>
        <h4>使用偏好</h4>
      </header>
      <a-row class="content-item context" :wrap="true">
        <a-col class="label" :span="6">对话上下文</a-col>
        <a-col :span="14">启用对话上下文，可以连续提问并修正回答，但将消耗更多token</a-col>
        <a-col :span="4">
          <a-switch v-model:checked="openContext" />
        </a-col>
      </a-row>
    </section>

    <a-modal v-model:visible="showModal" :width="400" :title="modalTitle" :footer="null">
      <PasswordForm
        v-if="modalType == 'password'"
        :phoneNumber="userInfo.phoneNumber"
      ></PasswordForm>
      <AccountForm v-if="modalType == 'account'"></AccountForm>
    </a-modal>
  </div>
</template>

<script setup>
import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
import { message as antMessage } from 'ant-design-vue';
import { getVerificationCodeForPass, modifyPassword, getUserInfo } from '@/service/user.js';
import { useRouter } from 'vue-router';
import PasswordForm from './components/PasswordForm.vue';
import AccountForm from './components/AccountForm.vue';

const router = useRouter();
const openContext = ref(false);

const showModal = ref(false);
const modalTitle = ref('修改');
const modalType = ref('account');

let userInfo = reactive({
  phoneNumber: '--',
  userAccount: ''
});

const openModal = (type) => {
  showModal.value = true;
  modalTitle.value = type == 'account' ? '修改帐号' : '修改密码';
  modalType.value = type;
};

onMounted(async () => {
  const userRes = await getUserInfo();
  if (userRes.code == 200) {
    userInfo.phoneNumber = userRes.data.phoneNumber;
    userInfo.userAccount = userRes.data.userAccount;
  }
});
</script>

<style lang="less" scoped>
.user-info-wrap {
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
  height: 46px;
  line-height: 46px;
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
  .user-info-wrap {
    padding: 16px 24px;
  }
}
</style>
