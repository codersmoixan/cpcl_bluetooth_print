import { splitTextByWidth } from '../common/common'

class CPCL {
  constructor({ mode = 'CPCL', maxWidth = 540, size = 24, position = 0 } = {}) {
    this.commandMode = mode
    this.position = position
    this.maxWidth = maxWidth
    this.size = size
  }

  init() {
    this.data = ''
    this.command = []

    return this
  }

  addCommand(content) {
    this.command.push(`${content}\r\n`)

    return this
  }

  setBitmap(x, y, res) {
    const w = res.width
    const width = parseInt((((res.width + 7) / 8) * 8) / 8, 10)
    const { height } = res

    const data = `CG ${width} ${height} ${x} ${y}\r\n`
    this.addCommand(data)
    const r = []
    const bits = new Uint8Array(height * width)
    for (y = 0; y < height; y++) {
      for (x = 0; x < w; x++) {
        const color = res.data[(y * w + x) * 4 + 1]
        if (color > 128) {
          // eslint-disable-next-line no-bitwise
          bits[parseInt(y * width + x / 8, 10)] |= 0x80 >> x % 8
        }
      }
    }
    for (let i = 0; i < bits.length; i++) {
      this.command.push(~bits[i] & 0xff)
      r.push(~bits[i] & 0xff)
    }

    return this
  }

  pushCode(content) {
    content.forEach(el => {
      this.command.push(el)
    })

    return this
  }

  setPagePrint() {
    this.addCommand('PRINT')

    return this
  }

  getData(join = true) {
    return join ? this.command.join('') : this.command
  }

  batchAddCommand(content, position, maxWidth) {
    const maxW = maxWidth || this.maxWidth
    const maps = splitTextByWidth(content, maxW, this.size)
    this.position = position

    maps.forEach((item, index) => {
      this.position = position + index * 30
      this.addCommand(`T 6 0 20 ${this.position} ${item}`)
    })

    return this
  }
}

export default CPCL
