import expect from 'expect'
import { POP } from '../Actions'
import execSteps from './execSteps'

const describeInitialLocation = (createHistory) => {
  describe('on the initial POP', () => {
    let history
    beforeEach(() => {
      history = createHistory()
    })

    it('location does not have a key', (done) => {
      const steps = [
        (location) => {
          expect(location.action).toEqual(POP)
          expect(location.key).toNotExist()
        }
      ]

      execSteps(steps, history, done)
    })
  })
}

export default describeInitialLocation
