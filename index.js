const app = require('./app')
const config = require('./utils/config')
console.log(config.PORT)
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})