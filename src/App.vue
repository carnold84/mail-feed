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
  :root {
    --base_font_size: 10px;
    --primary: #1e70ce;
    --secondary: #e98400;

    --font-family-primary: 'Roboto Condensed', Helvetica, Arial, sans-serif;
    --font-color-primary: rgba(0, 0, 0, 0.8);
    --font-color-secondary: rgba(0, 0, 0, 0.5);

    --c_textField_icon_fill: var(--font-color-primary);
    --c_textField_label_color: var(--font-color-primary);
    --c_textField_field_bgColor: #ffffff;
    --c_textField_field_borderColor: #eeeeee;
    --c_textField_field_borderColor__focus: var(--primary);
    --c_textField_field_color: var(--font-color-secondary);
    --c_textField_error_color: #a70008;

    --logo-fill: #ffffff;

    --button-bg-color: #ffffff;
    --button-bg-color__HOVER: var(--button-bg-color);
    --button-border-color: #eeeeee;
    --button-border-color__HOVER: var(--button-border-color);
    --button-primary-bg-color: var(--primary);
    --button-primary-border-color: var(--primary);
    --button-primary-bg-color__HOVER: var(--primary);
    --button-primary-border-color__HOVER: var(--primary);
    --loading-icon-color: var(--primary);
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  html {
    -webkit-font-smoothing: antialiased;
    font-size: var(--base_font_size);
    font-family: var(--font-family-primary);
  }

  body {
    margin: 0;
  }
</style>
