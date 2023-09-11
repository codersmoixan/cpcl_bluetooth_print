const path = require('path')

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  context: path.resolve(__dirname, './'),
  resolve: {
    extensions: ['.js', '.vue', '.json', '.jsx', 'scss'],
    alias: {
      '@': resolve('src'),
      components: resolve('src/components'),
      utils: resolve('src/utils'),
      fonts: resolve('src/fonts'),
      pages: resolve('src/pages'),
    },
  },
}
