import warning from 'warning'

function extractPath(string, fullUrl = false) {
  const match = string.match(/^https?:\/\/[^\/]*/)

  if (match == null)
    return string

  warning(
    fullUrl,
    'A path must be pathname + search + hash only, not a fully qualified URL like "%s"',
    string
  )

  return string.substring(match[0].length)
}

export default extractPath
