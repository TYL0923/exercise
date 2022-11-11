<script setup lang="ts">
function handleGoBack() {

}
</script>

<template>
  <div relative w-screen h-screen bg-gray-50>
    <div
      fixed top-0 left-0
      w-screen h-12 px-4 box-border
      shadow shadow-slate-100 bg-white
      flex items-center
    >
      <div w-60>
        <a-button type="text" @click="handleGoBack">
          返回
        </a-button>
      </div>
      <div flex-1 text-center>
        题目集一
      </div>
      <div w-60>
        --
      </div>
    </div>

    <div
      h-screen box-border py-16 px-8 overflow-y-auto bg-gray-100
      flex justify-center
    >
      <div mb-8 w-screen box-border flex self-start justify-between gap-x-6>
        <div bg-white rounded-2 flex-1 p-4>
          <!-- <question-set /> -->
        </div>
        <div w-60>
          <div bg-white rounded-1 p-2 sticky top-0>
            答题卡
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
