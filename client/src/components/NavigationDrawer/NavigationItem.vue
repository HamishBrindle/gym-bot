<template>
  <router-link
    v-slot="{ href, isActive, navigate }"
    :to="{ name: to, params }"
  >
    <v-list-item
      color="primary"
      link
      :href="href"
      :input-value="isActive"
      @click="navigate"
    >
      <v-list-item-action>
        <v-icon>{{ action }}</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>{{ title }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </router-link>
</template>

<script>
export default {
  name: 'NavigationItem',
  props: {
    to: {
      required: true,
      type: String,
    },
    params: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    title: {
      required: true,
      type: String,
      default: '--',
    },
    action: {
      required: true,
      type: String,
      default: 'mdi-help',
    },
  },
};
</script>
