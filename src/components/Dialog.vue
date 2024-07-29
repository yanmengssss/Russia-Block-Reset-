<template>
    <el-dialog
      :model-value="Visible"
      title="结束"
      width="500"
      @close="handleClose"
      :before-close="handleClose"
    >
      <span>游戏结束！总共获得{{ count }}分</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="closeDialog">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import { ElDialog, ElButton } from 'element-plus';
  import 'element-plus/dist/index.css';
  
  const emit = defineEmits(['close']);
  const props = defineProps({
    Visible: {
      type: Boolean,
      required: true
    },
    count: {
      type: Number,
      required: true
    }
  });
  
  
  const handleClose = () => {
    emit('close');
  };
  
  const closeDialog = () => {
    emit('close');
  };
  </script>
  
  <style scoped>
  .dialog-footer {
    text-align: right;
  }
  </style>
  