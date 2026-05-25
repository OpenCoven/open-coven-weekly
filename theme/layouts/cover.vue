<template>
  <div class="slidev-layout cover title-layout">
    <div class="content">
      <slot name="eyebrow"><div class="eyebrow">Weekly Open Coven</div></slot>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.title-layout {
  position: relative;
  width: 100%; height: 100%;
  background: #050409;
  display: flex;
  align-items: center;
  padding: 0 72px;
  overflow: hidden;
}
.content { max-width: 820px; position: relative; z-index: 1; }
.eyebrow {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #C9A7FF;
  margin-bottom: 1.4rem;
}
</style>
