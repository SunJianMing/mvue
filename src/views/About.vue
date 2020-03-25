<template>
    <div>
        about
        <h3>{{ $store.state.count }}</h3>
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

<style scoped>
</style>