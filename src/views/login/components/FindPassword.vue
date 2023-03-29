<template>
  <div>
    <div class="login-title">
      <b class="acitve pointer">找回密码</b>
      <strong
        v-show="false"
        class="fr"
        :style="{ color: sendSuccess ? 'rgb(89, 186, 115)' : 'rgb(219, 78, 43)' }"
      >
        {{ sendSuccess ? '已发送验证码至您邮箱！' : '发送验证码失败，服务异常！' }}
      </strong>
    </div>
    <template v-if="formType == 'sendForm'">
      <Form ref="sendForm" :model="sendForm" :rules="ruleValidate">
        <FormItem prop="email">
          <Input v-model="sendForm.email" placeholder="键入注册邮箱或注册手机..."></Input>
        </FormItem>
      </Form>
    </template>
    <template v-if="formType == 'findPasswordForm'">
      <Form ref="findPasswordForm" :model="findPasswordForm" :rules="ruleValidate">
        <FormItem prop="email">
          <Input
            v-model="findPasswordForm.email"
            readonly
            placeholder="键入注册邮箱或注册手机..."
          ></Input>
        </FormItem>
        <FormItem prop="password">
          <Input
            v-model="findPasswordForm.password"
            type="password"
            placeholder="6~32位密码"
          ></Input>
        </FormItem>
        <FormItem prop="vcode">
          <Input v-model="findPasswordForm.vcode" type="text" placeholder="请输入验证码">
            <Button
              class="append-btn"
              slot="append"
              :disabled="disabledVcode"
              size="default"
              @click="getVcode"
            >
              {{ disabledVcode ? `${second}(s)` : '获取验证码' }}
            </Button>
          </Input>
        </FormItem>
      </Form>
    </template>
    <div class="login-footer">
      <Button type="primary" @click="handleSubmit">下一步</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FindPassword',
  data() {
    return {
      formType: 'sendForm',
      sendForm: {
        email: ''
      },
      findPasswordForm: {
        email: '',
        password: '',
        vcode: '' // 验证码
      },
      ruleValidate: {
        password: [
          { required: true, message: '密码不能为空！', trigger: 'blur' },
          { type: 'string', message: '密码长度为6~32个字符！', min: 6, max: 32, trigger: 'blur' }
        ],
        email: [
          { required: true, message: ' 邮箱不能为空！', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确！', trigger: 'blur' }
        ],
        vcode: [{ required: true, message: ' 验证码不能为空！', trigger: 'blur' }]
      },
      second: 60, // 验证码保护时间
      disabledVcode: false, // 禁用发送验证码
      sendSuccess: false // 验证码是否发送成功
    }
  },
  methods: {
    /**
     * 获取验证码
     */
    getVcode() {
      this.disabledVcode = true
      let timer = setInterval(() => {
        this.second--
      }, 1000)
      setTimeout(() => {
        this.disabledVcode = false
        this.second = 60
        clearInterval(timer)
      }, 60000)
    },
    /**
     * 提交下一步
     */
    handleSubmit() {
      const formRef = this.formType
      this.$refs[formRef].validate((valid) => {
        if (valid) {
          if (formRef == 'sendForm') {
            // TODO:发送验证码请求
            this.formType = 'findPasswordForm'
            this.findPasswordForm.email = this.sendForm.email
            this.getVcode()
          } else if (formRef == 'findPasswordForm') {
            // TODO: 确认提交后下一步
            this.$router.push('/login')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@font-size-base: 14px;
.login-title {
  padding-top: 36px;
  b {
    font-size: 16px;
  }
  strong {
    font-size: 12px;
    line-height: 24px;
  }
}

.login-footer {
  margin-top: 26px;
  width: 100%;
  :deep(.ivu-btn) {
    height: 44px;
    width: 100%;
    font-weight: bold;
    font-size: @font-size-base;
  }
}

.append-btn {
  width: 100px;
  border: none;
}
</style>
