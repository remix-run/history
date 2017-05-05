import expect from 'expect'
import execSteps from './execSteps'

/**
 * Uses the history object to create an href for a location
 * and to push or replace that location to the history. Expects the "href"
 * part of the resulting window location to match the href created
 * by the history object.
 * 
 * @param { History } history the history object
 * @param { () => Location } getToLocationObj the location to which history will push
 * @param { () => string } getWindowHref get the "href" portion of window's current location
 * @param { () => any } done callback passed to "it" function in test
 * @param { boolean } replaceIt if true, history.replace instead of history.push
 */
export default (history, getToLocationObj, getWindowHref, done, replaceIt) => {
    const href = history.createHref(getToLocationObj())

    const steps = [
        (location) => {
            history[replaceIt ? 'replace' : 'push'](getToLocationObj())
        },
        (location) => {
            const locationHref = getWindowHref()
            expect(locationHref).toEqual(href)
        }
    ]

    execSteps(steps, history, done)
}