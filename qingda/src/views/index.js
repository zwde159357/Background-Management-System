import Class from "./Class/index.vue";
import PwdChange from "./PwdChange/index.vue";
import Role from "./Role/index.vue";
import Staff from "./Staff/index.vue";
import Student from "./Student/index.vue";
import User from "./User/index.vue";
import Func from './Func/index.vue';
import New from './New/index.vue';
import ClassRoom from './ClassRoom/index.vue';

export default {
        Class: { name: '班级管理组件', component: Class },
        PwdChange: { name: '密码修改组件', component: PwdChange },
        Role: { name: '角色管理组件', component: Role },
        Staff: { name: '员工管理组件', component: Staff },
        Student: { name: '学生管理组件', component: Student },
        User: { name: '用户管理组件', component: User },
        Func: { name: '系统管理组件', component: Func },
        New: { name: '新增管理组件', component: New },
        ClassRoom: { name: '教室管理组件', component: ClassRoom },
}