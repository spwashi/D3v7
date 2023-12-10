import {alphaDecay__get}     from "./alphaDecay";
import {alphaTarget__get}    from "./alphaTarget";
import {alpha__get}          from "./alpha";
import {boundingBox__get}    from "./boundingBox";
import {centerStrength__get} from "./centerStrength";
import {center__get}         from "./center";
import {charge__get}         from "./charge";
import {dataindex__get}      from "./dataindex";
import {debug__get}          from "./debug";
import {defaultRadius__get}  from "./defaultRadius";
import {display__get}        from "./display";
import {doFetch__get}        from "./doFetch";
import {fontSize__get}       from "./fontSize";
import {fx__get}             from "./fx";
import {fy__get}             from "./fy";
import {height__get}         from "./height";
import {intent__get}         from "./intent";
import {linkStrength__get}   from "./linkStrength";
import {linkStyle__get}      from "./linkStyle";
import {mode__get}           from "./mode";
import {nodeCount__get}      from "./nodeCount";
import {perspective__get}    from "./perspective";
import {r__get}              from "./r";
import {reset__get}          from "./reset";
import {size__get}           from "./size";
import {superpower__get}     from "./superpower";
import {title__get}          from "./title";
import {velocityDecay__get}  from "./velocityDecay";
import {width__get}          from "./width";
import {zoom__get}           from "./zoom";


export function initParameters() {
  window.spwashi.initialMode                       = window.spwashi.initialMode || null;
  window.spwashi.parameters                        = window.spwashi.parameters || {};
  window.spwashi.values                            = window.spwashi.values || {};
  window.spwashi.values.fy                         = [];
  window.spwashi.values.r                          = [];
  window.spwashi.values.text                       = window.spwashi.values.text || {}
  window.spwashi.values.text.fontSize              = window.spwashi.values.text.fontSize || [];
  window.spwashi.superpower                        = window.spwashi.superpower || {name: 'hyperlink', intent: 1};
  window.spwashi.parameters.links                  = window.spwashi.parameters.links || {};
  window.spwashi.parameters.forces                 = window.spwashi.parameters.forces || {};
  window.spwashi.parameters                        = window.spwashi.parameters || {};
  window.spwashi.parameters.debug                  = false;
  window.spwashi.parameters.perspective            = window.spwashi.parameters.perspective || undefined;
  window.spwashi.parameters.dataIndex              = window.spwashi.parameters.dataIndex || null;
  window.spwashi.parameters.width                  = window.spwashi.parameters.width || window.innerWidth * .9;
  window.spwashi.parameters.height                 = window.spwashi.parameters.height || window.innerHeight * .9;
  window.spwashi.parameters.startPos               = window.spwashi.parameters.startPos || {};
  window.spwashi.parameters.startPos.x             = window.spwashi.parameters.startPos.x || window.spwashi.parameters.width / 2;
  window.spwashi.parameters.startPos.y             = window.spwashi.parameters.startPos.y || window.spwashi.parameters.height / 2;
  window.spwashi.parameters.links                  = window.spwashi.parameters.links || {};
  window.spwashi.parameters.links.strength         = window.spwashi.parameters.links.strength || .1;
  window.spwashi.parameters.nodes                  = window.spwashi.parameters.nodes || {};
  window.spwashi.parameters.nodes.count            = window.spwashi.parameters.nodes.count || 13;
  window.spwashi.parameters.nodes.radiusMultiplier = window.spwashi.parameters.nodes.radiusMultiplier || 30;
  window.spwashi.parameters.forces                 = window.spwashi.parameters.forces || {};
  window.spwashi.parameters.forces.alpha           = window.spwashi.parameters.forces.alpha || 1;
  window.spwashi.parameters.forces.alphaTarget     = window.spwashi.parameters.forces.alphaTarget || .3;
  window.spwashi.parameters.forces.alphaDecay      = window.spwashi.parameters.forces.alphaDecay || .03;
  window.spwashi.parameters.forces.velocityDecay   = window.spwashi.parameters.forces.velocityDecay || .91;
  window.spwashi.parameters.forces.charge          = window.spwashi.parameters.forces.charge || 10;
  window.spwashi.parameters.forces.centerStrength  = window.spwashi.parameters.forces.centerStrength || 1;
  window.spwashi.parameters.forces.boundingBox     = typeof window.spwashi.parameters.forces.boundingBox !== 'undefined' ? window.spwashi.parameters.forces.boundingBox : true;
  window.spwashi.parameters.forces.centerPos       = window.spwashi.parameters.forces.centerPos || {};
  window.spwashi.parameters.forces.centerPos.x     = window.spwashi.parameters.forces.centerPos.x || window.spwashi.parameters.startPos.x;
  window.spwashi.parameters.forces.centerPos.y     = window.spwashi.parameters.forces.centerPos.y || window.spwashi.parameters.startPos.y;
}

export function readParameters(searchParameters) {
  window.spwashi.featuredIdentity = /\/identity\/([a-zA-Z\d]+)/.exec(window.location.href)?.[1] || searchParameters.get('identity');
  window.spwashi.parameterKey     = `spwashi.parameters#${window.spwashi.featuredIdentity}`;

  alphaDecay__get(searchParameters);
  alphaTarget__get(searchParameters);
  alpha__get(searchParameters);
  boundingBox__get(searchParameters);
  centerStrength__get(searchParameters);
  center__get(searchParameters);
  charge__get(searchParameters);
  dataindex__get(searchParameters);
  debug__get(searchParameters);
  defaultRadius__get(searchParameters);
  display__get(searchParameters);
  doFetch__get(searchParameters);
  fontSize__get(searchParameters);
  fx__get(searchParameters);
  fy__get(searchParameters);
  height__get(searchParameters);
  intent__get(searchParameters);
  linkStrength__get(searchParameters);
  linkStyle__get(searchParameters);
  mode__get(searchParameters)
  nodeCount__get(searchParameters);
  perspective__get(searchParameters);
  r__get(searchParameters);
  reset__get(searchParameters);
  size__get(searchParameters);
  superpower__get(searchParameters);
  title__get(searchParameters);
  velocityDecay__get(searchParameters);
  width__get(searchParameters);
  zoom__get(searchParameters);
}