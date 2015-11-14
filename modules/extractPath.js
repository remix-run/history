function extractPath(string) {
  const match = string.match(/^https?:\/\/[^\/]*/)

  if (match == null)
    return string

  return string.substring(match[0].length)
}

export default extractPath
