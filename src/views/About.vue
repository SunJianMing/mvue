<template>
  <div>
    about
    <h3>{{ $store.state.count }}</h3>
    <h3 @click="$store.commit('add')">{{ $store.state.count }}</h3>
    <h3 @click="$store.dispatch('asyncAdd')">{{ $store.state.count }}</h3>
    <h3>{{ $store.getters.dobCount }}</h3>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.state.count++;
  }
};
</script>

<style scoped></style>
