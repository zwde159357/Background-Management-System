import http from './http.js';

export const UserApi = {
        list: data => http({method: 'post', url: '/user/list', data}),
        add: data => http({ method: 'post', url: '/user/add', data }),
        update: data => http({ method: 'post', url: '/user/change_pwd', data }),
        remove: user_name => http({ method: 'post', url: '/user/remove/' + user_name }),
        setRole: data => http({ method: 'post', url: '/user/config_role', data }),
        validName: user_name => http({ method: 'post', url: '/user/valid_name', data: { user_name } }),
        changePwd: data => http({ method: 'post', url: '/user/pwdchange', data }),
};

export const FuncApi = {
        all: data => http({ method: 'get', url: '/function/all' }),
        add: data => http({ method: 'post', url: '/function/add', data }),
        update: data => http({ method: 'post', url: '/function/update', data }),
        remove: id => http({ method: 'post', url: '/function/remove/' + id }),
};

export const RoleApi = {
        all: data => http({ method: 'get', url: '/role/all' }),
        add: data => http({ method: 'post', url: '/role/add', data }),
        update: data => http({ method: 'post', url: '/role/update', data }),
        remove: id => http({ method: 'post', url: '/role/remove/' + id }),
};

export const RoleFuncApi = {
        getRoleFunc: role_id => http({ method: 'get', url: '/role_function/list/' + role_id }),
        configRoleFunc: data => http({ method: 'post', url: '/role_function/config', data }),
};

export const StaffApi = {
        list: data => http({ method: 'post', url: '/staff/list', data }),
        listbycategory: stf_category => http({ method: 'get', url: '/staff/listbycategory/' + stf_category }),
        add: data => http({ method: 'post', url: '/staff/add', data }),
        update: data => http({ method: 'post', url: '/staff/update', data }),
        dimission: stf_id => http({ method: 'get', url: '/staff/dimission/' + stf_id }),
        reinstate: stf_id => http({ method: 'get', url: '/staff/reinstate/' + stf_id })
};

export const DictionaryApi =  {
        all: data => http({ method: 'get', url: '/dictionary/all' }),
};

export const ClassRoomApi = {
        all: data => http({ method: 'get', url: '/classroom/all' }),
        add: data => http({ method: 'post', url: '/classroom/add', data }),
        update: data => http({ method: 'post', url: '/classroom/update', data }),
        remove: clsr_id => http({ method: 'get', url: '/classroom/remove/' + clsr_id })
};

export const ClassApi = {
        all: data => http({ method: 'get', url: '/class/all' }),
        list: data => http({ method: 'post', url: '/class/list', data }),
        validname: data => http({ method: 'post', url: '/class/valid_name', data }),
        add: data => http({ method: 'post', url: '/class/add', data }),
        update: data => http({ method: 'post', url: '/class/update', data }),
        begin: data => http({ method: 'post', url: '/class/begin', data }),
        end: data => http({ method: 'post', url: '/class/end', data })
};

export const StudentApi = {
        list: data => http({method: 'post', url: '/student/list', data}),
        validphone: data => http({method: 'post', url: '/student/valid_phone', data}),
        add: data => http({method: 'post', url: '/student/add', data}),
        update: data => http({method: 'post', url: '/student/update', data}),
        assignclass: data => http({ method: 'post', url: '/student/assignclass', data }),
        avatarupload: data => http({ method: 'post', url: '/student/avatarupload' }),
        avatarupdate: data => http({ method: 'post', url: '/student/avatarupdate', data })
};