<template>
  <div class="v_splash">
    <img src="../assets/logo_full_vert.svg" width="96" />
  </div>
</template>

<script>
  export default {
    name: 'Splash',
    async mounted() {
      await this.$store.dispatch('init');

      const initialRoute = this.$store.getters.initialRoute;

      this.$router.push(initialRoute);
    },
  };
</script>

<style lang="scss" scoped>
  .v_splash {
    align-items: center;
    display: flex;
    fill: var(--primary);
    flex-direction: column;
    height: 100%;
    justify-content: center;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;

    h1 {
      color: var(--primary);
      font-weight: 400;
      margin: 0;
    }
  }
</style>
