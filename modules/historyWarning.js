import warning from 'warning'

const historyWarning = (condition, message, ...args) => {
  warning(condition, `[history] ${message}`, ...args)
}

export default historyWarning
