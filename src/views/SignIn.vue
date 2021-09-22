<template>
  <div class="v_sign_in">
    <img
      src="../assets/logo_full_vert.svg"
      style="margin: 0 0 30px;"
      width="96"
    />
    <q-btn color="primary" @click="signIn">Sign In</q-btn>
  </div>
</template>

<script>
  export default {
    name: 'SignIn',
    methods: {
      async signIn() {
        console.log('signing In!');
        await this.$store.dispatch('auth/signIn');
        const initialRoute = this.$store.getters['auth/initialRoute'];

        this.$router.push(initialRoute);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .v_sign_in {
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
  }
</style>
