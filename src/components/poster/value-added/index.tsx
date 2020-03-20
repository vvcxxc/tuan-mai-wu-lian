import { View, Image, Text } from "@tarojs/components"
import HaveGift from '@/components/poster/value-added/have-gift'//有礼品版本
import NoGift from '@/components/poster/value-added/no-gift'//无礼品版本
import Other from '@/components/poster/value-added/other'//其他版本(同拼团海报类似)
import '../index.styl'
interface Params {
  type: any,
  list?: Array<Object>
}

const ValueAdded = (params: Params) => {
  const { type, list } = params
  const showType = ['HaveGift', 'NoGift', 'Other'][params.type]
  return (
    <View>
      {
        {
          'HaveGift': <HaveGift />,
          'NoGift': <NoGift />,
          'Other': <Other />
        }[showType]
      }
    </View >
  )
}

export default ValueAdded