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
  console.log(list,'list')
  const showType = ['HaveGift', 'NoGift', 'Other'][params.type]
  return (
    show?<View>
      {
        {
          'HaveGift': <HaveGift list={list} onClose={() => params.onClose()}/>,
          'NoGift': <NoGift list={list} onClose={() => params.onClose()}/>,
          'Other': <Other list={list} onClose={() => params.onClose()}/>
        }[showType]
      }
    </View >:null
  )
}

export default ValueAdded