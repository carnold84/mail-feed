<template>
  <div class="v_splash">
    Newsly
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

<style scoped>
  .v_splash {
    background-color: blanchedalmond;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
</style>
