<template>
  <div class="v_home">
    <div>
      <header class="header">
        Mail Feed
        <button @click="$emit('sign-out')">Sign Out</button>
      </header>
      <main>
        <ul>
          <li v-for="label in labels" :key="label.id">
            <router-link :to="{ name: 'Label', params: { id: label.id } }">
              {{ label.name.replace('newsly_', '') }}
            </router-link>
          </li>
        </ul>
      </main>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Home',
    computed: {
      labels() {
        return this.$store.getters.getAllLabels;
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
