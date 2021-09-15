<template>
  <p v-if="isSignedIn === null">Loading...</p>
  <sign-in-page v-else-if="isSignedIn === false" @sign-in="onSignIn" />
  <home-page v-else-if="isSignedIn === true" @sign-out="onSignOut" />
</template>

<script>
  import SignInPage from '@/components/SignInPage.vue';
  import HomePage from '@/components/HomePage.vue';

  export default {
    name: 'App',
    components: {
      HomePage,
      SignInPage,
    },
    data() {
      return {
        isSignedIn: null,
        gapi: null,
      };
    },
    async mounted() {
      this.gapi = await this.$gapi.getGapiClient();
      this.gapi.auth2
        .getAuthInstance()
        .isSignedIn.listen(this.updateSigninStatus);

      this.isSignedIn = this.gapi.auth2.getAuthInstance().isSignedIn.get();
    },
    methods: {
      onSignOut() {
        this.gapi.auth2.getAuthInstance().signOut();
      },
      onSignIn() {
        this.gapi.auth2.getAuthInstance().signIn();
      },
      updateSigninStatus(isSignedIn) {
        this.isSignedIn = isSignedIn;
      },
    },
  };
</script>
