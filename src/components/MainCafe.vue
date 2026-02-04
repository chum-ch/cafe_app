<script setup>

</script>

<template>
  <div class="main-container">
    <header>
      <slot name="header"></slot>
    </header>

    <main class="content-body">
      <slot name="body"></slot>
    </main>

    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* Or any height, e.g., 500px */
}

.content-body {
  flex: 1;
  /* Grows to take up all available space */
  overflow-y: auto;
  /* Shows vertical scrollbar only when needed */
  min-height: 0;
  /* Prevents flex items from bulging out in some browsers */
}

header,
footer {
  flex-shrink: 0;
  /* Ensures header/footer don't squash */
}
</style>