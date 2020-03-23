import { View, Image, Text } from "@tarojs/components"
import HaveGift from '@/components/poster/value-added/have-gift'//有礼品版本
import NoGift from '@/components/poster/value-added/no-gift'//无礼品版本
import Other from '@/components/poster/value-added/other'//其他版本(同拼团海报类似)
import '../index.styl'
interface Params {
  type: any,
  show:boolean,
  list?: any,
  onClose:()=>void
}

const ValueAdded = (params: Params) => {
  const { type, list, show } = params
  return (
    show ? <View>
      {
        !params.type ? <Other list={list} onClose={() => params.onClose()} />
          : list.gift.gift_pic ? <HaveGift list={list} onClose={() => params.onClose()} /> :
            <NoGift list={list} onClose={() => params.onClose()} />
      }
    </View >:null
  )
}

export default ValueAdded