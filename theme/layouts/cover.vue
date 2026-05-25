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
  background: #080808;
  display: flex;
  align-items: center;
  padding: 0 72px;
  overflow: hidden;
}
.content { max-width: 820px; }
.eyebrow {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #9A8ECD;
  margin-bottom: 1.4rem;
}
</style>
