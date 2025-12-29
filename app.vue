<template>
  <NuxtPage />
</template>

<style>
  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
  }

  /* Transitions de page */
  .page-enter-active,
  .page-leave-active {
    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  }

  .page-enter-from {
    opacity: 0;
    transform: scale(0.98);
  }

  .page-enter-to {
    opacity: 1;
    transform: scale(1);
  }

  .page-leave-from {
    opacity: 1;
    transform: scale(1);
  }

  .page-leave-to {
    opacity: 0;
    transform: scale(1.02);
  }
</style>

