<template>
  <div class="p-4">
    <el-row :gutter="16">
      <el-col :span="8">
        <div class="statistic-card shadow">
          <el-statistic :value="full" title="Working">
            <template #title>
              <div style="display: inline-flex; align-items: center">Working</div>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="statistic-card shadow">
          <el-statistic :value="absence" title="Working">
            <template #title>
              <div style="display: inline-flex; align-items: center">Absence</div>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="statistic-card shadow">
          <el-statistic :value="late" title="Working">
            <template #title>
              <div style="display: inline-flex; align-items: center">Late</div>
            </template>
          </el-statistic>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/modules/auth/auth.store'
import axios from 'axios'

onMounted(async () => {
  const response = await axios.get(`/attendance/time-sheet?startDate=2023-08-01&endDate=2023-08-31`)
  if (response.data.total === 1) {
    const item = response.data.items[0]
    absence.value = item.absence
    full.value = item.full
    late.value = item.late
  }
})

const absence = ref(0)
const full = ref(0)
const late = ref(0)

const authStore = useAuthStore()
</script>

<style scoped>
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}
.red {
  color: var(--el-color-error);
}
</style>
