import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import moment from 'moment';
import { getCookie } from '../../shared/Cookie';
import {api as communityActions, setCardLoading} from './community';
import { api as commentActions } from "./comment";
import swal from "sweetalert";
import {addCustomQuestion, setCustomCount} from "./custom"

axios.defaults.baseURL = 'https://lkj99.shop';
axios.defaults.headers.common["Authorization"]= `Bearer ${getCookie('is_login')}`;


const booksSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    date: moment(),
    formated_date: 0,
    component:'',
    book_detail:[],
    page_owner:null,
    book_loading: true,
    book_detail_modal: null,
    date_visible:true,
  },
  reducers: {
    setDateVisible: (state, action) => {
        state.date_visible = action.payload;
    },
    setBookDetailModal: (state, action) => {
        state.book_detail_modal = action.payload;
    },
    setPageOwner: (state, action) => {
        state.page_owner = action.payload;
    },

    setBookDetail: (state,action) => {
        state.book_detail = action.payload;
    },

    setBooks:(state, action) => {
        state.books = action.payload
    },

    changeDate: (state, action) => {
        if(action.payload === 2){
            const new_date = state.date.add(1,'M');
            state.date = new_date
            state.formated_date = new_date.format('YYYY . MM')
        } else if(action.payload === 1){
            const new_date = state.date.subtract(1,'M')
            state.date = new_date
            state.formated_date = new_date.format('YYYY . MM')
        }
        else if(action.payload === 0){
            state.formated_date = state.date.format('YYYY . MM')
        } else {
            const new_date = moment(action.payload, 'YYYYMMDD');
            state.date = new_date;
            state.formated_date = new_date.format('YYYY . MM');
        }
    },
    setComponent: (state, action) => {
        state.component = action.payload;
    },
    setBookLoading: (state, action) => {
        state.book_loading = action.payload;
    },
    deleteBook: (state, action) => {
        const now_book = state.books.find(v => v._id === action.payload.date);
        if(now_book){
            const now_book_idx = state.books.findIndex(v => v === now_book);
            if(now_book.count < 2){
                state.books.splice(now_book_idx,1);
            } else{
                state.books[now_book_idx].count -= 1
            }
            const idx = state.book_detail.findIndex(v => v.answerId === action.payload.answerId);
            state.book_detail.splice(idx,1);
        }

    },
    resetBooks: (state) => {
        state.books = [];
    }
  },
});


const getBooks = (towhen) => {
    return function( dispatch, getState ) {

        if(towhen === 1){
            dispatch(changeDate(1));
        }
        if(towhen === 2) {
            dispatch(changeDate(2));
        }

        const date = getState().books.date.format('YYMM')
        const options = {
            url:`/bookshelf/books/${date}`,
            method:'GET',
        };
        axios(options).then((response) => {
            dispatch(setBooks(response.data.books))
        }).catch((err) => {
            console.log(err)
            if(err.response){
                console.log(err.response.data)
            }
        })
    }
}

const getBookDetail = (date, history, type=null) => {
    return function(dispatch) { 

        const options = {
            url:`bookshelf/bookDetail/${date}`,
            method:'GET',
        };
        axios(options).then((response) => {
            let book_list = []
            response.data.booksDiary.forEach((v) => {
                book_list.push({
                    ...v,
                    date:date
                })
            })
            dispatch(setBookDetail(book_list))
            dispatch(setBookLoading(false))
            if(type){
                history.push(`/bookdetail/${date}/${response.data.booksDiary[0].answerId}`)
            }
        }).catch((err) => {
            if(err.response){
                console.log(err.response.data)
            }
            dispatch(setBookLoading(false))
        })
    }
}

const getNextDetail = (date) => {
    return function(dispatch, getState) { 

        dispatch(setCardLoading(true))
        const options = {
            url:`bookshelf/bookDetail/${date}`,
            method:'GET',
        };
        axios(options).then((response) => {
            let book_list = []
            response.data.booksDiary.forEach((v) => {
                book_list.push({
                    ...v,
                    date:date
                })
            })
            dispatch(setBookDetail(book_list))
        }).then(()=> {
            const book_detail = getState().books.book_detail
            
            dispatch(communityActions.getCardDetail(book_detail[0].answerId,'book'))
            dispatch(communityActions.getLikeList(book_detail[0].answerId))
            dispatch(commentActions.getCommentAX(book_detail[0].answerId))
            dispatch(setBookLoading(false))
        }).catch((err) => {
            if(err.response){
                console.log(err.response.data)
            }
            dispatch(setBookLoading(false))
        })
    }
}

const getPreviousDetail = (date) => {
    return function(dispatch, getState) {
        dispatch(setCardLoading(true))
        const options = {
            url:`bookshelf/bookDetail/${date}`,
            method:'GET',
        };
        axios(options).then((response) => {
            let book_list = []
            response.data.booksDiary.forEach((v) => {
                book_list.push({
                    ...v,
                    date:date
                })
            })
            dispatch(setBookDetail(book_list))
        }).then(()=> {
            const book_detail = getState().books.book_detail
            
            dispatch(communityActions.getCardDetail(book_detail[book_detail.length-1].answerId,'book'))
            dispatch(communityActions.getLikeList(book_detail[book_detail.length-1].answerId))
            dispatch(commentActions.getCommentAX(book_detail[book_detail.length-1].answerId))
            dispatch(setBookLoading(false))
        }).catch((err) => {
            if(err.response){
                console.log(err.response.data)
            }
            dispatch(setBookLoading(false))
        })
    }
}

const getOthersBooks = (towhen, id) => {
    return function( dispatch, getState ) {

        if(towhen === 1){
            dispatch(changeDate(1));
        }
        if(towhen === 2) {
            dispatch(changeDate(2));
        }

        const date = getState().books.date.format('YYMM')
        const options = {
            url:`/bookshelf/other/books/${date}/${id}`,
            method:'GET',
        };
        axios(options).then((response) => {

            dispatch(setBooks(response.data.books))
        }).catch((err) => {
            if(err.response){
                console.log(err.response.data)
            }
        })
    }
}

const getOthersBookDetail = (date,id,history,type=null) => {
    return function(dispatch) { 

        dispatch(setBookLoading(true));

        const options = {
            url:`bookshelf/other/bookDetail/${date}/${id}`,
            method:'GET',
        };
        axios(options).then((response) => {
            let book_list = []
            response.data.booksDiary.forEach((v) => {
                book_list.push({
                    ...v,
                    date:date
                })
            })
            dispatch(setBookDetail(book_list));
            dispatch(setBookLoading(false));
            if(type){
                history.push(`/othersdetail/${date}/${id}/${response.data.booksDiary[0].answerId}`)
            }
        }).catch((err) => {
            if(err.response){
                console.log(err.response.data);
            };
            dispatch(setBookLoading(false));
        })
    }

}

const getNextOthersBookDetail = (date,id) => {
    return function(dispatch, getState) { 
        dispatch(setCardLoading(true))
        dispatch(setBookLoading(true));

        const options = {
            url:`bookshelf/other/bookDetail/${date}/${id}`,
            method:'GET',
        };
        axios(options).then((response) => {
            let book_list = []
            response.data.booksDiary.forEach((v) => {
                book_list.push({
                    ...v,
                    date:date
                })
            })
            dispatch(setBookDetail(book_list));
        }).then(()=>{
            const book_detail = getState().books.book_detail
            
            dispatch(communityActions.getCardDetail(book_detail[0].answerId,'book'))
            dispatch(communityActions.getLikeList(book_detail[0].answerId))
            dispatch(commentActions.getCommentAX(book_detail[0].answerId))
            dispatch(setBookLoading(false));
        }).catch((err) => {
            if(err.response){
                console.log(err.response.data);
            };
            dispatch(setBookLoading(false));
        })
    }

}

const getPreviousOthersBookDetail = (date,id) => {
    return function(dispatch, getState) { 
        dispatch(setCardLoading(true))
        dispatch(setBookLoading(true));

        const options = {
            url:`bookshelf/other/bookDetail/${date}/${id}`,
            method:'GET',
        };
        axios(options).then((response) => {
            let book_list = []
            response.data.booksDiary.forEach((v) => {
                book_list.push({
                    ...v,
                    date:date
                })
            })
            dispatch(setBookDetail(book_list));
            
        }).then(()=>{
            const book_detail = getState().books.book_detail
            
            dispatch(communityActions.getCardDetail(book_detail[book_detail.length-1].answerId,'book'))
            dispatch(communityActions.getLikeList(book_detail[book_detail.length-1].answerId))
            dispatch(commentActions.getCommentAX(book_detail[book_detail.length-1].answerId))
            dispatch(setBookLoading(false));
        }).catch((err) => {
            console.log(err);
            if(err.response){
                console.log(err.response.data);
            };
            dispatch(setBookLoading(false));
        })
    }

}

const addQuest = (topic, contents) => {
    return function(dispatch, getState){
        const custom_count = getState().custom.custom_count;
        const options = {
            url:'bookshelf/question',
            method:'POST',
            data: {
                topic:topic,
                contents:contents
            }
        };

        axios(options).then((response)=> {
            let custom = response.data.CustomQuestion
            dispatch(addCustomQuestion({
                answerCount: 0,
                questionContents: custom.contents,
                questionCreatedAt: custom.createdAt,
                questionId: custom.questionId,
                questionTopic : custom.topic, 
            }))
            dispatch(setCustomCount(custom_count + 1))


            swal({
                title: "정상적으로 등록되었습니다.",
                text: `질문이 등록되었습니다.`,
                icon: "success",
            });

        }).catch((err) => {
            swal({
                title: "더이상 질문을 등록할 수 없습니다.",
                text: `하루에 질문은 한개 만 만들 수 있어요.`,
                icon: "error",
            });
            if(err.response){
                console.log(err.response.data)
            }
        })
    }
}

export const { 
    setBooks,
    changeDate,
    setComponent,
    setBookDetail,
    setPageOwner,
    setBookLoading,
    setDateVisible,
    setBookDetailModal,
    deleteBook,
    resetBooks
 } = booksSlice.actions;

export const api = {
    getBooks,
    getBookDetail,
    addQuest,
    getOthersBooks,
    getOthersBookDetail,
    getNextOthersBookDetail,
    getPreviousOthersBookDetail,
    getNextDetail,
    getPreviousDetail,
};

export default booksSlice.reducer;
