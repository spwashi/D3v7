import {runAfterSleep}  from "../../../js/util/sleep";
import {bodyLoop}       from "./body";
import {postLoop}       from "./tail";
import {resolveSubject} from "../state/subject";
import {resolveObject}  from "../state/object";


export async function mainLoop(interval, motion, loopArguments) {
  const subject = resolveSubject();

  const run = async () => {
    const callback = bodyLoop(interval, subject, motion);
    return callback(loopArguments)
  };

  const consequence = await runAfterSleep(interval, run);

  const object  = resolveObject(interval);
  const cleanup = postLoop(object);

  return cleanup(consequence);
}
