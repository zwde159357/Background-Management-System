import { DictionaryApi } from '../util/api.js';

export default {
        namespaced: true,
        modules: {},
        state: {
                list: [],
        },
        getters: {},
        mutations: {
                _getStaffInfo(state, list) {
                        state.list = list;
                },
        },

        actions: {
                async getStaffInfo({ commit }) {
                        const list = await DictionaryApi.all();
                        commit('_getStaffInfo', list);
                },
        },

};