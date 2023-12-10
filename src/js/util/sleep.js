export function sleepFn(waitTime, loop, params = {}) {
  return new Promise((res, rej) => setTimeout(() => loop(params).then(res).catch(rej), waitTime));
}
