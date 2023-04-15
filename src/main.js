import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Antd from 'ant-design-vue';
import store from './store';
import 'ant-design-vue/dist/antd.less';

import './assets/css/main.css';
import './assets/font/iconfont.css';

const app = createApp(App);

app.use(router);
app.use(store);
app.use(Antd);

app.mount('#app');
