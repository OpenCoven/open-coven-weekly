<template>
  <div class="slidev-layout content-layout">
    <slot />
  </div>
</template>

<style scoped>
.content-layout {
  width: 100%; height: 100%;
  background: #080808;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 72px;
  overflow: hidden;
}
</style>
