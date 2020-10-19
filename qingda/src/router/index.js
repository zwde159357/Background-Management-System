import VueRouter from 'vue-router';
import Home from '../pages/Home/index.vue';
import Login from '../pages/Login/index.vue';
import Vue from 'vue';
// 注册组件时要用
// 让所有组件可以无条件使用router-link, router-view和$router,$route访问路由
Vue.use(VueRouter);

let router = new VueRouter({
        routes: [
                { path: '/', redirect: '/login' },
                { path: '/login', component: Login },
                { path: '/home', component: Home }
        ]
});

router.beforeEach((to, from, next) => {
        if(to.path === '/home' && !sessionStorage.getItem('token'))
                next({ path: '/login', replace: true });
        else
                next();
});

export default router;