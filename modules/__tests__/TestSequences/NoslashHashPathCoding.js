import expect from 'expect'
import execSteps from './execSteps'

export default (history, done) => {
  const steps = [
    (location) => {
      expect(location.path).toBe('/')
      // IE 10+ gives us "#", everyone else gives us ""
      expect(window.location.hash).toMatch(/^#?$/)
      history.push('/home?the=query#the-hash')
    },
    (location) => {
      expect(location.path).toBe('/home?the=query#the-hash')
      expect(window.location.hash).toBe('#home?the=query#the-hash')
      history.goBack()
    },
    (location) => {
      expect(location.path).toBe('/')
      // IE 10+ gives us "#", everyone else gives us ""
      expect(window.location.hash).toMatch(/^#?$/)
      history.goForward()
    },
    (location) => {
      expect(location.path).toBe('/home?the=query#the-hash')
      expect(window.location.hash).toBe('#home?the=query#the-hash')
    }
  ]

  execSteps(steps, history, done)
}
