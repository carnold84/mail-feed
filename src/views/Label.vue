<template>
  <div class="v_label">
    <c-header-bar class="header">
      <template v-slot:content-left>
        <c-button style="margin: 0 10px 0 0" @click="$router.back()">
          Back
        </c-button>
        {{ label?.name }}
      </template>
    </c-header-bar>
    <main class="content">
      <p v-if="isLoading">Loading...</p>
      <c-table v-else>
        {{ messages }}
        <template v-slot:body>
          <c-table-row v-for="message in messages" :key="message.id">
            <c-table-cell>
              <router-link :to="`/label/${labelId}/message/${message.id}`">
                {{ message.from }}
              </router-link>
            </c-table-cell>
            <c-table-cell>
              <router-link :to="`/label/${labelId}/message/${message.id}`">
                {{ message.subject }}
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
    name: 'Label',
    components: { CButton, CHeaderBar, CTable, CTableCell, CTableRow },
    data() {
      return {
        isLoading: null,
      };
    },
    computed: {
      labelId() {
        return this.$route?.params?.labelId;
      },
      label() {
        return this.$store.getters.getLabelById(this.labelId);
      },
      messages() {
        return this.$store.getters.getMessagesByLabel(this.labelId);
      },
    },
    async mounted() {
      this.isLoading = true;

      if (!this.label) {
        await this.$store.dispatch('loadLabel', this.labelId);
      }

      if (!this.label?.isLoaded) {
        this.$store.dispatch('loadLabelMessages', this.labelId);
      }

      this.isLoading = false;
    },
  };
</script>

<style lang="scss" scoped>
  .v_label {
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
