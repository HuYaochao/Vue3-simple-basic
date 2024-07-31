<template>
    
    <el-col :span="24">
        

        <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo" default-active="2" text-color="#fff">
            <el-menu-item index="1">
                <el-icon><icon-menu /></el-icon>
                <span>管理列表</span>
            </el-menu-item>

        </el-menu>
    </el-col>
</template>

<script lang="ts" setup>
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
} from '@element-plus/icons-vue'
import { ref } from 'vue'
const isCollapse = ref(true)

</script>

<style scoped lang="less">
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
}

.el-menu {
    background-color: @menuBg;
    min-height: 400px;
    height: 100vh;
    border-right: none
}

.logo {
    width: 100%;
    height: 60px;
    background-color: @menuBg;
    display: flex;
    color: white;
    align-items: center;
    justify-content: center;
}
</style>