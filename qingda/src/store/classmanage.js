import { ClassApi } from '../util/api.js';

export default {
        namespaced: true,
        state: {
                list: [],
                isInit: false,
        },
        getters: {},
        modules: {},
        mutations: {
                _init(state, list) {
                        state.list = list;
                        state.isInit = true;
                },
                _getAll(state, list) {
                        state.list = list;
                },
        },
        actions: {
                async init({ commit, state }, data) {
                        if(state.isInit) return;
                        const list = await ClassApi.list(data);
                        commit('_init', list);
                },
                async getAll({ commit }) {
                        const list = await ClassApi.all();
                        commit('_getAll', list);
                },
        }
};