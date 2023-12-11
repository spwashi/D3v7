export function runAfterSleep(waitTime, loop) {
  return new Promise((res, rej) => setTimeout(() => loop().then(res).catch(rej), waitTime));
}
export function runThenSleep(waitTime, loop) {
  return new Promise((res, rej) => loop().then(ret => setTimeout(() => res(ret), waitTime)).catch(rej));
}
