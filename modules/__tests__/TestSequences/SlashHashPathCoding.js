import expect from 'expect'
import execSteps from './execSteps'

export default (history, done) => {
  const steps = [
    (location) => {
      expect(location.path).toBe('/')
      expect(window.location.hash).toBe('#/')
      history.push('/home?the=query#the-hash')
    },
    (location) => {
      expect(location.path).toBe('/home?the=query#the-hash')
      expect(window.location.hash).toBe('#/home?the=query#the-hash')
      history.goBack()
    },
    (location) => {
      expect(location.path).toBe('/')
      expect(window.location.hash).toBe('#/')
      history.goForward()
    },
    (location) => {
      expect(location.path).toBe('/home?the=query#the-hash')
      expect(window.location.hash).toBe('#/home?the=query#the-hash')
    }
  ]

  execSteps(steps, history, done)
}
