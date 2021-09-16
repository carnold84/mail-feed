<template>
  <div class="v_home">
    <c-header-bar class="header">
      <template v-slot:content-left>
        Newsly
      </template>
      <template v-slot:content-right>
        <c-button @click="$emit('sign-out')">
          Sign Out
        </c-button>
      </template>
    </c-header-bar>
    <main class="content">
      <div v-if="isLoading" style="height: 200px;">Loading...</div>
      <c-table v-else>
        <template v-slot:body>
          <c-table-row v-for="label in labels" :key="label.id">
            <c-table-cell>
              <router-link
                :to="{ name: 'Label', params: { labelId: label.id } }"
              >
                {{ label.name.replace('newsly_', '') }}
              </router-link>
            </c-table-cell>
          </c-table-row>
        </template>
      </c-table>
    </main>
  </div>
</template>

<script>
  import CButton from '@/components/CButton';
  import CHeaderBar from '@/components/CHeaderBar';
  import CTable from '@/components/CTable.vue';
  import CTableCell from '@/components/CTableCell.vue';
  import CTableRow from '@/components/CTableRow.vue';

  export default {
    name: 'Home',
    components: { CButton, CHeaderBar, CTable, CTableCell, CTableRow },
    data() {
      return {
        isLoading: null,
      };
    },
    async mounted() {
      if (this.areLabelsLoaded === false) {
        this.isLoading = true;

        this.$store.dispatch('loadLabels');

        this.isLoading = false;
      }
    },
    computed: {
      areLabelsLoaded() {
        return this.$store.getters.areLabelsLoaded;
      },
      labels() {
        return this.$store.getters.getAllLabels;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .v_home {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    width: 100%;

    .header {
      z-index: 1;
    }

    .content {
      background-color: #ffffff;
      flex-grow: 1;
      padding: 30px;
      position: relative;
    }
  }
</style>
