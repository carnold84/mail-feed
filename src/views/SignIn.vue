<template>
  <div>
    <button @click="signIn">Sign In</button>
  </div>
</template>

<script>
  export default {
    name: 'SignIn',
    methods: {
      async signIn() {
        console.log('signing In!');
        await this.$store.dispatch('signIn');
        const initialRoute = this.$store.getters.initialRoute;

        this.$router.push(initialRoute);
      },
    },
  };
</script>
