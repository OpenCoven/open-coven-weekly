<template>
  <div class="content-layout">
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
  padding: 3.5rem 6rem;
  overflow: hidden;
}
</style>
