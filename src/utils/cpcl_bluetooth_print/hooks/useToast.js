import {useState} from "react";
import Taro from "@tarojs/taro";

const useToast = () => {
  const [isShowLoading, setIsShowLoading] = useState(false)

  const showLoading = (title, config = {}) => {
    setIsShowLoading(true)
    Taro.showLoading({
      title,
      mask: true,
      ...config
    })
  }

  const hideLoading = () => {
    Taro.hideLoading()
    setIsShowLoading(false)
  }

  const showToast = (title, config = {}) => {
    Taro.showToast({
      title,
      icon: "none",
      duration: 1500,
      position: 'bottom',
      mask: true,
      ...config
    })
  }

  const showModal = (content, config = {}) => {
    Taro.showModal({
      content,
      ...config
    })
  }

  return {
    isShowLoading,
    showLoading,
    hideLoading,
    showToast,
    showModal
  }
}

export default useToast
