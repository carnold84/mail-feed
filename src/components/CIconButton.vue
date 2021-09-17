<template>
  <c-button
    class="c_icon_button"
    :is="component"
    :is-primary="isPrimary"
    :is-round="true"
    :to="to"
  >
    <slot></slot>
  </c-button>
</template>

<script>
  import CButton from './CButton.vue';
  export default {
    components: { CButton },
    name: 'CIconButton',
    props: {
      component: {
        default() {
          return 'button';
        },
        type: String,
      },
      isPrimary: {
        default: false,
        type: Boolean,
      },
      to: {
        default: undefined,
        type: [Object, String],
      },
    },
  };
</script>

<style lang="scss" scoped>
  .c_icon_button {
    background-color: transparent;
    border: none;
    box-shadow: none;

    &:hover {
      background-color: transparent;
      border: none;
      box-shadow: none;
    }

    &.is_primary {
      background-color: var(--button-primary-bg-color);
      border: var(--button-primary-border-color) solid 1px;
      box-shadow: rgba(0, 0, 0, 0.35) 0 1px 2px;
      color: rgba(255, 255, 255, 1);
      fill: rgba(255, 255, 255, 1);

      &:hover {
        background-color: var(--button-primary-bg-color__HOVER);
        border: var(--button-primary-border-color__HOVER) solid 1px;
        box-shadow: rgba(0, 0, 0, 0.55) 0 1px 4px;
      }
    }
  }
</style>
