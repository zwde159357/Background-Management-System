import { FuncApi } from '../util/api.js';

export default {
        namespaced: true,
        modules: {},
        state: {
                list: [],                       // 功能列表
                isInit: false,                  // 是否已经请求了功能数据
        },
        getters: {},
        mutations: {
                _init(state, list) {
                        state.list = list;
                        state.isInit = true;
                },
                _add(state, func) { state.list.push(func); },
                _remove(state, id) {
                        let i = state.list.findIndex(item => item.func_id === id);
                        state.list.splice(i, 1);
                },
                _update(state, func) {
                        let i = state.list.findIndex(item => item.func_id === func.func_id);
                        state.list.splice(i, 1);
                        state.list.push(func);
                }
        },
        actions: {
                async init({ commit, state }) {
                        if(state.isInit) return;
                        const list = await FuncApi.all();
                        commit('_init', list);
                },
                async add({ commit }, func) {
                        func.func_id = await FuncApi.add(func);
                        commit('_add', func);
                },
                async remove({ commit }, id) {
                        await FuncApi.remove(id);
                        commit('_remove', id);
                },
                async update({ commit }, func) {
                        await FuncApi.update(func);
                        commit('_update', func);
                }
        }
};