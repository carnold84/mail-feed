<template>
  <div v-if="isSignedIn === undefined">Loading...</div>
  <router-view v-else />
</template>

<script>
  export default {
    name: 'Home',
    computed: {
      isSignedIn() {
        return this.$store.getters.isSignedIn;
      },
    },
    async mounted() {
      console.log(this.$gapi);
      this.gapi = await this.$gapi.getGapiClient();
      this.gapi.auth2
        .getAuthInstance()
        .isSignedIn.listen(this.updateSigninStatus);

      const isSignedIn = this.gapi.auth2.getAuthInstance().isSignedIn.get();

      this.$store.dispatch('setSignedIn', isSignedIn);
    },
    methods: {
      updateSigninStatus(isSignedIn) {
        this.$store.dispatch('setSignedIn', isSignedIn);
      },
    },
  };
</script>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>
