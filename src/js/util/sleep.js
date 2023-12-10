export function runAfterSleep(waitTime, loop) {
  return new Promise((res, rej) => setTimeout(() => loop().then(res).catch(rej), waitTime));
}
