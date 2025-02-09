import { createSlice } from "@reduxjs/toolkit";
import { getCookie } from "../../shared/Cookie";
import socketIOClient from "socket.io-client";
import { logOut } from "./user";
import { setLoading } from "./answer";
import { history } from "../configStore";
import useSound from 'use-sound';
import boopSfx from "../../static/sounds/YOO.mp3";


const notiSlice = createSlice({
  name: "noti",
  initialState: {
    noti_list: [],
    new_list: [],
    is_checked: false,
    searchModal: false,
    is_sound: true,
  },
  reducers: {
    setSearch: (state, action) => {
      state.searchModal = action.payload;
    },
    setNoti: (state, action) => {
      state.noti_list = action.payload.msg;
      state.is_checked = action.payload.checked;
    },
    addNoti: (state, action) => {
      if(action.payload.eventType !== 'tag'){
        if(state.new_list.findIndex(
          (n) => n.cardId === action.payload.cardId &&
                n.recentNickname === action.payload.recentNickname &&
                n.eventType === action.payload.eventType
        ) !== -1){
          return
        }
        state.new_list.unshift(action.payload);
        state.is_checked = true;
        return;
      }
      state.new_list.unshift(action.payload);
      state.is_checked = true;
    },
    alarmChecked: (state) => {
      state.is_checked = false;
    },
    deleteNoti: (state, action) => {
      state.noti_list = state.noti_list.filter((n)=>{
        if(n.cardId !== action.payload.answerId){
          return [...state.noti_list, n]
        }
      });
      state.new_list = state.new_list.filter((n) => {
        if(n.cardId !== action.payload.answerId){
          return [...state.new_list, n]
        }
      });
    },
    editSound : (state, action) => {
      state.is_sound = action.payload;
    },
  },
});

export const socket = socketIOClient(`https://lkj99.shop/alarm`);

const joinAlarmIO = () => {
  return function (dispatch) {
    const token = getCookie("is_login");
    socket.emit("joinAlarm", { token: token });
    socket.on("joinAlarm", function (data) {
      dispatch(setNoti(data));
    });
  };
};

const leaveAlarmIO = () => {
  return function (dispatch, getState) {
    socket.emit("leave");
    dispatch(setLoading(true));
    dispatch(logOut());
    if(getState().router.location.pathname === "/"){
      window.location.reload()
    } else{
      history.replace("/");
    }
  };
};

const openAlarmIO = (user_id) => {
  return function (dispatch) {
    socket.emit("openAlarm", { id: user_id });
    dispatch(alarmChecked());
  };
};

export const { 
  setNoti, 
  addNoti, 
  alarmChecked, 
  setSearch, 
  deleteNoti, 
  editSound,
} = notiSlice.actions;

export const api = {
  joinAlarmIO,
  openAlarmIO,
  leaveAlarmIO,
};

export default notiSlice.reducer;
