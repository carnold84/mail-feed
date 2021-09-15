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
      console.log(this.label, this.messages);

      this.isLoading = true;

      const gapi = await this.$gapi.getGapiClient();

      if (!this.label) {
        console.log('no label');
        const label = await gapi.client.gmail.users.labels.get({
          id: this.labelId,
          userId: 'me',
        });
        this.$store.dispatch('setLabel', label);
      }

      const messages = await gapi.client.gmail.users.messages.list({
        labelIds: [this.labelId],
        userId: 'me',
      });

      const messageResponse = await Promise.all(
        messages.result.messages.map(({ id }) => {
          return gapi.client.gmail.users.messages.get({
            id,
            userId: 'me',
          });
        })
      );

      console.log(messageResponse);

      this.$store.dispatch('setLabelMessages', {
        labelId: this.labelId,
        messages: messageResponse,
      });

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
