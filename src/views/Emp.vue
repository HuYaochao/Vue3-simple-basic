<!--  -->
<template>
    <el-card>
        <el-button type="success" style="margin-top: 20px; float: left;" @click="openAddDialog">添加</el-button>
        <h1 style="font-size: 30px;">员工管理</h1>
        <el-table :data="state.employeeData" style="width: 100%">
            <el-table-column type="index" label="序号" width="180" />
            <el-table-column prop="id" label="员工编号" width="180" />
            <el-table-column prop="username" label="用户名" width="180" />
            <el-table-column prop="name" label="姓名" width="180" />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="tel" label="电话" />
            <el-table-column prop="dep" label="部门" />
            <el-table-column label="操作" width="200">
                <template v-slot="scopeSlot">
                    <el-button type="warning" :icon="Edit" size="small" @click="editById(scopeSlot.row)">编辑</el-button>
                    <el-button type="danger" :icon="Delete" size="small"
                        @click="confirmDelete(scopeSlot.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class='pagination'>
            <el-pagination v-model:current-page="state.page.pageNum" v-model:page-size="state.page.pageSize"
                :page-sizes="[5, 10, 15, 20]" :background="background" layout="total, sizes, prev, pager, next, jumper"
                :total="state.page.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </el-card>

    <!-- 删除dialog -->
    <el-dialog v-model="dialogVisible" title="删除功能" width="500" :before-close="handleClose">
        <span>确定要删除该员工吗？</span>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消删除</el-button>
                <el-button type="primary" @click="sureDelete">
                    确认删除
                </el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 添加 -->
    <el-dialog v-model="addDialogVisible" title="添加员工" width="500" :before-close="handleClose">
        <el-form ref="addFormRef" :model="addForm" :rules="rules" label-width="120px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password" type="password" />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email" />
            </el-form-item>
            <el-form-item label="电话" prop="tel">
                <el-input v-model="addForm.tel" />
            </el-form-item>
            <el-form-item label="部门" prop="dep">
                <el-input v-model="addForm.dep" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="addDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="sureAdd">确定</el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog v-model="editDialogVisible" title="编辑员工" width="500" :before-close="handleClose">
        <el-form ref="editFormRef" :model="editForm" :rules="rules" label-width="120px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="editForm.username" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="editForm.password" type="password" />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="editForm.name" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email" />
            </el-form-item>
            <el-form-item label="电话" prop="tel">
                <el-input v-model="editForm.tel" />
            </el-form-item>
            <el-form-item label="部门" prop="dep">
                <el-input v-model="editForm.dep" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="sureEdit">确定</el-button>
            </div>
        </template>
    </el-dialog>

</template>

<script setup lang="ts">
import { ref, reactive, onMounted, inject } from 'vue'
import $http from '@/utils/request'
import { Delete, Edit } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage, ElNotification, ComponentSize, FormInstance, FormRules } from 'element-plus'
import { addEmployee, getEmployeeData, updateEmployee, deleteEmployee } from '@/api/Emp';

const background = ref(true)
const dialogVisible = ref(false)
const editDialogVisible = ref(false)
const addDialogVisible = ref(false)

const state = reactive({
    employeeData: [],
    page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
    },
    deleteCurrentId: 0,
    editCurrentId: 0,
})

// 打开添加对话框
const openAddDialog = () => {
    addDialogVisible.value = true
    resetForm(ruleFormRef.value)

}
// 确认添加
const sureAdd = async () => {
    if (!addFormRef.value) return
    await addFormRef.value.validate(async (valid) => {
        if (valid) {
            const { data } = await addEmployee(addForm)
            
            if (data.message == "OK") {              
                fetchEmployeeData();
                addDialogVisible.value = false
            }
        }
    })
}

// 重置表单
const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
}

// 新增员工表单
const addFormRef = ref<FormInstance>()
const addForm = reactive({
    username: '',
    password: '',
    name: '',
    email: '',
    tel: '',
    dep: ''
})

// 编辑员工表单
const editFormRef = ref<FormInstance>()
const editForm = reactive({
    username: '',
    password: '',
    name: '',
    email: '',
    tel: '',
    dep: ''
})

// 打开编辑对话框
const editById = (row) => {
    editForm.username = row.username
    editForm.password = row.password
    editForm.name = row.name
    editForm.email = row.email
    editForm.tel = row.tel
    editForm.dep = row.dep
    state.editCurrentId = row.id
    editDialogVisible.value = true
}

// 确认编辑
const sureEdit = async () => {
    if (!editFormRef.value) return;
    await editFormRef.value.validate(async (valid) => {
        if (valid) {
            try {
                const { data } = await updateEmployee(state.editCurrentId, editForm);
                if (data.message === "OK") {
                    fetchEmployeeData();
                    editDialogVisible.value = false;
                }
            } catch (error) {
                ElMessage.error('编辑失败');
            }
        }
    });
};


const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive({
    id: '',
    username: '',
    password: '',
    name: '',
    email: '',
    tel: '',
    dep: ''
})

const rules = reactive<FormRules<typeof ruleForm>>({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 15, message: '长度应在 3 到 15 个字符', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于 6 个字符', trigger: 'blur' },
    ],
    name: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
    ],
    tel: [
        { required: true, message: '请输入电话', trigger: 'blur' },
        { pattern: /^[0-9]{11}$/, message: '请输入有效的11位电话号码', trigger: 'blur' },
    ],
    dep: [
        { required: true, message: '请选择部门', trigger: 'change' },
    ]
})

// 获取员工数据
const fetchEmployeeData = async () => {
    try {
        console.log('Fetching employee data...'); // 添加调试信息
        const response = await getEmployeeData(state.page.pageNum, state.page.pageSize);
        console.log('Response:', response); // 添加调试信息
        const {data} = response.data; // 确认获取到的 data 格式正确
        console.log('Data:', data); // 添加调试信息
        state.employeeData = data.rows; // 确认 data 中有 rows 属性
        state.page.total = data.total; // 确认 data 中有 total 属性
    } catch (error) {
        console.error('Error:', error); // 添加调试信息
        ElMessage.error('获取员工数据失败');
    }
};

// 确认删除对话框
const confirmDelete = (id: number) => {
    state.deleteCurrentId = id
    dialogVisible.value = true
}

//确认删除
async function sureDelete() {
    dialogVisible.value = false
    const { data } = await $http.get(`/emp/deleteById`, {
        params: { id: state.deleteCurrentId }
    })
    if (data.message == "OK") {
        ElMessage({
            message: '删除成功',
            type: 'success',
        })
    } else if (data.message == "ERROR") {
        ElMessage({
            message: '删除失败',
            type: 'error',
        })
    }
    fetchEmployeeData();
}

//关闭 /编辑删除提示框
const handleClose = (done: () => void) => {
    ElMessageBox.confirm('确定关闭提示框么')
        .then(() => {
            done()
        })
        .catch(() => {
            // catch error
        })
}

const handleSizeChange = (val: number) => {
    state.page.pageSize = val
    fetchEmployeeData();
}

const handleCurrentChange = (val: number) => {
    state.page.pageNum = val
    fetchEmployeeData();
}

onMounted(() => {
    fetchEmployeeData();
})
</script>

<style  scoped lang="less">

</style>
