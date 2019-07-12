import { fromJS } from 'immutable'

const SEARCHNAME = 'SEARCHNAME'
const SETSEARCHNAME = 'SETSEARCHNAME'
const initState = fromJS({
  serchName: ''
})

export default {
  namespace: 'search',
  state: initState,
  effects: { // Action 处理器，处理异步动作
    * searchname({ payload }, { put }: DvaApi) {
      yield put({ type: SEARCHNAME, payload }) //put 发出一个action
    }
  },
  reducers: { // 处理同步操作
    SEARCHNAME(state: any, payload: any): any {
      console.log(payload,'paylodad')
      return state
        .merge({
          serchName: payload.payload.serchName
        })
    }
  }
}
