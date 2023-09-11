import { command } from '../template/demo1'
import common, {tfmbuffer} from "../common/common";
import Taro from "@tarojs/taro";

const useBluetoothPrint = () => {

  const print = async (device) => {
    try {
      common.showLoading('打印中...')
      const buffer = tfmbuffer(command)
      const maxChunk = 20
      for (let c = 0; c < buffer.length; c++) {
        let i = 0,
          j = 0,
          length = buffer[c].byteLength
        for (; i < length; i += maxChunk, j++) {
          let subPackage = buffer[c].slice(i, i + maxChunk <= length ? (i + maxChunk) : length);
          setTimeout((value) => {
            Taro.writeBLECharacteristicValue({
              deviceId: device.deviceId,
              characteristicId: device.characteristicId,
              serviceId: device.serviceId,
              value,
              success() {
                if (c >= (buffer.length - 1)) {
                  common.showToast('打印成功')
                }
              },
              fail() {
                common.showToast('打印失败')
              }
            })
          }, 20, subPackage);
        }
      }
    } catch (err) {
      console.log(err, 1355);
      common.showToast('打印失败')
    }
  }

  return {
    print
  }
}

export default useBluetoothPrint
