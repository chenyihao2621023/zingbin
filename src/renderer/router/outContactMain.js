const outContactMain = () =>
    import ('@/container/outContact/outContactMain')
const ContactMain = () =>
    import ('@/container/outContact/ContactMain')
const addContact = () =>
    import ('@/container/outContact/addContact')
const addContactConflict = () =>
    import ('@/container/outContact/addContactConflict')
const ContactDetail = () =>
    import ('@/container/outContact/contactDetail')

const visitRecord = () =>
    import ('@/container/outContact/visitRecord')
    //查看业务
const businessView = () =>
    import ('@/container/outContact/businessView')
const moreInfo = () =>
    import ('@/container/outContact/moreInfo')
const bindContactUser = () =>
    import ('@/container/outContact/bindContactUser')

//工单详情
const taskListDetail = () =>
    import ('@/container/outContact/taskListDetail')

let routes = [{
    path: '/outContactMain',
    component: outContactMain,
    children: [{
            path: '',
            name: 'ContactMain',
            component: ContactMain
        },
        {
            path: 'addContact',
            name: 'addContact',
            component: addContact
        },
        {
            path: 'ContactDetail',
            name: 'ContactDetail',
            component: ContactDetail
        },
        {
            path: 'visitRecord',
            name: 'visitRecord',
            component: visitRecord
        },
        {
            path: 'businessView',
            name: 'businessView',
            component: businessView
        },
        {
            path: 'moreInfo',
            name: 'moreInfo',
            component: moreInfo
        },
        {
            path: 'addContactConflict',
            name: 'addContactConflict',
            component: addContactConflict
        },
        {
            path: 'bindContactUser',
            name: 'bindContactUser',
            component: bindContactUser
        },
        {
            path: 'taskListDetail',
            name: 'taskListDetail',
            component: taskListDetail
        },
    ]
}]

export { routes }
