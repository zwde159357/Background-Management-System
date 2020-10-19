import { RoleApi } from '../util/api.js';

// 导出角色子仓库
export default {
        namespaced: true,
        state: {
                list: [],
                isInit: false           // 定义数据list是否初始化
        },
        modules: {},
        getters: {},
        mutations: {
                _init(state, { payload }) {
                        state.list = payload;
                        state.isInit = true;
                },
                _remove(state, id) {
                        let i = state.list.findIndex(item => item.role_id === id);
                        state.list.splice(i,1);
                },
                _add(state, role) { state.list.push(role); },
                _update(state, role) {
                        let i = state.list.findIndex(item => item.role_id === role.role_id);
                        state.list.splice(i, 1, role);
                }
        },
        actions: {
                async init({ commit, state }) {
                        if(state.isInit) return;
                        const list = await RoleApi.all();
                        commit('_init', { payload: list });
                },
                async remove({ commit }, id) {
                        await RoleApi.remove(id);
                        commit('_remove', id);
                },
                async add({ commit }, role) {
                        role.role_id = await RoleApi.add(role);
                        commit('_add', role);
                },
                async update({ commit }, role) {
                        await RoleApi.update(role);
                        commit('_update', role);
                },
        },
}