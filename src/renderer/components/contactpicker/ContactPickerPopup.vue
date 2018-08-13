<template>
    <popup v-model="showContactPicker" height="100%" width="100%" position="right" :popup-style="{'overflow-y': 'auto'}">
        <contact-picker :currentCompanyMode="currentCompanyMode" :companyId="companyId"
                        :friendAndPhoneContactMode="friendAndPhoneContactMode" :refreshSeed="refreshSeed"
                        @goBack="hideContackPicker" @picked="picked"
                        :multiple="multiple"
        ></contact-picker>
    </popup>
</template>

<script>
    import { Popup } from "vux"
    import ContactPicker from './ContactPicker'

    export default {
        name: "ContactPickerPopup",
        components: {
            ContactPicker, Popup
        },
        props: {
            showContactPicker: {
                type: Boolean,
                default: false
            },
            currentCompanyMode: {
                type: Boolean,
                default: false
            },
            // 当前companyId, currentCompanyMode下需要传
            companyId: {
                type: String
            },
            // 好友和手机通讯录选择模式
            friendAndPhoneContactMode: {
                type: Boolean,
                default: false
            },
            refreshSeed: {
                type: Boolean,
                default: false
            },
            multiple:{
                type: Boolean,
                default: true
            }
        },
        methods: {
            hideContackPicker() {

                this.$emit('hideContackPicker')
            },
            picked(addGroupMembers, hasFriendSelected, selectedCompanyId) {
                this.$emit('picked', addGroupMembers, hasFriendSelected, selectedCompanyId)
            }
        }
    }
</script>

<style scoped>

</style>
