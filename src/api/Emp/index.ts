import http from '@/utils/request'


// 定义与员工相关的 API 请求方法


// 添加员工
export const addEmployee = (data: any) => {
    return http.post('/emp/add', data);
};

// 获取员工数据
export const getEmployeeData = (pageNum: number, pageSize: number) => {
    return http.get('/emp/listByPage', {
        params: {
            pageNum,
            pageSize
        }
    });
};

// 编辑员工
export const updateEmployee = (id: number, data: any) => {
    return http.post(`/emp/update?id=${id}`, data);
};

// 删除员工
export const deleteEmployee = (id: number) => {
    return http.delete('/emp/deleteById', {
        params: { id }
    });
};

