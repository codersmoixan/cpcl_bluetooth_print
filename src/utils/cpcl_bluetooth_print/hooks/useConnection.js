import Bluetooth from "../common/bluetooth";
import {useState} from "react";
import common, {filterPrint} from "../common/common";
import Taro from "@tarojs/taro";
import {closeBLEConnection, createBLEConnection, getDeviceServices} from "../common/connection";

const bluetooth = new Bluetooth()

const useConnection = () => {
  const [connectedDevice, setConnectedDevice] = useState(null)
  const [isOpenBle, setIsOpenBle] = useState(false)
  const [devicesList, setDevicesList] = useState([])

  const getBluetoothDevices = async () => {
    // Taro.onBluetoothDeviceFound(res => {
    //   const find = devicesList.find(item => item.deviceId === res.devices[0].deviceId)
    //   //不重复，有名称，就添加到devicesList中
    //   if (res.devices[0].name && !find) {
    //     console.log(find, 13579, res.devices[0]);
    //     setDevicesList((value) => [...value, res.devices[0]])
    //   }
    //   // setDevicesList(res.devices)
    // });

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        Taro.getBluetoothDevices({
          complete(res) {
            common.hideLoading()
            const list = filterPrint(res.devices, [])
            setDevicesList(list)
            Taro.setStorageSync('bluetoothPrintList', list)
            resolve(res)
            if (list.length === 0) {
              common.showModal('没有发现新的设备哦')
            }
          },
          fail: (err) => {
            reject(err)
          }
        })
      }, 3000)
    })
  }

  const openBluetoothAdapter = async (state) => {
    try {
      await bluetooth.openBluetoothAdapter();
      setIsOpenBle(true)
    } catch (err) {
      state.isOpenBle = false
      if (err.errCode) {
        common.showToast(bluetooth.bleerrcode(err.errCode));
      } else if (err.errMsg) {
        common.showToast(err.errMsg);
      } else {
        common.showToast('蓝牙初始化失败');
      }
    }
  }

  // 开启蓝牙搜索
  const start = async () => {
    try {
      common.showLoading('蓝牙设备搜索中')
      if (!isOpenBle) {
        await openBluetoothAdapter()
      }

      await bluetooth.startBluetoothDevicesDiscovery();
      await getBluetoothDevices()
      common.hideLoading()
    } catch (err) {
      if (err.errCode) {
        common.showToast(bluetooth.bleerrcode(err.errCode));
      } else if (err.errMsg) {
        common.showToast(err.errMsg);
      }
    }
  }

  const research = () => {
    setDevicesList([])
    start()
  }

  const connect = async (printDevice) => {
    if (printDevice.deviceId === connectedDevice?.deviceId) {
      return
    }

    common.showLoading('蓝牙连接中')
    if (connectedDevice && printDevice.deviceId !== connectedDevice.deviceId) {
      await closeBLEConnection(connectedDevice.deviceId)
    }

    await createBLEConnection(printDevice)
    const result = await getDeviceServices(printDevice.deviceId, 'write')

    setConnectedDevice(Object.assign(printDevice, result))
    common.hideLoading()
    return Object.assign(printDevice, result)
  }

  const closeConnect = async () => {
    if (!connectedDevice) {
      return
    }

    await closeBLEConnection(connectedDevice?.deviceId)
    setConnectedDevice(null)
    common.showToast('已断开连接', {
      icon: 'success'
    })
  }

  return {
    start,
    connect,
    research,
    closeConnect,
    devicesList,
    connectedDevice
  }
}

export default useConnection
