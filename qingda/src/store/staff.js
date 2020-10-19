import { StaffApi } from '../util/api.js';

export default {
        namespaced: true,
        state: {
                list: [],
                total: 0,
                isList: false,
                count: 0,
                staffList: []
        },
        modules: {},
        getters: {},
        mutations: {
                _init(state, list) {
                        state.list = list.list;
                        state.total = list.total;
                },
                _add(state, it) { state.list.push(it); },
                _update(state, it) {
                        let i = state.list.findIndex(item => item.stf_id === it.stf_id);
                        state.list.splice(i, 1, it);
                        if(state.staffList) {
                                let j = state.staffList.findIndex(item => item.stf_id === it.stf_id);
                                console.log(j);
                                state.staffList.splice(j, 1, it);
                        }
                },
                _dimission(state, id) {
                        let it = state.list.find(item => item.stf_id === id);
                        it.stf_invalid = 0;
                },
                _reinstate(state, id) {
                        let it = state.list.find(item => item.stf_id === id);
                        it.stf_invalid = 1;
                },
                _listbycategory(state, { list, stf_category }) {
                        state.staffList =state.staffList.concat(list);
                        state.count = state.count + 1;
                }
        },
        actions: {
                async init({ commit,state }, data) {
                        const list = await StaffApi.list(data);
                        commit('_init', list);
                },
                async add({ commit }, data) {
                        const id = await StaffApi.add(data);
                        console.log(data);
                        data.stf_id = id;
                        commit('_add', data);
                },
                async update({ commit }, data) {
                        await StaffApi.update(data);
                        commit('_update', data);
                },
                async dimission({ commit }, id) {
                        await StaffApi.dimission(id);
                        commit('_dimission', id);
                },
                async reinstate({ commit }, id) {
                        await StaffApi.reinstate(id);
                        commit('_reinstate', id);
                },
                async listbycategory({ commit, state }, stf_category) {
                        if(state.count === 3) return;
                        let list = await StaffApi.listbycategory(stf_category);
                        commit('_listbycategory', { list, stf_category } );
                }
        }
};