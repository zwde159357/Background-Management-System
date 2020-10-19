import Vuex from 'vuex';
import Vue from 'vue';
import http from '../util/http.js';
// 导入子仓库
import role from './role.js';
import func from './func.js';
import classmanage from './classmanage.js';
import dictionary from './dictionary.js';
import classroom from './classroom.js';
import staff from './staff.js';

// 让所有组件可以无条件使用$store访问仓库对象
Vue.use(Vuex);

const store = new Vuex.Store({
        // 总仓库中存放子仓库中共用数据
        state: {
                http,
        },
        // 拆分总仓库
        modules: {
                role,
                func,
                dictionary,
                classroom,
                classmanage,
                staff,
        },
        // 仓库的计算属性，若两个以上的组件需要，则在getters计算
        getters: {},
        // 用来修改state中的数据
        // 只有在mutations节点中才可以修改state中的数据
        // mutations中的方法不能包含异步耗时的代码，只能包含同步的代码
        // mutations中的方法在调用时第一个参数为state节点本身，总是指向自身层级的state
        // 第二个参数才是调用时实际传递的参数
        mutations: {},
        // actions中的方法一般包含异步耗时的代码
        // actions中的方法不能直接修改state中的数据，如果要修改，则要调用mutations节点中的方法
        // 间接修改
        // actions中的方法在调用时第一个参数是一个比较复杂的对象，
        // 第二个参数是调用时实际传递的参数
        actions: {}
});

export default store;