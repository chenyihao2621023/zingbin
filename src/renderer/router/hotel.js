//酒店管理
// ------请在相应模块添加修改
const hotel = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/hotel')

//1.预订和入住 共用一个页面,不同的路由
//2.入住
const Reservation = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/reservation/Reservation')

const CheckIn = () =>
    import(/* webpackChunkName: "hotel" */ '@/container/hotel/reservation/CheckIn')

//宾客列表
const guestsList = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/guestsList/GuestsList')
const guestsBill = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/guestsList/guestsBill/guestsBill')
//可用房列表
const usableRoomTableList = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/UsableRoomTableList')
//客户管理
const CustomerManage = () =>
    import( /* webpackChunkName: "hotel" */ '@/container/hotel/customer/CustomerManage')

//交易及费用配置
const PayClass = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/transactionAndExpense/PayClass.vue')
const ConsumeType = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/transactionAndExpense/ConsumeType.vue')
const TransactionCode = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/transactionAndExpense/TransactionCode.vue')
const HouseDetail = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/transactionAndExpense/HouseDetail.vue')
const HouseStructure = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/transactionAndExpense/HouseStructure.vue')
const PriceClass = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/transactionAndExpense/PriceClass.vue')
const PriceCode = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/transactionAndExpense/PriceCode.vue')
//前台管理配置
const ChannelConfig = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/frontDeskManage/channelConfig')
const ReserveTypeConfig = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/frontDeskManage/reserveTypeConfig')
const CauseOfLock = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/frontDeskManage/CauseOfLock.vue')
const CauseOfMaintenance = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/frontDeskManage/CauseOfMaintenance.vue')
const changeRoom = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/frontDeskManage/changeRoom.vue')

//公司及协议单位
const agreementUnit = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/companyUnit/AgreementUnit')
//系统配置
const hotelConfig = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/systemConfigInfo/hotelConfig.vue')

const printerConfig = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/systemConfigInfo/printerConfig.vue')

const roomRackConfig = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/systemConfigInfo/roomRackConfig.vue')
const PowerManage = () =>
    import (/* webpackChunkName: "hotel" */ '@/container/hotel/systemConfigInfo/PowerManage.vue')


const HotelCurStatus = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/children/HotelCurStatus.vue')

const roomState = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/children/roomState')

const liveInGuest = () =>
    import (/* webpackChunkName: "hotel" */ '@/container/hotel/liveInGuest/LiveInGuest')

//客房管理配置
const BlocksConfig = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/roomManage/BlocksConfig')
const BuildingConfig = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/roomManage/BuildingConfig')
const RoomProperty = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/roomManage/RoomProperty')
const RoomType = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/roomManage/RoomType')
const RoomNumber = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/roomManage/RoomNumber.vue')

//团队列表
const teamList = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/team/teamList.vue')

//<-------------------------------酒店报表 start-------------------------------------->
//
//营业时段表
const yingyeshiduanbao = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/report/yingyeshiduanbao')
//酒店报表
//现金流量明细
const xianjinliuliangmingxi = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/report/xianjinliuliangmingxi')
//入住分析表
const ruzhufenxibiao = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/report/ruzhufenxibiao')
//冲调报表
const chongdiao = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/report/chongdiao')
//结账汇总表
const jiezhanghuizong = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/report/jiezhanghuizong')
//入住订单明细
const ruzhudingdanmingxi = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/report/ruzhudingdanmingxi')
//入住订单汇总
const ruzhudingdanhuizong = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/report/ruzhudingdanhuizong')
//前台营业日报表
const qiantaiyingyeribaobiao = () =>
    import ( /* webpackChunkName: "hotel" */ '@/container/hotel/report/qiantaiyingyeribaobiao')
//<-------------------------------酒店报表 end--------------------------------------->
/*
 所有酒店管理目录下的路径都配置在此路由children下，避免混乱
 */
let routes = [
{
    path: '/hotel',
    component: hotel,
    children: [{
            path: '',
            redirect: 'roomState'
        }, {
            path: 'channelConfig',
            name: 'ChannelConfig',
            component: ChannelConfig
        }, {
            path: 'reserveTypeConfig',
            name: 'ReserveTypeConfig',
            component: ReserveTypeConfig
        }, {
            path: 'HotelCurStatus',
            name: 'HotelCurStatus',
            component: HotelCurStatus
        }, {
            path: 'groupReserve',
            component: Reservation
        }, {
            path: 'singleReserve',
            component: Reservation,
        }, {
            path: 'selfUseReserve',
            component: Reservation,
        }, {
            path: 'freeReserve',
            component: Reservation,
        }, {
            path: 'singleCheckIn',
            component: CheckIn
        }, {
            path: 'groupCheckIn',
            component: CheckIn
        }, {
            path: 'selfUseCheckIn',
            component: CheckIn
        }, {
            path: 'freeCheckIn',
            component: CheckIn
        }, {
            path: 'PayClass',
            name: 'PayClass',
            component: PayClass
        }, {
            path: 'TransactionCode',
            name: 'TransactionCode',
            component: TransactionCode
        }, {
            path: 'roomState',
            name: 'roomState',
            component: roomState
        },{
            path:'liveInGuest',
            name:'liveInGuest',
            component:liveInGuest
        }, {
            path: 'agreementUnit',
            name: 'agreementUnit',
            component: agreementUnit
        }, {
            path: 'ConsumeType',
            name: 'ConsumeType',
            component: ConsumeType
        }, {
            path: 'HouseDetail',
            name: 'HouseDetail',
            component: HouseDetail
        }, {
            path: 'HouseStructure',
            name: 'HouseStructure',
            component: HouseStructure
        }, {
            path: 'PriceClass',
            name: 'PriceClass',
            component: PriceClass
        }, {
            path: 'PriceCode',
            name: 'PriceCode',
            component: PriceCode
        }, {
            path: 'guestsBill',
            name: 'guestsBill',
            component: guestsBill
        }, {
            path: 'guestsList',
            name: 'guestsList',
            component: guestsList
        }, {
            path: 'hotelConfig',
            name: 'hotelConfig',
            component: hotelConfig
        }, {
            path: 'printerConfig',
            name: 'printerConfig',
            component: printerConfig
        }, {
            path: 'roomRackConfig',
            name: 'roomRackConfig',
            component: roomRackConfig
        }, {
            path: 'PowerManage',
            name: 'PowerManage',
            component: PowerManage
        },{
            path: 'BlocksConfig',
            name: 'BlocksConfig',
            component: BlocksConfig
        }, {
            path: 'BuildingConfig',
            name: 'BuildingConfig',
            component: BuildingConfig
        }, {
            path: 'RoomProperty',
            name: 'RoomProperty',
            component: RoomProperty
        }, {
            path: 'RoomType',
            name: 'RoomType',
            component: RoomType
        }, {
            path: 'CauseOfMaintenance',
            name: 'CauseOfMaintenance',
            component: CauseOfMaintenance
        },{
            path: 'changeRoom',
            name: 'changeRoom',
            component: changeRoom
        }, {
            path: 'RoomNumber',
            name: 'RoomNumber',
            component: RoomNumber
        }, {
            path: 'CauseOfLock',
            name: 'CauseOfLock',
            component: CauseOfLock
        }, {
            path: 'usableRoomTableList',
            name: 'usableRoomTableList',
            component: usableRoomTableList
        },{
            path:'CustomerManage',
            name:'CustomerManage',
            component:CustomerManage
        }, {
            path: 'teamList',
            name: 'teamList',
            component: teamList
        },
        /**--------------酒店报表 start----------------------------------------*/
        {
            path:'yingyeshiduanbao',
            name:'yingyeshiduanbao',
            component:yingyeshiduanbao
        }, {
            path:'xianjinliuliangmingxi',
            name:'xianjinliuliangmingxi',
            component:xianjinliuliangmingxi
        }, {
            path:'ruzhufenxibiao',
            name:'ruzhufenxibiao',
            component:ruzhufenxibiao
        }, {
            path:'chongdiao',
            name:'chongdiao',
            component:chongdiao
        }, {
            path:'jiezhanghuizong',
            name:'jiezhanghuizong',
            component:jiezhanghuizong
        }, {
            path:'ruzhudingdanmingxi',
            name:'ruzhudingdanmingxi',
            component:ruzhudingdanmingxi
        }, {
            path:'ruzhudingdanhuizong',
            name:'ruzhudingdanhuizong',
            component:ruzhudingdanhuizong
        },
         {
            path:'qiantaiyingyeribaobiao',
            name:'qiantaiyingyeribaobiao',
            component:qiantaiyingyeribaobiao
        },
        /**--------------酒店报表 end----------------------------------------*/
        ]
    }]

export { routes }
