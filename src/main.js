import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Antd from 'ant-design-vue';
import store from './store';
import 'ant-design-vue/dist/antd.less';

import './assets/css/main.css';
import './assets/font/iconfont.css';

const app = createApp(App);

router.beforeEach((to, from, next) => {
  document.title = to.meta.name
    ? `${to.meta.name}_TalkBot聊天机器人_免费AI对话`
    : 'TalkBot聊天机器人_免费AI对话';
  next();
});

app.use(router);
app.use(store);
app.use(Antd);

app.mount('#app');
