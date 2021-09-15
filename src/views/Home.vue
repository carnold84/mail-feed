<template>
  <div class="v_home">
    <div>
      <header class="header">
        Mail Feed
        <button @click="$emit('sign-out')">Sign Out</button>
      </header>
      <main>
        <p v-if="labels === undefined">Loading...</p>
        <div v-else>
          <button
            v-for="label in labels"
            :key="label.id"
            @click="onLabelSelect(label)"
          >
            {{ label.name.replace('newsly_', '') }}
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Home',
    data() {
      return {
        isLoading: null,
        labels: undefined,
        selectedLabel: null,
      };
    },
    async mounted() {
      const gapi = await this.$gapi.getGapiClient();
      const response = await gapi.client.gmail.users.labels.list({
        userId: 'me',
      });
      this.labels = response.result.labels.filter(({ name }) => {
        return name.includes('newsly_');
      });
    },
    methods: {
      onLabelSelect(label) {
        this.selectedLabel = label;
      },
    },
  };
</script>

<style scoped>
  .v_home {
    background-color: blanchedalmond;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
</style>
