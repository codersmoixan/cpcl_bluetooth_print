import common, {tfmbuffer} from "../common/common";
import Taro from "@tarojs/taro";
import {isEmpty} from "lodash";

const useBluetoothPrint = () => {
  const print = (device, code) => {
    if (!device) {
      return common.showToast('请选择打印机')
    }
    if (!code) {
      return common.showToast('模板数据异常')
    }

    return new Promise((resolve, reject) => {
      try {
        common.showLoading('打印中...')
        const buffer = tfmbuffer(code)
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
                    resolve(true)
                  }
                },
                fail(err) {
                  common.showToast('打印失败')
                  reject(err)
                }
              })
            }, 20, subPackage);
          }
        }
      } catch (err) {
        common.showToast('打印失败')
        reject(err)
      }
    })
  }

  const queuePrint = async (device, queue = [], times = 0) => {
    if (isEmpty(queue)) {
      return common.showToast('模板数据异常')
    }

    if (queue[times]) {
      common.showToast('打印中', {
        icon: 'loading'
      })
      const result = await print(device, queue[times])
      if (result) {
        await queuePrint(device, queue, ++times)
      }
    } else {
      common.showToast('数据已全部发送', {
        icon: 'success'
      })
    }
  }

  return {
    print,
    queuePrint
  }
}

export default useBluetoothPrint
