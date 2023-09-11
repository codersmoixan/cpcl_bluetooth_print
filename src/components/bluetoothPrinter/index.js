import { View, Button } from '@tarojs/components'
import useConnection from 'utils/cpcl_bluetooth_print/hooks/useConnection'
import styles from './styles.module.less'
import useBluetoothPrint from "utils/cpcl_bluetooth_print/hooks/useBluetoothPrint";

function BluetoothPrinter() {
  const { devicesList, connectedDevice, start, connect, research } = useConnection()
  const { print } = useBluetoothPrint()

  const handlePrint = () => print(connectedDevice)

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
            <View key={printer.deviceId}>
              <View className='device-action'>
                <View className='device-row__bd'>{printer.name || '未知设备'}</View>
                {connectedDevice?.deviceId !== printer?.deviceId && <View onClick={() => connect(printer)} className='print-device__hd__desc'>连接</View>}
              </View>
              <View className='device-row__ft'>
                <View styles={{ fontSize: '14px' }}>
                  <Button
                    className='print-button'
                    onClick={(e) => handlePrint(printer, e)}
                  >
                    打印示例
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
