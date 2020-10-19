import { ClassRoomApi } from '../util/api.js';

export default {
        namespaced: true,
        state: {
                list: [],
        },
        getters: {},
        modules: {},
        mutations: {
                _init(state, list) { state.list = list; },
                _add(state, data) { state.list.push(data); },
                _update(state, data) {
                        let i = state.list.findIndex(item => item.clsr_id === data.clsr_id);
                        state.list.splice(i, 1, data);
                },
                _remove(state, data) {
                        let i = state.list.findIndex(item => item.clsr_id === data.clsr_id);
                        state.list.splice(i, 1);
                }
        },
        actions: {
                async init({ commit }) {
                        const list = await ClassRoomApi.all();
                        commit('_init', list);
                },
                async add({ commit }, data ) {
                        data.clsr_id = await ClassRoomApi.add(data);
                        commit('_add', data);
                },
                async update({ commit }, data) {
                        await ClassRoomApi.update(data);
                        commit('_update', data);
                },
                async remove({ commit }, clsr_id) {
                        await ClassRoomApi.remove(clsr_id);
                        commit('_remove', clsr_id);
                }
        },
};