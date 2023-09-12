import Taro from "@tarojs/taro";
import base64 from '../package/base64gb2312'

const common = {
	isShowLoading: false,
	showLoading(title, config) {
		common.isShowLoading = true
    Taro.showLoading({
      title,
      mask: true,
      ...config
    })
	},
	hideLoading() {
    Taro.hideLoading()
    common.isShowLoading = false
	},
	showToast(title, config = {}) {
    Taro.showToast({
      title,
      icon: "none",
      duration: 1500,
      position: 'bottom',
      mask: true,
      ...config
    })
	},
	showModal(content, config) {
    Taro.showModal({
      content,
      ...config
    })
	}
}

export default common

/**
 * 将CPCL指令转换成buff然后进行分包发送给打印机
 * @param {String} t cpcl指令
 * uni的app端不知道为啥在此无法使用转换，用uni.base64ToArrayBuffer还是我自己封装的都是无法转换，小程序就正常
 * 目前研究的结果就是app端将ArrayBuffer转换成了object类型，而且小程序是ArrayBuffer的string写入的
 */
export const tfmbuffer = (t) => {
  let a = []
  for (let n = 0; n < Math.ceil(t.length / 10); n++) {
    a[n] = base64.base64ToArrayBuffer(base64.encode64gb2312(t.substr(n * 10, 10)));
  }
  return a;
}

export const filterPrint = (list, storageList) => {
  const queue = []
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < list.length; i++) {
    // const base64 = Taro.arrayBufferToBase64(list[i].advertisData)
    const str = Array.prototype.map
      .call(new Uint8Array(list[i].advertisData), x => `00${x.toString(16)}`.slice(-2))
      .join('')

    if (str.length === 16) {
      let has = false
      // eslint-disable-next-line no-plusplus
      for (let j = 0; j < storageList.length; j++) {
        if (storageList[j].deviceId === list[i].deviceId) {
          has = true
          break
        }
      }
      if (!has) {
        // eslint-disable-next-line no-param-reassign
        list[i].address = str.toUpperCase()
        queue.push(list[i])
      }
    }
  }

  return queue
}

export const splitTextByWidth = (text, maxWidth, charWidth) => {
  const result = []
  let start = 0
  let lineWidth = 0
  while (start < text.length) {
    let end = start + 1
    while (end <= text.length) {
      const char = text.charAt(end - 1)
      const charWidthPx = charWidth * (char === ' ' ? 1.5 : 1) // 空格需要加上额外宽度
      if (lineWidth + charWidthPx > maxWidth) {
        result.push(text.slice(start, end - 1)) // 将上一个子字符串保存到结果中
        start = end - 1 // 更新起始位置
        lineWidth = 0
        break
      }
      lineWidth += charWidthPx
      // eslint-disable-next-line no-plusplus
      end++
    }
    if (end > text.length) {
      result.push(text.slice(start)) // 将最后一个子字符串保存到结果中
      break
    }
  }
  return result
}
