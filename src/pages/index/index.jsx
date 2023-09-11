import { useLoad } from '@tarojs/taro'
import BluetoothPrinter from "components/bluetoothPrinter";
import './index.less'

export default function Index() {

  useLoad(() => {
    console.log('Page loaded.')
  })

  return <BluetoothPrinter />
}
