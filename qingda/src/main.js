import Vue from 'vue';
import App from './App.vue';
import router from './router/index.js';
import store from './store/index';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/reset.css';
import './assets/public.css';
import http from './util/http';


Vue.use(ElementUI);
// 拓展ElemnetUI组件中的$confirm组件
Vue.prototype.$alwaysPendingPromise = new Promise(() => {});
Vue.prototype.$confirmEx = function(messages, title, options) {
        return Vue.prototype.$confirm(messages, title, options)
                .catch(() => Vue.prototype.$alwaysPendingPromise);
};

Vue.prototype.$http = http;

new Vue({
        el: '#app',
        router,
        store,
        // components: { App },
        render: h => h(App),
        // render: function(createment) { createment(App) }
});