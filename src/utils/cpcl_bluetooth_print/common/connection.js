import common from "./common";
import Bluetooth from "./bluetooth";

const bluetooth = new Bluetooth()

export const createBLEConnection = (device = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      await bluetooth.createBLEConnection(device.deviceId);
      common.showToast(`${device.name}连接成功`);
      resolve(true)
    } catch (err) {
      if (err.errCode) {
        common.showToast(`${device.name}连接失败：` + bluetooth.bleerrcode(err.errCode));
      } else if (err.errMsg) {
        common.showToast(`${device.name}连接失败：` + err.errMsg);
      } else {
        common.showToast(`${device.name}连接失败：`);
      }
      reject(err)
    }
  })
}

/**
 * 断开蓝牙
 * @param {String} deviceId 蓝牙设备 id
 */
export const closeBLEConnection = async (deviceId) => {
  const result = await bluetooth.closeBLEConnection(deviceId);

  return result
}

export const getDeviceServices = (deviceId, properti = 'write') => {
  return new Promise(async (resolve, reject) => {
    try {
      const services = await bluetooth.getBLEDeviceServices(deviceId)

      if (services.length > 0) {
        for (let i = 0; i < services.length; i++) {
          if (services[i].isPrimary) {
            let res = await bluetooth.getBLEDeviceCharacteristics(deviceId, services[i].uuid)
            if (res.length > 0) {
              for (var s = 0; s < res.length; s++) {
                if (res[s].properties[properti]) {
                  return resolve({
                    characteristicId: res[s].uuid,
                    serviceId: services[i].uuid
                  })
                }
              }
            }
          }
        }
        common.showToast(`该设备无${properti}权限，可能无法使用该功能`);
        closeBLEConnection(deviceId)
        reject({
          errMsg: `该设备无${properti}权限，可能无法使用该功能`
        })
      } else {
        common.showToast(`获取设备服务失败`);
        closeBLEConnection(deviceId)
        reject({
          errMsg: '获取设备服务失败'
        })
      }
    } catch (err) {
      if (err.errCode) {
        common.showToast(bluetooth.bleerrcode(err.errCode));
      } else if (err.errMsg) {
        common.showToast(err.errMsg);
      }
      closeBLEConnection(deviceId)
      reject(err)
    }
  })
}
