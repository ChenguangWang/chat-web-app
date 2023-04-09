import { onMounted, ref, onBeforeUnmount, watch } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import { message } from 'ant-design-vue';
import { useStore } from 'vuex';

export default () => {
    const newMessage = ref('');
    const chatWrapDom = ref();
    const loadingImg = loadingGIF;
    let disabledInput = ref(false);
    let messages = reactive([]);
    


    return {
        messages,
    }
}