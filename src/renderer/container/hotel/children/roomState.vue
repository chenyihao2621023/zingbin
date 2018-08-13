<template>
    <div class="mainPage">
        <el-header style="background-color: #fff">
            <!-- <hotelHeader :select="true" :search="true"   ></hotelHeader> -->
            <div>
                楼座：
                <el-select v-model="selectArea" placeholder="请选择" size="small"
                           @change="(value) => searchEvent(value, 'floorBlock') ">
                    <el-option label="全部楼座" value=""></el-option>
                    <el-option v-for="item in hotelArea" :label="item.configValue" :key="item.rowId"
                               :value="item.configValue"></el-option>
                </el-select>
                楼区：
                <el-select v-model="selectBlock" placeholder="请选择" size="small"
                           @change="(value) => searchEvent(value, 'floorArea') ">
                    <el-option label="全部楼区" value=""></el-option>
                    <el-option v-for="item in hotelBlock" :label="item.configValue" :key="item.rowId"
                               :value="item.configValue"></el-option>
                </el-select>
                <el-input size="small" style="width:180px;float:right" placeholder="请输入房间号" @change="change"
                          v-on:keyup.enter="inputSearchEvent" v-model="inputSearch">
                    <i v-on:click="inputSearchEvent" slot="suffix" class="el-icon-search el-icon-date"></i>
                </el-input>
            </div>
        </el-header>
        <el-main>
            <div id="d1"></div>
            <el-row :gutter="2" v-for="(hotelRow,$indexRow) in hotelData" v-bind:key="hotelRow">
                <!-- 一重循环 -->
                <el-col :span="24/setting.rowSize" v-for="(hotelItem, $indexItem) in hotelRow" v-bind:key="hotelItem"
                        style="position: relative; ">
                    <!-- 二重循环 -->
                    <div class="grid-content bg-purple-light" @click="popoverClick(hotelItem,$indexRow,$indexItem)"
                         style="border:1px solid #c5c3c3">
                        <!-- 已入住（popover） -->
                        <!-- {{hotelData[$indexRow][$indexItem+1] = '{}'}} -->
                        <el-popover ref="popoverHotel" @show="popoverShow(hotelData[$indexRow][$indexItem])"
                                    v-if="hotelItem.isCheck == 1" open-delay="1000" placement="bottom" width="230"
                                    trigger="hover">
                            <div style="font-size:14px">
                                <div>
                                    <div style="padding:2px;padding-left:0px;padding-right:0px">
                                        房间号:{{hotelData[$indexRow][$indexItem].roomNo}}
                                    </div>
                                    <div style="float:right">已消费 : {{getInfoByOrderInfo(hotelData[$indexRow][$indexItem],'amountPayable')}}元</div>
                                </div>
                                <div>
                                    <div>当前状态:已入住</div>
                                    <div style="float:right">押金 : {{getInfoByOrderInfo(hotelData[$indexRow][$indexItem],'deposit')}}</div>
                                </div>
                                <div>
                                    <div>入住人 : {{getInfoByOrderInfo(hotelData[$indexRow][$indexItem],'checkInPersonName')}}</div>
                                    <div style="float:right">备注:{{getInfoByOrderInfo(hotelData[$indexRow][$indexItem],'remark')}}</div>
                                </div>
                                <div>所属团体 : {{getInfoByOrderInfo(hotelData[$indexRow][$indexItem],'groupName')}}</div>
                                <div>同住人 : {{getInfoByOrderInfo(hotelData[$indexRow][$indexItem],'groupInPersonName')}}</div>
                                <div>入住日期 : {{getInfoByOrderInfo(hotelData[$indexRow][$indexItem],'actualEnterTime')}}</div>
                                <div>离店日期 : {{getInfoByOrderInfo(hotelData[$indexRow][$indexItem],'outerTime')}}</div>
                            </div>
                            <el-button @mouseenter.native="roomHover(hotelItem)" v-popover:popoverHotel
                                       v-if="hotelItem.isCheck == 1 && isClean(hotelItem)"
                                       slot="reference" class="bg-purple-light"
                                       style="width: 100%;padding:0px;height:126px;border:0px"
                                       v-bind:style="styleObject.checkInClean">
                                <div v-if="hotelItem.isReservation == 1" class="triangleTag"></div>
                            </el-button>

                            <el-button @mouseenter.native="roomHover(hotelItem)" v-popover:popoverHotel
                                       v-if="hotelItem.isCheck == 1 && !isClean(hotelItem)"
                                       slot="reference" class="bg-purple-light"
                                       style="width: 100%;padding:0px;height:126px;border:0px"
                                       v-bind:style="styleObject.checkInDirty">
                                <div v-if="hotelItem.isReservation == 1" class="triangleTag"></div>
                            </el-button>

                        </el-popover>


                        <el-popover ref="popoverHotel" @show="popoverShow(hotelData[$indexRow][$indexItem])"
                                    v-if="hotelItem.isCheck != 1 && hotelItem.isReservation == 1" open-delay="1000" placement="bottom" width="230"
                                    trigger="hover">
                            <div style="font-size:14px">
                                <div>
                                    <div style="padding:2px;padding-left:0px;padding-right:0px">
                                        房间号:{{hotelData[$indexRow][$indexItem].roomNo}}
                                    </div>
                                    <div style="float:right">已消费 : {{getInfoByOrderInfo(hotelData[$indexRow][$indexItem],'amountPayable')}}元</div>
                                </div>
                                <div>
                                    <div>当前状态:已预定</div>
                                    <div style="float:right">押金 : {{getInfoByOrderInfo(hotelData[$indexRow][$indexItem],'deposit')}}</div>
                                </div>
                                <div>
                                    <div>入住人 : {{getInfoByOrderInfo(hotelData[$indexRow][$indexItem],'checkInPersonName')}}</div>
                                    <div style="float:right">备注:{{getInfoByOrderInfo(hotelData[$indexRow][$indexItem],'remark')}}</div>
                                </div>
                                <div>所属团体 : {{getInfoByOrderInfo(hotelData[$indexRow][$indexItem],'groupName')}}</div>
                                <div>同住人 : {{getInfoByOrderInfo(hotelData[$indexRow][$indexItem],'groupInPersonName')}}</div>
                                <div>入住日期 : {{getInfoByOrderInfo(hotelData[$indexRow][$indexItem],'enterTime')}}</div>
                                <div>离店日期 : {{getInfoByOrderInfo(hotelData[$indexRow][$indexItem],'outerTime')}}</div>

                            </div>
                             <!-- 维修颜色 -->
                                <el-button @mouseenter.native="roomHover(hotelItem)" v-if="hotelItem.isRepair == 1"
                                        slot="reference" class="bg-purple-light"
                                        style="width: 100%;padding:0px;height:126px;border:0px "
                                        v-bind:style="styleObject.repair">
                                    <div v-if="hotelItem.isReservation == 1" class="triangleTag"></div>
                                </el-button>
                                <!-- 锁房颜色 -->
                                <el-button  @mouseenter.native="roomHover(hotelItem)" v-else-if="  hotelItem.isLock == 1"
                                        slot="reference" class="bg-purple-light"
                                        style="width: 100%;padding:0px;height:126px;border:0px "
                                        v-bind:style="styleObject.lock">
                                    <div v-if="hotelItem.isReservation == 1" class="triangleTag"></div>
                                </el-button>
                                <!-- 初始  -->
                                <el-button
                                    @mouseenter.native="roomHover(hotelItem)"
                                    v-else-if="hotelItem.isCheck != 1 && isClean(hotelItem)"
                                    slot="reference" class="bg-purple-light"
                                    style="width: 100%;padding:0px;height:126px;border:0px"
                                    v-bind:style="styleObject.noCHeckInClean">
                                    <div v-if="hotelItem.isReservation == 1" class="triangleTag"></div>
                                </el-button>
                                <el-button @mouseenter.native="roomHover(hotelItem)"
                                        v-else-if="hotelItem.isCheck != 1 && !isClean(hotelItem)" slot="reference"
                                        class="bg-purple-light" style="width: 100%;padding:0px;height:126px;border:0px"
                                        v-bind:style="styleObject.nocheckInDirty">
                                    <div v-if="hotelItem.isReservation == 1" class="triangleTag"></div>
                                </el-button>
                                <el-button @mouseenter.native="roomHover(hotelItem)"
                                        v-else-if="(hotelItem.isRepair != 1 && hotelItem.isCheck != 1 ) " slot="reference"
                                        class="bg-purple-light" style="width: 100%;padding:0px;height:126px;border:0px "
                                        v-bind:style="styleObject.init">
                                    <div v-if="hotelItem.isReservation == 1" class="triangleTag"></div>
                                </el-button>

                        </el-popover>


                        <el-popover ref="popoverHotel" @show="popoverShow(hotelData[$indexRow][$indexItem])"
                                    v-else-if="hotelItem.isCheck != 1 && hotelItem.isReservation != 1 && hotelItem.isLock == 1" open-delay="1000" placement="bottom" width="230"
                                    trigger="hover">
                            <div style="font-size:14px">
                                <div>
                                    <div style="padding:2px;padding-left:0px;padding-right:0px">
                                        锁房原因:{{getLockValue(hotelItem)}}
                                    </div>
                                </div>
                                 

                            </div>
                             
                                <!-- 锁房颜色 -->
                                <el-button  @mouseenter.native="roomHover(hotelItem)"  
                                        slot="reference" class="bg-purple-light"
                                        style="width: 100%;padding:0px;height:126px;border:0px "
                                        v-bind:style="styleObject.lock">
                                </el-button>
                                 

                        </el-popover>
                        <el-popover ref="popoverHotel" @show="popoverShow(hotelData[$indexRow][$indexItem])"
                                    v-else-if="hotelItem.isCheck != 1 && hotelItem.isReservation != 1 && hotelItem.isRepair == 1" open-delay="1000" placement="bottom" width="230"
                                    trigger="hover">
                            <div style="font-size:14px">
                                <div>
                                    <div style="padding:2px;padding-left:0px;padding-right:0px">
                                        维修原因:{{getRepairValue(hotelItem)}}
                                    </div>
                                </div>
                            </div>
                             
                                 
                                <el-button @mouseenter.native="roomHover(hotelItem)" v-if="hotelItem.isRepair == 1"
                                        slot="reference" class="bg-purple-light"
                                        style="width: 100%;padding:0px;height:126px;border:0px "
                                        v-bind:style="styleObject.repair">
                                    <!-- <div v-if="hotelItem.isReservation == 1" class="triangleTag"></div> -->
                                </el-button>
                                 

                        </el-popover>




                        <!-- 维修颜色 -->
                        <el-button @mouseenter.native="roomHover(hotelItem)" v-else-if="hotelItem.isRepair == 1"
                                   slot="reference" class="bg-purple-light"
                                   style="width: 100%;padding:0px;height:126px;border:0px "
                                   v-bind:style="styleObject.repair">
                            <div v-if="hotelItem.isReservation == 1" class="triangleTag"></div>
                        </el-button>
                        <!-- 锁房颜色 -->
                        <el-button @mouseenter.native="roomHover(hotelItem)" v-else-if="  hotelItem.isLock == 1"
                                   slot="reference" class="bg-purple-light"
                                   style="width: 100%;padding:0px;height:126px;border:0px "
                                   v-bind:style="styleObject.lock">
                            <div v-if="hotelItem.isReservation == 1" class="triangleTag"></div>
                        </el-button>
                        <!-- 初始  -->
                        <el-button
                            @mouseenter.native="roomHover(hotelItem)"
                            v-else-if="hotelItem.isCheck != 1 && isClean(hotelItem)"
                            slot="reference" class="bg-purple-light"
                            style="width: 100%;padding:0px;height:126px;border:0px"
                            v-bind:style="styleObject.noCHeckInClean">
                            <div v-if="hotelItem.isReservation == 1" class="triangleTag"></div>
                        </el-button>
                        <el-button @mouseenter.native="roomHover(hotelItem)"
                                   v-else-if="hotelItem.isCheck != 1 && !isClean(hotelItem)" slot="reference"
                                   class="bg-purple-light" style="width: 100%;padding:0px;height:126px;border:0px"
                                   v-bind:style="styleObject.nocheckInDirty">
                            <div v-if="hotelItem.isReservation == 1" class="triangleTag"></div>
                        </el-button>
                        <el-button @mouseenter.native="roomHover(hotelItem)"
                                   v-else-if="(hotelItem.isRepair != 1 && hotelItem.isCheck != 1 ) " slot="reference"
                                   class="bg-purple-light" style="width: 100%;padding:0px;height:126px;border:0px "
                                   v-bind:style="styleObject.init">
                            <div v-if="hotelItem.isReservation == 1" class="triangleTag"></div>
                        </el-button>








                        <span style="display:none">{{elColButton}} </span>
                        <!-- 【入住】状态 -->
                        <el-button v-show="power.hotelBillManagePower" round="true" v-if="hotelItem.isCheck == 1"
                                   @click="buttonAction($event,'账单',[$indexRow,$indexItem])" type="button" size="mini"
                                   class="el-button el-col-button nocolor" style="right: 65px">
                            <span>账单</span>
                        </el-button>
                        <el-button v-show="power.hotelCheckInManagePower" round="true" v-if="hotelItem.isCheck == 1"
                                   @click="buttonAction($event,'续住',[$indexRow,$indexItem])" type="button" size="mini"
                                   class="el-button el-col-button nocolor" style="right: 30px">
                            <span>续住</span>
                        </el-button>
                        <!-- 【维修】状态 -->
                        <el-button v-show="power.hotelRoomStatusManagePower" round="true" v-if="hotelItem.isRepair == 1"
                                   @click="buttonAction($event,'维修完成',[$indexRow,$indexItem])" type="button" size="mini"
                                   class="el-button el-col-button nocolor" style="right: 30px">
                            <span>维修完成</span>
                        </el-button>

                        <el-button v-show="power.hotelCheckInManagePower" round="true"
                                   v-if="hotelItem.isRepair != 1   && hotelItem.isCheck != 1 && hotelItem.isLock != 1"
                                   @click="buttonAction($event,'入住',[$indexRow,$indexItem])"
                                   type="button" size="mini" class="el-button el-col-button nocolor"
                                   style="right: 65px">
                            <span>入住</span>
                        </el-button>
                        <el-button v-show="power.hotelRoomStatusManagePower" round="true"
                                   v-if="hotelItem.isRepair != 1   && hotelItem.isCheck != 1 && hotelItem.isLock != 1"
                                   @click="buttonAction($event,'锁房',[$indexRow,$indexItem])"
                                   type="button" size="mini" class="el-button el-col-button nocolor"
                                   style="right: 30px">
                            <span>锁房</span>
                        </el-button>
                        <!-- 【锁定】状态 -->
                        <el-button v-show="power.hotelRoomStatusManagePower" round="true" v-if="hotelItem.isLock == 1"
                                   @click="buttonAction($event,'取消锁房',[$indexRow,$indexItem])" type="button" size="mini"
                                   class="el-button el-col-button nocolor" style="right: 30px">
                            <span>取消锁房</span>
                        </el-button>

                        <!-- <el-button round="true" v-if="hotelItem.isLock == 1"
                                   @click="buttonAction($event,'备注',[$indexRow,$indexItem])" type="button" size="mini"
                                   class="el-button el-col-button nocolor" style="right: 10px">
                            <span>备注</span>
                        </el-button> -->
                        <!-- ... -->
                        <el-dropdown @command="dropDownAction" placement="top"
                                     size="mini" class="el-col-button" style="right: 10px;">
                            <span class="el-dropdown-link">
                                <i class="el-icon-more"></i>
                            </span>
                            <!-- 入住... -->
                            <el-dropdown-menu slot="dropdown" v-if="hotelItem.isCheck == 1 || hotelItem.isReservation == 1">
                                <el-dropdown-item v-show="power.hotelRoomStatusManagePower" v-if="isClean(hotelItem)" command='打扫'>
                                    打扫
                                </el-dropdown-item>
                                <el-dropdown-item v-show="power.hotelRoomStatusManagePower" v-else-if="!isClean(hotelItem)" command='打扫完成'>打扫完成
                                </el-dropdown-item>
                                <el-dropdown-item v-show="power.hotelRoomStatusManagePower" command='房间日志'>房间日志</el-dropdown-item>
                                <el-dropdown-item v-show="power.hotelReservationManagePower || power.hotelCheckInManagePower" command='备注' >备注</el-dropdown-item>
                                <el-dropdown-item v-show="power.hotelReservationManagePower || power.hotelCheckInManagePower" command='制卡'>制卡</el-dropdown-item>
                                <el-dropdown-item v-show="power.hotelCheckInManagePower" command='换房'>换房</el-dropdown-item>
                            </el-dropdown-menu>
                            <!-- lock -->
                            <el-dropdown-menu slot="dropdown" v-else-if="hotelItem.isLock == 1">
                                <el-dropdown-item v-show="power.hotelRoomStatusManagePower" command='房间日志'>房间日志</el-dropdown-item>
                                <!-- <el-dropdown-item v-show="power.hotelReservationManagePower || power.hotelCheckInManagePower" command='备注'>备注</el-dropdown-item> -->
                                <el-dropdown-item v-show="power.hotelReservationManagePower || power.hotelCheckInManagePower" command='制卡'>制卡</el-dropdown-item>
                            </el-dropdown-menu>
                            <!-- lock -->
                            <el-dropdown-menu slot="dropdown" v-else-if="hotelItem.isRepair == 1">
                                <el-dropdown-item v-show="power.hotelRoomStatusManagePower" command='房间日志'>房间日志</el-dropdown-item>
                                <!-- <el-dropdown-item v-show="power.hotelReservationManagePower || power.hotelCheckInManagePower" command='备注'>备注</el-dropdown-item> -->
                                <el-dropdown-item v-show="power.hotelReservationManagePower || power.hotelCheckInManagePower" command='制卡'>制卡</el-dropdown-item>
                            </el-dropdown-menu>
                            <!-- init... -->
                            <el-dropdown-menu slot="dropdown"
                                              v-else-if="hotelItem.isRepair != 1   && hotelItem.isCheck != 1 && hotelItem.isLock != 1">
                                <el-dropdown-item v-show="power.hotelRoomStatusManagePower" command='房间日志'>房间日志</el-dropdown-item>
                                <el-dropdown-item v-show="power.hotelReservationManagePower || power.hotelCheckInManagePower" command='制卡'>制卡</el-dropdown-item>
                                <!-- <el-dropdown-item v-show="power.hotelReservationManagePower || power.hotelCheckInManagePower" command='备注'>备注</el-dropdown-item> -->
                                <el-dropdown-item v-show="power.hotelRoomStatusManagePower" command='维修'>维修</el-dropdown-item>
                                <el-dropdown-item v-show="power.hotelRoomStatusManagePower" command='打扫' v-if="isClean(hotelItem)">
                                    打扫
                                </el-dropdown-item>
                                <el-dropdown-item v-show="power.hotelRoomStatusManagePower" command='打扫完成' v-else-if="!isClean(hotelItem)">打扫完成
                                </el-dropdown-item>
                                <el-dropdown-item v-show="power.hotelReservationManagePower" command='预定'>预订</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <span class="el-col-button" style="  top:0%; font-size:12px; height:40px;margin-top: 5px">{{hotelItem.roomNo}}</span>

                    </div>
                </el-col>
            </el-row>
        </el-main>
        <div class="tips-btn">
            <div class="bottom-text-center"> 全部({{roomCountStatu.all}})&nbsp;</div>

            <el-tag class="roomTag" v-bind:style="styleObject.noCHeckInClean"></el-tag>
            <div class="bottom-text-center">空净({{roomCountStatu.noCHeckInClean}})&nbsp;</div>

            <el-tag class="roomTag" v-bind:style="styleObject.nocheckInDirty"></el-tag>
            <div class="bottom-text-center">空脏({{roomCountStatu.nocheckInDirty}})&nbsp;</div>

            <el-tag class="roomTag" v-bind:style="styleObject.checkInClean"></el-tag>
            <div class="bottom-text-center">住净({{roomCountStatu.checkInClean}})&nbsp;</div>

            <el-tag class="roomTag" v-bind:style="styleObject.checkInDirty"></el-tag>
            <div class="bottom-text-center">住脏({{roomCountStatu.checkInDirty}})&nbsp;</div>

            <el-tag class="roomTag" v-bind:style="styleObject.repair"></el-tag>
            <div class="bottom-text-center">维修({{roomCountStatu.repair}})&nbsp;</div>
            <el-tag class="roomTag" v-bind:style="styleObject.lock"></el-tag>
            <div class="bottom-text-center">锁定({{roomCountStatu.lock}})&nbsp;</div>
            <el-tag class="roomTag" v-bind:style="styleObject.isReservation"></el-tag>
            <div class="bottom-text-center">预定({{roomCountStatu.isReservation}})</div>
        </div>
        <div class="other">
            <el-dialog :title="'选择'+reasonTitle+'原因'" :visible.sync="reasonVisible">
                <!-- {{hotelReasonConfig}}{{hotelRepairConfig}}{{hotelLockConfig}} -->
                <el-radio-group v-model="hotelReasonId">

                         <el-radio :label="value.rowId" v-for="(value) in hotelReasonConfig" v-bind:key="value">
                        {{value.configValue}}
                        </el-radio>


                </el-radio-group>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="reasonVisible = false">取 消</el-button>
                    <el-button type="primary" @click="reasonOK(reasonTitle)">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog @open="dialog_open" title="备注" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item label="备注" :label-width="formLabelWidth">
                        <el-input type="textarea" v-model="currentRemark" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="closeDialog">确 定</el-button>
                </div>
            </el-dialog>


            <el-dialog title="房间日志" :visible.sync="roomLogDialog">
                <el-table :data="roomLogList">
                    <el-table-column property="action" label="动作"></el-table-column>
                    <el-table-column property="originalStatus" label="原状态"></el-table-column>
                    <el-table-column property="newStatus" label="新状态"></el-table-column>
                    <el-table-column property="createTime" label="操作时间"></el-table-column>
                    <el-table-column property="optName" label="操作人"></el-table-column>
                </el-table>
                <el-pagination
                    @current-change="roomLogAction"
                    background
                    layout="prev, pager, next"
                    :total="roomLogTotal">
                </el-pagination>
            </el-dialog>
            <cardDoor :makeCardDialog="makeCardDialog" :hotelDoorCard="hotelDoorCard"
                      @cancel="makeCardDialog = false"></cardDoor>

            <handle-check-in :show="showHandleCheckIn" :orderId="orderId"  @confirm="confirmCheckIn" @cancel="showHandleCheckIn = false" :rowId="currentRoomRowId"></handle-check-in>

            <change-room :show="changeRoomModal" @cancel="changeRoomModal = false" @confirm="okChangeRoom"  :orderId="orderId" :roomId="currentRoomObject.roomId"></change-room>

        </div>
    </div>
</template>
<script>
import hotelHeader from "./Hotel_header.vue";
import SelectRoom from "../components/selectRoom/SelectRoom";
import store from "../../../store";
import NatAppHelper from "@/utils/nativeAppHelper";
import { mapState, mapActions, mapMutations } from "vuex";
import cardDoor from "../components/DoorCard";
import HandleCheckIn from "../guestsList/HandleCheckIn"; //办理入住组价
import ChangeRoom from "../guestsList/ChangeRoom"; //换房组件

export default {
  components: { hotelHeader, SelectRoom, cardDoor, HandleCheckIn, ChangeRoom },
  data() {
    return {
      currentRemark: "",
      currentRoomRowId: "",
      hotelDoorCard: {},
      roomLogList: [],
      roomLogDialog: false,
      makeCardDialog: false,
      showHandleCheckIn: false,
      changeRoomModal: false,
      orderId: "", //当前房间订单id
      roomLogTotal: 0,
      roomCountStatu: {
        all: 0,
        checkInClean: 0,
        checkInDirty: 0,
        nocheckInDirty: 0,
        noCHeckInClean: 0,
        isReservation: 0,
        lock: 0,
        repair: 0
      },
      roomInfomation: {},
      hotelList: _.range(6),
      styleObject: {
        repair: "background-color:#d81e06",
        noCHeckInClean: "background-color:#ffffff",
        checkInClean: "background-color:#40affc",
        checkInDirty: "background-color:rgb(153, 102, 0)",
        nocheckInDirty: "background-color:#C9C9C9",
        lock: "background-color:#88147f",
        init: "background-color:#FFFFFF",
        isReservation: "background-color:#18c34d"
      },
      elColButton: false,
      lastElColButtonIndex: 0,
      setting: { rowSize: 12 },
      dialogFormVisible: false,
      currentRoomObject: {},
      form: {},
      formLabelWidth: null,

      inputSearch: "", //头部搜索
      selectArea: "",
      selectBlock: "",
      hotelBlock: [],
      hotelArea: [],
      hotelRepairConfig: [],
      hotelLockConfig: [],
      hotelReasonId: "", // reson关联ID
      hotelReasonConfig: [], // put hotelLockConfig and hotelRepairConfig's data temp array
      reasonVisible: false, //configReason dialog swich
      reasonTitle: "",
      power: {
        hotelReservationManagePower: true,
        hotelCheckInManagePower: true,
        hotelMobileManagePower: true,
        hotelBillManagePower: true,
        hotelRoomStatusManagePower: true
      }
    };
  },
  created() {
    this.loadConfig();
    this.init();
  },

  beforeCreate: function() {
    //create生命周期前
  },
  mounted() {
    this.loadReasonConfig();
    this.$store.getters.isHasPower("power", this); //酒店预定管理
  },
  methods: {
    ...mapMutations(["loadRedPoint", "loadPowerList"]),
    ...mapMutations({
      SET_HOTEL_LIST: "SET_HOTEL_LIST"
    }),
    addReservation() {},
    dialog_open() {},
    loadConfig() {
      /**
                 *       115:空净房"+
                 "        116:空脏房"+
                 "        117:住脏房"+
                 "        118:住客房"+
                 "        119:预定房"+
                 "        120:维修房"+
                 "        121:锁定房"
                 * */
      let url = "/zingbiz/hotel/hotelNew/getRoomStateConfigList";
      let self = this;
      this.$httpSilent
        .get(url)
        .then(res => {
          if (res.data.length > 0) {
            _.each(res.data, value => {
              if (value.configCode == "115")
                self.styleObject.noCHeckInClean =
                  "background-color:" + value.configValue;
              if (value.configCode == "116")
                self.styleObject.nocheckInDirty =
                  "background-color:" + value.configValue;
              if (value.configCode == "118")
                self.styleObject.checkInDirty =
                  "background-color:" + value.configValue;
              if (value.configCode == "117")
                self.styleObject.checkInClean =
                  "background-color:" + value.configValue;
              if (value.configCode == "119")
                self.styleObject.isReservation =
                  "background-color:" + value.configValue;
              if (value.configCode == "120")
                self.styleObject.repair =
                  "background-color:" + value.configValue;
              if (value.configCode == "121")
                self.styleObject.lock = "background-color:" + value.configValue;
            });
          }
        })
        .catch(error => {
          self.$message({ type: "error", message: "请求数据失败，请重试" });
        });
    },
    init(params) {
      /** load hotelConfig block area infomation */

      this.$http
        .all([
          this.$httpSilent.get(
            "/zingbiz/hotel/hotelNew/getHotelConfig?pageNumber=1&pageSize=999&configCode=100"
          ),
          this.$httpSilent.get(
            "/zingbiz/hotel/hotelNew/getHotelConfig?pageNumber=1&pageSize=999&configCode=102"
          )
        ])
        .then(
          this.$http.spread((acct, perms) => {
            this.hotelBlock = acct.data.data;
            this.hotelArea = perms.data.data;
          })
        );

      /** init房间 */
      this.$httpSilent
        .get(
          // "/zingbiz/hotel/hotelOrders/getRoomList",
          "/zingbiz/hotel/hotelNew/getRoomInfoList",
          // "/zingbiz/hotel/hotelOrders/getRoomsWithRoomType",
          { params: params || {} }
        )
        .then(res => {
          let roomList = res.data.data;
          roomList = _.sortBy(roomList, room => {
            return ~~room.roomNo;
          });
          this.SET_HOTEL_LIST(roomList);
          this.setRoomCountByStatu(res.data.data);
          //所有一切加载完  懒加载下维修原因  锁房原因
          
        })
        .catch(err => {
          console.log(err);
        });
    },
    loadReasonConfig() {
      this.$http
        .all([
          this.$http.get(
            "/zingbiz/hotel/hotelNew/getHotelConfig?pageNumber=1&pageSize=50&configCode=106"
          ),
          this.$http.get(
            "/zingbiz/hotel/hotelNew/getHotelConfig?pageNumber=1&pageSize=50&configCode=105"
          )
        ])
        .then(
          this.$http.spread((acct, perms) => {
            this.hotelRepairConfig = acct.data.data;
            this.hotelLockConfig = perms.data.data;
          })
        );
    },
    getLockValue(item) {
     
      console.log('this si getLockValue' )
      console.log(this.hotelLockConfig)
      console.log(item)
      let configValue;
      if(this.hotelLockConfig.length > 0){
        let value = _.find(this.hotelLockConfig, lock => {
            return lock.rowId === item.lockReasonId;
          })
          if(!_.isEmpty(value)){
            configValue = value.configValue
          }else{
            configValue = ''
          }
      }else{
        configValue = ""
      }
      console.log('configValue : ' + configValue)
      return configValue;
      
    },
    getRepairValue(item) {
      console.log('this si getRepair' )
      console.log(this.hotelRepairConfig)
      console.log(item)
      let configValue;
      if(this.hotelRepairConfig.length > 0){
        let value = _.find(this.hotelRepairConfig, repair => {
            return repair.rowId === item.repaiReasonId;
          })
          if(!_.isEmpty(value)){
            configValue = value.configValue
          }else{
            configValue = ''
          }
      }else{
        configValue = ""
      }
      console.log('configValue : ' + configValue)
      return configValue;
    },
    clearRoomStatus() {
      this.roomCountStatu = {
        all: 0,
        checkInClean: 0,
        checkInDirty: 0,
        nocheckInDirty: 0,
        noCHeckInClean: 0,
        isReservation: 0,
        lock: 0,
        repair: 0
      };
    },
    searchEvent(value, type) {
      this.clearRoomStatus();
      console.log("selectChange key : " + value);
      console.log(value);
      let param = {};
      if (type === "floorBlock") {
        param.floorBlock = value;
      }
      if (type === "floorArea") {
        param.floorArea = value;
      }
      //   debugger;
      this.init(param);
    },
    inputSearchEvent() {
      this.init({ roomNo: this.inputSearch });
    },
    popoverShow(roomObject) {},
    getInfoByOrderInfo(object, key) {
      if (
        !_.isUndefined(object.roomOrderInfo) &&
        !_.isEmpty(object.roomOrderInfo) &&
        object.roomOrderInfo !== null
      ) {
        if (!_.isUndefined(object.roomOrderInfo[key])) {
          if (key === "outerTime" || key === "enterTime") {
            if (
              !_.isEmpty(object.roomOrderInfo[key]) &&
              object.roomOrderInfo[key] !== null &&
              object.roomOrderInfo[key].length > 10
            ) {
              return object.roomOrderInfo[key].substring(0, 10);
            }
          }
          return object.roomOrderInfo[key];
        } else {
          return "";
        }
      }
    },
    
    popoverClick(value, row, item) {
      //鼠标点击酒店房
      this.currentRoomObject = this.hotelData[row][item];
      this.elColButton = !this.elColButton; //todo:为什么不写此行 vue vm不绑定？
      this._hotelList[row * this.setting.rowSize + item].isShow = !value.isShow;
      if (this.lastElColButtonIndex != row * this.setting.rowSize + item)
        this._hotelList[this.lastElColButtonIndex].isShow = false;
      this.lastElColButtonIndex = row * this.setting.rowSize + item;
    },
    dropDownAction(action) {
      this.buttonAction(null, action);
    },
    buttonAction(even, action, infomation) {
     console.log('this is button Action ...')
      //酒店操作动作
      // let originalStatus  = this.currentRoomObject.originalStatus
      // let newStatus = this.currentRoomObject.newStatus
      this.currentRoomObject.action = action;
      if (!_.isUndefined(infomation)) {
        this.currentRoomObject = this.hotelData[infomation[0]][infomation[1]];
      }
      if (this.currentRoomObject.isCheck === 1) {
        this.currentRoomObject.originalStatus = "住";
      } else {
        this.currentRoomObject.originalStatus = "空";
      }

      if (this.isClean(this.currentRoomObject)) {
        this.currentRoomObject.originalStatus += "净、";
      } else {
        this.currentRoomObject.originalStatus += "脏、";
      }

      if (action === "备注") {
        _.isEmpty(this.currentRoomObject.roomOrderInfo)
          ? (this.currentRemark = "")
          : (this.currentRemark = this.currentRoomObject.roomOrderInfo.remark);
        this.openDialog(infomation);
      } else if (action === "预定") {
        this.$router.push({
          path: "singleReserve?reserveMenu=1",
          query: {
            roomState: true,
            roomId: this.currentRoomObject.roomId,
            roomNo: this.currentRoomObject.roomNo,
            roomTypeId: this.currentRoomObject.roomTypeId,
            roomTypeDesc: this.currentRoomObject.roomTypeDesc
          }
        });
      } else if (action === "维修") {
        this.reasonTitle = "维修";
        this.openConfigDialog("维修");
      } else if (action === "维修完成") {
        this.currentRoomObject.originalStatus += "修、";
        this.currentRoomObject.newStatus = this.currentRoomObject.originalStatus.replace(
          "修、",
          "修完"
        );
        this.currentRoomObject.isRepair = 0;
        this.updateRoom(this.currentRoomObject);
      } else if (action === "锁房") {
        debugger // 临时调试biz
        this.currentRoomObject.originalStatus += "未锁、";
        this.currentRoomObject.newStatus = this.currentRoomObject.originalStatus.replace(
          "未锁、",
          "锁、"
        );
        this.reasonTitle = "锁房";
        this.openConfigDialog("锁房");
      } else if (action === "取消锁房") {
        this.currentRoomObject.originalStatus += "锁、";
        this.currentRoomObject.newStatus = this.currentRoomObject.originalStatus.replace(
          "锁、",
          "未锁、"
        );
        this.currentRoomObject.isLock = 0;
        this.updateRoom(this.currentRoomObject);
      } else if (action === "打扫") {
        this.currentRoomObject.isClean = 1;
        this.currentRoomObject.newStatus = this.currentRoomObject.originalStatus.replace(
          "净、",
          "脏、"
        );
        this.updateRoom(this.currentRoomObject);
      } else if (action === "打扫完成") {
        this.currentRoomObject.newStatus = this.currentRoomObject.originalStatus.replace(
          "脏、",
          "净、"
        );
        this.currentRoomObject.isClean = 2;
        this.updateRoom(this.currentRoomObject);
      } else if (action === "入住") {
        //如果是预订的办理入住,调取办理入住组件,,否则,空房入住,跳转入住页面
        if (this.currentRoomObject.isReservation === "1") {
          if (
            !this.currentRoomObject.roomOrderInfo ||
            !this.currentRoomObject.roomOrderInfo.orderId
          ) {
            this.$message({ message: "没有查到订单信息", type: "error" });
            return;
          } else {
            this.orderId = this.currentRoomObject.roomOrderInfo.orderId;

            this.currentRoomRowId = this.currentRoomObject.roomOrderInfo.orderNo;
            console.log(this.currentRoomRowId);
            this.showHandleCheckIn = true;
          }
        } else {
          // let orderId = this.currentRoomObject.orderInfo.orderId;
          this.$router.push({
            path: "singleCheckIn?checkInMenu=1",
            query: {
              roomState: true,
              roomId: this.currentRoomObject.roomId,
              roomNo: this.currentRoomObject.roomNo,
              roomTypeId: this.currentRoomObject.roomTypeId,
              roomTypeDesc: this.currentRoomObject.roomTypeDesc
            }
          });
        }
      } else if (action === "续住") {
        // this.$router.push({
        //   path: "/hotel/singleCheckIn",
        //   query: { room: this.currentRoomObject }
        // });
        this.$message({ message: "开发中...", type: "success" });
      } else if (action === "换房") {
        if (
          !this.currentRoomObject.roomOrderInfo ||
          !this.currentRoomObject.roomOrderInfo.orderId
        ) {
          this.$message({ message: "没有查到订单信息", type: "error" });
          return;
        } else {
          this.orderId = this.currentRoomObject.roomOrderInfo.orderId;
          this.changeRoomModal = true;
        }
      } else if (action === "账单") {
        if (
          !this.currentRoomObject.roomOrderInfo ||
          !this.currentRoomObject.roomOrderInfo.orderId
        ) {
          this.$message({ message: "没有查到订单信息", type: "error" });
          return;
        }
        this.$router.push({
          path: "/hotel/guestsBill",
          query: {
            orderId: this.currentRoomObject.roomOrderInfo.orderId,
            roomId: this.currentRoomObject.roomId
          }
        });
      } else if (action === "房间日志") {
        this.roomLogAction();
      } else if (action === "制卡") {
        this.hotelDoorCard = {
          cardNo: "",
          buildNo: this.currentRoomObject.floorArea,
          floorNo: this.currentRoomObject.floorBlock,
          roomNo: this.currentRoomObject.roomNo,
          // startDate: "",
          endDate: ""
        };
        this.makeCardDialog = true;
      }
      let self = this;
      setTimeout(function() {
        self.reloadRoomStatus();
      }, 2500);
      // this.init();
      even.cancelBubble = true; //冒泡
    },
    //办理入住成功
    confirmCheckIn(val) {
      this.showHandleCheckIn = false;
      this.currentRoomObject.isCheck = "1";
    },
    //换房完成
    okChangeRoom(flag) {
      if (flag) {
        this.changeRoomModal = false;
        this.init();
      }
    },
    reloadRoomStatus() {
      this.clearRoomStatus();
      /** init房间 */
      this.$httpSilent
        .get("/zingbiz/hotel/hotelNew/getRoomInfoList", { params: {} })
        .then(res => {
          this.setRoomCountByStatu(res.data.data);
          //所有一切加载完  懒加载下维修原因  锁房原因
        })
        .catch(err => {
          console.log(err);
        });
    },
    roomLogAction(pageNumber) {
      this.roomLogDialog = true;
      let param = {};
      param.roomId = this.currentRoomObject.roomId;
      param.pageNumber = pageNumber || 1;
      param.pageSize = "10";
      this.$httpSilent("/zingbiz/hotel/roomLog/getRoomLog", { params: param })
        .then(res => {
          this.roomLogList = res.data.data;
          this.roomLogTotal = ~~res.data.total;
          console.log(res);
          // this.roomLogDialog = false;
        })
        .catch(res => {
          console.error(res);
        });
    },
    openDialog(infomation) {
      this.dialogFormVisible = true;
    },
    openConfigDialog(action) {
      this.reasonVisible = true;
      if (action === "维修") {
        this.hotelReasonConfig = this.hotelRepairConfig;

        // this.updateRoom(this.currentRoomObject) }
      }
      if (action === "锁房") {
        this.hotelReasonConfig = this.hotelLockConfig;

        // this.updateRoom(this.currentRoomObject) }
        // this.updateRoom(this.currentRoomObject) }
      }
    },
    reasonOK(action) {
      if (action === "维修") {
        this.currentRoomObject.isRepair = 1;
        this.currentRoomObject.isCheck = 0;
        this.currentRoomObject.repaiReasonId = this.hotelReasonId;
      }

      if (action === "锁房") {
        this.currentRoomObject.isLock = 1;
        this.currentRoomObject.lockReasonId = this.hotelReasonId;
      }

      this.updateRoom(this.currentRoomObject);
      this.reasonVisible = false;
    },
    closeDialog() {
      // 填写备注后确认
      var self = this;
      let order = this.currentRoomObject.roomOrderInfo;
      order.remark = this.currentRemark;
      this.updateOrder(order, () => {
        self.dialogFormVisible = false;
      });
      this.dialogFormVisible = false;
    },
    updateRoom(data, fn) {
      // 保存房间动作
      let url = "/zingbiz/hotel/hotelNew/saveHotelRoom";
      let param = data;
      param.cardUrl = null;
      this.$httpSilent
        .post(url, param)
        .then(res => {
          // fn()  message success !
        })
        .catch(err => {
          console.log(err);
        });
    },
    updateOrder(data, fn) {
      // 保存房间动作
      let url = "/zingbiz/hotelNew/hotelOrder/updateOrder";
      let param = {};
      param.orderId = data.orderId;
      param.remark = data.remark;
      this.$httpSilent
        .post(url, param)
        .then(res => {
          // fn()  message success !
        })
        .catch(err => {
          console.log(err);
        });
    },
    ddReservation(data) {
      this.$httpSilent
        .post("/zingbiz/hotel/hotelOrders/reserveRoom", data)
        .then(res => {
          // this.loading = false;
          // console.log("res:" + JSON.stringify(res.data));
          if (res.data.success) {
            this.isAddReserveShowplanRoom = false;
            this.init();
          } else {
            this.$message({ type: "error", message: "添加失败，请重试" });
          }
        });
      console.log(data);
    },
    planRoom(room) {
      // 房间选择回调
      console.log(room);
    },
    cancel() {
      this.$emit("cancel");
    },
    readCard() {
      NatAppHelper.readDoorCard("192.168.1.101", cardInfo => {
        if (cardInfo.code === 1) {
          let info = cardInfo.data;
          let buildFloorRoomArr = info.roomNo.split("#");
          this.hotelDoorCard = info;
          this.hotelDoorCard.buildNo = buildFloorRoomArr[0];
          this.hotelDoorCard.floorNo = buildFloorRoomArr[1];
          this.hotelDoorCard.roomNo = buildFloorRoomArr[2];
        } else {
          console.error("读卡失败");
        }

        console.log(cardInfo);
      });
    },
    makeDoorCard() {
      NatAppHelper.writeDoorCard("192.168.1.101", this.hotelDoorCard);
    },
    isClean(json) {
      if (
        json.isClean === 2 ||
        json.isClean === null ||
        json.isClean === 0 ||
        json.isClean === "0" ||
        json.isClean === "2"
      ) {
        return true;
      } else {
        return false;
      }
    },
    roomHover(obj) {
      // console.log(obj)
      this.currentRoomObject = obj;
    },
    setRoomCountByStatu(origin) {
      let roomCountStatu = this.roomCountStatu;

      function isClean(json) {
        if (
          json.isClean === 2 ||
          json.isClean === null ||
          json.isClean === 0 ||
          json.isClean === "0" ||
          json.isClean === "2"
        ) {
          return true;
        } else {
          return false;
        }
      }

      _.each(origin, function(v) {
        roomCountStatu.all++;
        if (v.isCheck == 1) {
          //住
          if (isClean(v)) {
            // 净
            roomCountStatu.checkInClean++;
          } else {
            roomCountStatu.checkInDirty++;
          }
        } else {
          // 空
          if (isClean(v)) {
            // 净
            roomCountStatu.noCHeckInClean++;
          } else {
            //脏
            roomCountStatu.nocheckInDirty++;
          }
        }
        if (v.isLock == "1") {
          roomCountStatu.lock++;
        }
        if (v.isRepair == "1") {
          roomCountStatu.repair++;
        }
        if (v.isReservation == "1") {
          roomCountStatu.isReservation++;
        }
      });
    }
  },
  computed: {
    ...mapState({
      _hotelList: state => {
        let hotelList = state.hotel.hotelList;
        hotelList = _.sortBy(hotelList, function(object) {
          // 手动改变underscore的字符串排序逻辑，系统内不会出现真正的字符串，只会是字符串类型的数字，强转即可
          if (!_.isNaN(object.serialNumber)) {
            object.serialNumber = ~~object.serialNumber;
            return object.serialNumber; //serialNumber为节点房间排序字段！
          }
        });
        return hotelList;
      }
    }),
    hotelData: {
      // hotel数据计算
      get() {
        const hotelArr = [];
        this._hotelList.forEach((v, k) => {
          let currentIndex = Math.ceil((k + 1) / this.setting.rowSize) - 1;
          if (!_.isArray(hotelArr[currentIndex])) hotelArr[currentIndex] = [];
          v.isShow = false;
          hotelArr[currentIndex].push(v);
        });
        console.log(hotelArr);
        return hotelArr;
      },
      set(value) {}
    },
    // getLockValue: {
    //   get(item){
    //     let configValue;
    //   this.hotelLockConfig.length > 0
    //     ? (configValue = _.find(this.hotelLockConfig, lock => {
    //         return lock.rowId === item.lockReasonId;
    //       }).configValue || '')
    //     : (configValue = "");

    //   return configValue;
    //   }
      
    // },
    // getRepairValue : {
    //   get(item){
    //   let configValue;
    //   this.hotelRepairConfig.length > 0
    //     ? _.find(this.hotelRepairConfig, repair => {
    //         return repair.rowId === item.repaiReasonId;
    //       }).configValue || ''
    //     : (configValue = "");
    //   return configValue;
    //   }
    // },

  }
};
</script>
<style scoped lang="stylus">
.guestMakeCard {
  .cardTop {
    margin-bottom: 10px;
    display: flex;

    span {
      flex: 1;
    }
  }

  .cardContent {
    border: 1px solid #aaa;
  }

  .cardBottom {
    position: relative;

    .bottomBtn {
      position: absolute;
      right: 0px;
      top: 10px;
    }
  }

  .cardBtn {
    justify-content: center;
  }

  p {
    padding: 8px;
  }
}

.mainPage {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.el-popper {
  padding-right: 0px;
  padding-left: 0px;
}

.el-col-button {
  position: absolute;
  bottom: 5px;
  padding-left: 5px;
  padding-right: 5px;
  /* width: 100%;
  left: 0px; */
}

.el-main {
  height: 800px;
}

.tips-btn {
  padding: 15px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

/* col */
.el-row {
  margin-bottom: 3px;

  & :last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 110px;
  height: 128px;
}

.row-bg {
  padding: 10px 0;
  background-color: #909399;
}

.triangleTag {
  width: 0;
  height: 0;
  border-width: 30px;
  border-style: solid;
  border-top-right-radius: 5px;
  opacity: 0.8;
  border-color: #18c34d #18c34d transparent transparent;
  position: absolute;
  z-index: 10;
  right: 0;
  top: 0;
}

.roomTag {
  width: 17px;
  height: 17px;
  padding-left: 0px;
  padding-right: 0px;
  position: relative;
  top: 3px;
}

.bottom-text-center {
  margin-top: 5px;
}

.nocolor {
  background-color: transparent;
  border: 0px;
  color: black;
}

.nocolor:hover {
  background-color: transparent;
  border: 0px;
  color: black;
}

.el-icon-more {
  color: black;
}

.el-radio.el-radio {
  margin-left: 30px;
  width: 100px;
}
</style>
