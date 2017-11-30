import PropTypes from 'prop-types'

export const locationPropTypes = {
  pathname: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired,
  state: PropTypes.any,
  key: PropTypes.string,
}

export const historyPropTypes = {
  length: PropTypes.number.isRequired,
  action: PropTypes.string.isRequired,
  location: PropTypes.shape(locationPropTypes).isRequired,
  index: PropTypes.number,
  entries: PropTypes.arrayOf(PropTypes.shape(locationPropTypes)),
  createHref: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  replace: PropTypes.func.isRequired,
  go: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  canGo: PropTypes.func,
  block: PropTypes.func.isRequired,
  listen: PropTypes.func.isRequired,
}
