import axios from 'axios';
import { MessageBox, Message, Loading } from 'element-ui';
import router from '../router';

// 创建一个公用的永远是pending的prom来应对ajax中所有的错误情况，这样可以让
// 组件中的代码更优雅
const alwaysPendingPromise = new Promise(() => {});
// 创建axios实例
const instance = axios.create();
// 创建一个loading实例
let loadingInstance = null;
let loadingAjaxCount = 0;                           // 记录当下loading开启的次数，主要解决同时发起多个ajax时loading打开关闭混乱问题

function beiginAjax() {
        if(loadingAjaxCount === 0) {
                loadingInstance = Loading.service({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                });
        }
        loadingAjaxCount++;
}

function endAjax() {
        if(loadingAjaxCount === 1) {
                loadingInstance.close();
                loadingInstance = null;
        }
        loadingAjaxCount--;
}


// 设置实例请求发出前的拦截器
instance.interceptors.request.use(
        config => {
                config.headers = {
                        "Authorization": sessionStorage.getItem('token')
                };
                beiginAjax();
                return config;
        },
        error => {
                // 关闭loading效果
                endAjax();
                MessageBox.alert(error.message, '提示', { type: 'error' });
                return alwaysPendingPromise;
        }
);
// 设置实例响应后的拦截器
instance.interceptors.response.use(
        async response => {
                // 卡主0.5s
                await new Promise(resolve => {
                        setTimeout(() => resolve(),500);
                });
                // 关闭loading效果
                endAjax();
                if(response.status === 200) {
                        let { status, data, message } = response.data;
                        switch(status) {
                                case 200:
                                        // 如果响应头的authorization中包含最新的token，更新到Cookies的token中
                                        // if(response.headers.authorization) sessionStorage.setItem('token', response.headers.authorization);
                                       if(message) Message({ message, type: 'success' });
                                        return data;
                                case 401:
                                        sessionStorage.removeItem('token');
                                        // router.replace({ path: '/login', query: { back: router.currentRoute.fullpath  } });
                                        router.replace('/login');
                                case 404:
                                case 199:
                                case 500:
                                        if(message) MessageBox.alert(message,'提示',{ type: 'error' });
                                        return alwaysPendingPromise;
                        }
                } else {
                        MessageBox.alert(response.status, '提示', { type: 'error' });
                        return alwaysPendingPromise;
                }
        },
        error => {
                // 关闭loading效果
                endAjax();
                MessageBox.alert(error.message, '提示', { type: 'error' });
                return alwaysPendingPromise;
        }
);

// 导出加强版的axios
export default instance;