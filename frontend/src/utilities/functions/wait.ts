
/**
 * Wait for a given amount of time.
 */
export const wait = <T>(ms: number, value: T): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(value), ms));

/**
 * Wait for a given amount of time, but at least the time it takes for the promise to resolve. This is useful for ensuring that a minimum amount of time has passed before a promise resolves such
 * as when displaying a loading spinner. 
 */
export const waitAtleast = <T extends Promise<any>>(ms: number, value: T): Promise<T> => new Promise((resolve, reject) => {
  return setTimeout(async () => {
    const [result] = await Promise.allSettled([
      value,
      wait(ms, undefined)
    ])

    if (result.status === 'fulfilled') {
      return resolve(result.value)
    }

    return reject(result.reason)
  })
})