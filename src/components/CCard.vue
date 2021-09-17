<template>
  <component class="c_card" :is="component" :to="to">
    <c-typography class="title" component="h3" variant="p">
      {{ title }}
    </c-typography>
    <c-typography v-if="subTitle" class="sub_title" component="h4" variant="p">
      {{ subTitle }}
    </c-typography>
    <c-typography v-if="meta" class="meta" component="p" variant="p">
      {{ meta }}
    </c-typography>
  </component>
</template>

<script>
  import CTypography from './CTypography.vue';

  export default {
    components: { CTypography },
    name: 'CCard',
    props: {
      component: {
        default() {
          return 'div';
        },
        type: String,
      },
      meta: {
        type: String,
      },
      subTitle: {
        type: String,
      },
      title: {
        required: true,
        type: String,
      },
      to: {
        type: [Object, String],
      },
    },
  };
</script>

<style lang="scss" scoped>
  .c_card {
    background-color: #ffffff;
    border-bottom: 1px solid #eeeeee;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 10px 15px;
    text-decoration: none;
    width: 100%;

    .meta,
    .sub_title,
    .title {
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .title {
      color: var(--primary);
    }

    .sub_title {
      color: var(--font-color-primary);
    }

    .meta {
      color: var(--font-color-secondary);
      font-size: 1.3rem;
    }

    &:hover {
      background-color: #f9f9f9;

      .meta,
      .sub_title,
      .title {
        color: var(--primary);
      }
    }
  }
</style>
