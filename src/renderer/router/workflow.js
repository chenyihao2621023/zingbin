const workflowHome = () => import ('@/container/workflow/workflowHome')
const workflowIndex = () => import ('@/container/workflow/workflowIndex')
const workflowTemplate = () => import ('@/container/workflow/workflowTemplate')
const workflowNodes = () => import ('@/container/workflow/workflowNodes')
const workflowMyApproval = () => import ('@/container/workflow/workflowMyApproval')
const Approvaled = () => import ('@/container/workflow/MyApprovalChildren/Approvaled')
const lastApproval = () => import ('@/container/workflow/MyApprovalChildren/lastApproval')
const MyApproval = () => import ('@/container/workflow/MyApprovalChildren/MyApproval')
const workflowMyself = () => import ('@/container/workflow/workflowMyself')
const workflowQuery = () => import ('@/container/workflow/workflowQuery')
const workflowJoin = () => import ('@/container/workflow/workflowJoin')
const searchType = () => import('@/container/workflow/searchType')
const workflowJoinService = () => import('@/container/workflow/workflowJoinService')
const workOrder = () => import('@/container/workflow/workOrder')
const workflowMain = () => import ('@/container/workflow/workflowMain')
const launchWorkflow = () => import ('@/container/workflow/launchWorkflow')
const launchCustomerWorkflow = () => import ('@/container/workflow/launchCustomerWorkflow')
const customerLaunchWorkflow = () => import ('@/container/workflow/customerLaunchWorkflow')
const showNode = () => import ('@/container/workflow/showNode')
const workflowAuthorized = () => import ('@/container/workflow/workflowAuthorized')
const popupAuthorized = () => import ('@/container/workflow/workflowAuthorized/popupAuthorized')
const typeAndTemplate = () => import ('@/container/workflow/typeAndTemplate')
const customLaunchWorkflow = () => import ('@/container/workflow/customLaunchWorkflow')
const workflowMainDemo = () => import ('@/container/workflow/workflowMainDemo')

let routes = [{
    path: '/workflow',
    component: workflowHome,
    children: [{
            path: '',
            name: 'workflowHome',
            component: workflowHome
        },
        {
            path: 'workflowMain',
            name: 'workflowMain',
            component: workflowMain
        },
        {
            path: 'workflowIndex',
            name: 'workflowIndex',
            component: workflowIndex
        },
        {
            path: 'workflowTemplate',
            name: 'workflowTemplate',
            component: workflowTemplate
        },
        {
            path: 'workflowNodes',
            name: 'workflowNodes',
            component: workflowNodes
        },
        {
            path: 'workflowAuthorized',
            name: 'workflowAuthorized',
            component: workflowAuthorized
        },
        {
            path: 'popupAuthorized',
            name: 'popupAuthorized',
            component: popupAuthorized
        },
        {
            path: 'workflowMyApproval',
            component: workflowMyApproval,
            children: [{
                    path: '',
                    redirect: '/workflow/workflowMyApproval/MyApproval'
                },
                {
                    path: 'Approvaled',
                    name: 'Approvaled',
                    component: Approvaled
                },
                {
                    path: 'lastApproval',
                    name: 'lastApproval',
                    component: lastApproval
                },
                {
                    path: 'MyApproval',
                    name: 'MyApproval',
                    component: MyApproval
                }
            ]
        },
        {
            path: 'workflowMyself',
            name: 'workflowMyself',
            component: workflowMyself
        },
        {
            path: 'workflowQuery',
            name: 'workflowQuery',
            component: workflowQuery
        },
        {
            path: 'workflowJoin',
            name: 'workflowJoin',
            component: workflowJoin
        },
        {
            path: 'launchWorkflow',
            name: 'launchWorkflow',
            component: launchWorkflow
        },
        {
            path: 'launchCustomerWorkflow',
            name: 'launchCustomerWorkflow',
            component: launchCustomerWorkflow
        },
        {
            path: 'customerLaunchWorkflow',
            name: 'customerLaunchWorkflow',
            component: customerLaunchWorkflow
        },
        {
            path: 'showNode',
            name: 'showNode',
            component: showNode
        },
        {
            path: 'searchType',
            name: 'searchType',
            component: searchType
        },
        {
            path: 'workflowJoinService',
            name: 'workflowJoinService',
            component: workflowJoinService
        },
        {
            path: 'workOrder',
            name: 'workOrder',
            component: workOrder
        },
        {
            path: 'typeAndTemplate',
            name: 'typeAndTemplate',
            component: typeAndTemplate
        },
        {
            path: 'customLaunchWorkflow',
            name: 'customLaunchWorkflow',
            component: customLaunchWorkflow
        },
        {
            path: 'workflowMainDemo',
            name: 'workflowMainDemo',
            component: workflowMainDemo
        }
    ]
}]

export { routes }
