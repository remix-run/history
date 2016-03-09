import expect from 'expect'
import { POP } from '../Actions'
import execSteps from './execSteps'

const describeInitialLocation = (createHistory) => {
  describe('on the initial POP', () => {
    let history, unlisten
    beforeEach(() => {
      history = createHistory()
    })

    afterEach(() => {
      if (unlisten)
        unlisten()
    })

    it('location does not have a key', (done) => {
      const steps = [
        (location) => {
          expect(location.action).toEqual(POP)
          expect(location.key).toNotExist()
        }
      ]

      unlisten = history.listen(execSteps(steps, done))
    })
  })
}

export default describeInitialLocation
