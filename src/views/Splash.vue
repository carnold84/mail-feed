<template>
  <div class="v_splash">
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 20H4C2.89543 20 2 19.1046 2 18V5.913C2.04661 4.84255 2.92853 3.99899 4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20ZM4 7.868V18H20V7.868L12 13.2L4 7.868ZM4.8 6L12 10.8L19.2 6H4.8Z"
      />
    </svg>
    <c-typography component="h1" variant="h3">Newsly</c-typography>
  </div>
</template>

<script>
  import CTypography from '../components/CTypography.vue';

  export default {
    name: 'Splash',
    components: { CTypography },
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
    background-color: var(--primary);
    display: flex;
    fill: #ffffff;
    height: 100%;
    justify-content: center;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;

    h1 {
      color: #ffffff;
      font-weight: 400;
      margin: 0 0 0 10px;
    }
  }
</style>
