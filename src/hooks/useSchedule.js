import { onMounted, ref } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router"


export default () => {
    let route = useRoute();
    let progress = ref(0); //进度
    let stepText = ref('')
    
    let sse = ref(null);


    const createSSE = (id) => {
        let _id = id || route.params.id;
        sse.value = new EventSource('/sse');
        sse.value.onmessage = (event) => {
            progress.value = event.data;
            stepText.value = event.data;
        }
        sse.value.onerror = () => {
            
        }
    }

    onMounted(createSSE)

    onBeforeRouteUpdate((to, from) => {
        let id = to.params.id;
        sse.value.close();
        createSSE(id)
    })
    return {
        progress,
        stepText
    }
}