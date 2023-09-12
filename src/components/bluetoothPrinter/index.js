import { View, Button } from '@tarojs/components'
import useConnection from 'utils/cpcl_bluetooth_print/hooks/useConnection'
import styles from './styles.module.less'
import useBluetoothPrint from "utils/cpcl_bluetooth_print/hooks/useBluetoothPrint";
import SF from "utils/cpcl_bluetooth_print/template/shunfeng";
// import { command as code } from 'utils/cpcl_bluetooth_print/template/demo1'

function BluetoothPrinter() {
  const { devicesList, connectedDevice, start, connect, closeConnect, research } = useConnection()
  const { print, queuePrint } = useBluetoothPrint()

  const handlePrint = () => {
    const code = SF().getData()
    console.log(code, '98999');
    console.log('----------------')
    console.log(code, 33522)
    print(connectedDevice, code)
  }

  const batchPrint = () => {
    const code = SF().getData()
    const queue = [code, code]
    queuePrint(connectedDevice, queue)
  }

  return (
    <View className={styles.root}>
      <View className='print-device__hd'>
        <View className='print-device__hd__title'>选择打印设备</View>
        <View className='print-search'>
          <View onClick={start} className='print-device__hd__desc'>
            搜索蓝牙
          </View>
          <View onClick={research} className='print-device__hd__desc'>
            重新搜索
          </View>
        </View>
      </View>

      <View className={styles.printList}>
        {devicesList.map(printer => (
          <View className='device-row'>
            <View key={printer.deviceId} style={{ width: '100%' }}>
              <View className='device-action'>
                <View className='device-row__bd'>{printer.name || '未知设备'}</View>
                {connectedDevice?.deviceId !== printer?.deviceId
                  ?
                  <View onClick={() => connect(printer)} className='print-device__hd__desc'>连接</View>
                  :
                  <View onClick={() => closeConnect(printer?.deviceId)} className='print-device__hd__desc'>断开连接</View>
                }
              </View>
              <View className='device-row__ft'>
                <View styles={{ fontSize: '14px' }}>
                  <Button
                    className='print-button'
                    onClick={handlePrint}
                  >
                    打印示例
                  </Button>
                </View>
                <View styles={{ fontSize: '14px' }}>
                  <Button
                    className='print-button'
                    onClick={batchPrint}
                  >
                    队列打印示例
                  </Button>
                </View>
                <View styles={{ fontSize: '14px' }}>
                  <Button className='print-button'>
                    打印顺丰
                  </Button>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

export default BluetoothPrinter
