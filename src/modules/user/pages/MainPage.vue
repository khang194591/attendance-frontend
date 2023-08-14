<template>
  <div class="flex-1 flex flex-col gap-8 px-4">
    <div class="bg-white border my-4 rounded-lg">
      <ElCollapseTransition>
        <div v-show="showFilter">
          <FilterForm />
        </div>
      </ElCollapseTransition>
      <div class="inline-flex justify-between p-4 w-full">
        <div class="w-80 inline-flex gap-2">
          <ElTooltip :content="$t(`common.button.${showFilter ? 'hideFilter' : 'showFilter'}`)">
            <ElButton
              :icon="showFilter ? IconAdjustmentsOff : IconAdjustments"
              type="info"
              @click="showFilter = !showFilter"
            />
          </ElTooltip>
          <ElInput v-model="name" :placeholder="$t('common.button.search')" @keyup.enter="store.onSearch" />
        </div>
        <div class="flex flex-row gap-2">
          <ElButton :icon="IconDownload" @click="onDownload">{{ $t('common.button.export') }}</ElButton>
          <ElButton :icon="IconUpload" @click="onClickUpload"
            >{{ $t('common.button.import') }}
            <input
              id="fileUpload"
              ref="fileRef"
              type="file"
              class="hidden"
              @change="onUpload"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
          </ElButton>
          <ElButton type="primary" :icon="IconPlus" @click="onCreate">{{ $t('common.button.add') }}</ElButton>
        </div>
      </div>
      <UserTable />
      <UserForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconDownload, IconPlus, IconUpload, IconAdjustments } from '@tabler/icons-vue'
import { computed, onMounted, ref } from 'vue'
import FilterForm from '../components/FilterForm.vue'
import UserForm from '../components/UserForm.vue'
import UserTable from '../components/UserTable.vue'
import { useUserStore } from '../user.store'
import { IconAdjustmentsOff } from '@tabler/icons-vue'
import axios from 'axios'
import * as XLSX from 'xlsx'
import { UploadFile, UploadFiles } from 'element-plus'
import { showErrorNotification, showSuccessNotification } from '@/shared/utils'

onMounted(async () => {
  await store.fetchUserList()
})

const store = useUserStore()

const showFilter = ref(false)

const fileRef = ref()

const form = computed(() => store.filterForm)

const name = form.value.useFieldModel('name')

function onCreate() {
  store.patchUserForm({ open: true })
}

async function onDownload() {
  const response = await axios.get('/user')
  const worksheet = XLSX.utils.json_to_sheet(response.data.items)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'User')
  XLSX.writeFile(workbook, 'user.xlsx', { compression: true })
}

function onClickUpload() {
  document?.getElementById('fileUpload')?.click()
}

async function onUpload(event: any) {
  var input = event.target
  var reader = new FileReader()
  reader.onload = () => {
    var fileData = reader.result
    var wb = XLSX.read(fileData, { type: 'binary' })
    wb.SheetNames.forEach((sheetName) => {
      var rowObj = XLSX.utils.sheet_to_json(wb.Sheets[sheetName])
      axios.post('/user/bulk', rowObj).then((response) => {
        if (response.status === 409) {
          showErrorNotification(response.data.message)
        } else {
          showSuccessNotification()
        }
      })
    })
  }
  reader.readAsBinaryString(input.files[0])
}
</script>
