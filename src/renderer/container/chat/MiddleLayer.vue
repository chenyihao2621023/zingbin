<template>
    <div>

    </div>
</template>
<script>
    import { goChat } from '../../utils/fn'
    export default {
        components: {},
        data() {
            return {}
        },
        computed: {},
        watch: {},
        created() {
            let { did, type, companyId } = this.$route.query;
            goChat(did, companyId, type, this.$router, true);
        },
        methods: {}
    }
</script>
<style scoped>
</style>
