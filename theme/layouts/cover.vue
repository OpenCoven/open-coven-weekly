<template>
  <!-- Title layout: full bleed, violet left accent, big centered text -->
  <div class="title-layout">
    <div class="accent-bar" />
    <div class="content">
      <slot name="eyebrow"><div class="eyebrow">Weekly Open Coven</div></slot>
      <slot />
    </div>
    <div class="corner-tag">discord.gg/opencoven</div>
  </div>
</template>

<style scoped>
.title-layout {
  position: relative;
  width: 100%; height: 100%;
  background: #080808;
  display: flex;
  align-items: center;
  padding: 0 6rem;
  overflow: hidden;
}
.accent-bar {
  position: absolute;
  left: 0; top: 10%; bottom: 10%;
  width: 3px;
  background: #9A8ECD;
  border-radius: 2px;
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
.corner-tag {
  position: absolute;
  bottom: 2.5rem;
  right: 4rem;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: #333;
  text-transform: uppercase;
}
</style>
