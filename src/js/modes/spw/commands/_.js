import {runHelpCommand}                                  from "./help";
import {runHomeCommand}                                  from "./home";
import {runDemoCommand}                                  from "./demo";
import {runAllCommand}                                   from "./all";
import {runClickedCommand}                               from "./clicked";
import {runSaveCommand}                                  from "./save";
import {runUnfreezeCommand}                              from "./unfreeze";
import {runFreezeCommand}                                from "./freeze";
import {runClusterCommand}                               from "./cluster";
import {runMinimalismCommand}                            from "./minimalism";
import {runScatterCommand}                               from "./scatter";
import {runLinkCommand}                                  from "./link";
import {runBoneCommand}                                  from "./bone";
import {runBoonCommand}                                  from "./boon";
import {runHonkCommand}                                  from "./honk";
import {runBonkCommand}                                  from "./bonk";
import {runDisplayNodesCommand}                          from "./display-nodes";
import {runClearPageImageCommand}                        from "./clear-page-image";
import {runClearCommand}                                 from "./clear";
import {moreMenuOptionsSpell, runMoreMenuOptionsCommand} from "./extended-menu";
import {runForcesCommand}                                from "./forces";
import {runCollisionRadiusCommand}                       from "./collision-radius";
import {runSpwashiCommand}                               from "./spwashi";
import {runScaleCommand}                                 from "./scale";
import {runArrangeCommand}                               from "./arrange";

export const commands = {
  'home':  () => runHomeCommand(),
  'clear': () => runClearCommand(),
  'save':  () => runSaveCommand(),
  'help':  sideEffects => runHelpCommand(sideEffects),

  'spwashi':  sideEffects => runSpwashiCommand(sideEffects),
  'color':    sideEffects => runScaleCommand(sideEffects),
  'freeze':   () => runFreezeCommand(),
  'unfreeze': () => runUnfreezeCommand(),
  'unfix':    () => runUnfreezeCommand(),
  'forces':   sideEffects => runForcesCommand(sideEffects),
  'cr':       sideEffects => runCollisionRadiusCommand(sideEffects),

  'all':     sideEffects => runAllCommand(sideEffects),
  'clicked': sideEffects => runClickedCommand(sideEffects),
  'cluster': sideEffects => runClusterCommand(sideEffects),
  'scatter': sideEffects => runScatterCommand(sideEffects),
  'arrange': sideEffects => runArrangeCommand(sideEffects),

  'demo':       sideEffects => runDemoCommand(sideEffects),
  'minimalism': () => runMinimalismCommand(),

  'link': sideEffects => runLinkCommand(sideEffects),

  'boon': () => runBoonCommand(),
  'bone': () => runBoneCommand(),
  'honk': () => runHonkCommand(),
  'bonk': () => runBonkCommand(),

  // not convinced these are useful
  'display=nodes':        () => runDisplayNodesCommand(),
  'clear page image':     () => runClearPageImageCommand(),
  [moreMenuOptionsSpell]: () => runMoreMenuOptionsCommand(),
  'options':              sideEffects => {
    sideEffects.valueStrings.push(...Object.keys(commands).filter(key => ![
      'options',
      'clear',
      'save',
      'home',
      'help',
    ].includes(key)).map(key => key + '\n'));
    sideEffects.nextDocumentMode = 'spw';
  }
};