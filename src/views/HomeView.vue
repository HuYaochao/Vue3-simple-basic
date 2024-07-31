<!--  -->
<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <Menu></Menu>
      </el-aside>
      <el-container>
        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import Menu from '../components/Menu.vue'
</script>

<style  scoped lang="less">
.common-layout {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.el-container {
  height: 100%;
}

.el-header,
.el-footer {
  background-color: #B3C0D1;
  color: #333;
  // text-align: center;
  line-height: 80px;
}

.el-aside {
  background-color: @menuBg;
  color: #333;
  text-align: center;
  /* line-height: 200px; */
  overflow: hidden;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  /* line-height: 160px; */
}
</style>

