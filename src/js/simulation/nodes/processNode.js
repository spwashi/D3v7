import md5                      from "md5";
import {getDocumentDataIndex}   from "../../modes/mode-dataindex";
import {getNextUrlSearchParams} from "../../init/keystrokes";

function getLastKind(node) {
  return node.kind?.trim().split(' + ').reverse()[0];
}

function getFirstKind(node) {
  return node.kind?.split(' + ')[0];
}

function isOperator(node) {
  return node.kind.split(' + ').includes('operator');
}

export function processNode(node, i) {
  node.getUrl = () => {
    const urlParams = getNextUrlSearchParams();
    urlParams.set('title', node.identity);
    urlParams.set('superpower', 'hyperlink');
    return `/identity/${node.md5}?${urlParams.toString()}`;
  };

  if (node.processed) return node;
  node.processed = Date.now();
  if (!node.identity) return node;
  const head = node.head;
  const body = node.body;
  const tail = node.tail;
  delete node.head;
  delete node.body;
  delete node.tail;
  node.parts = {head, body, tail};

  const fx       = window.spwashi.values.fx?.[i] || node.fx || undefined;
  const fy       = window.spwashi.values.fy?.[i] || node.fy || undefined;
  const r        = window.spwashi.values.r?.[i] || node.r || window.spwashi.parameters.nodes.radiusMultiplier || undefined;
  const fontSize = window.spwashi.values.text?.fontSize?.[i] || node.text?.fontSize || undefined;

  node.colorindex    = getDocumentDataIndex();
  node.fx            = fx;
  node.fy            = fy;
  node.r             = r;
  node.cr            = r * 2;
  node.text          = node.text || {};
  node.text.fontSize = fontSize;
  node.image         = node.image || {};
  node.image.r       = 100;
  node.image.offsetX = 0;
  node.image.offsetY = 0;
  node.md5           = node.identity && md5(node.identity);

  const edgeLeft   = 50;
  const edgeRight  = window.spwashi.parameters.width - 50;
  const edgeBottom = window.spwashi.parameters.height - 50;
  const quantY     = [50, 50 + edgeBottom / 4, 50 + edgeBottom / 2, 50 + 3 * edgeBottom / 4, edgeBottom];
  const quantX     = [50, 50 + edgeRight / 4, 50 + edgeRight / 2, 50 + 3 * edgeRight / 4, edgeRight];

  const close_container_0 = 'conceptual.close';
  const open_container_0  = 'conceptual.open';
  const close_container_1 = 'essential.close';
  const open_container_1  = 'essential.open';
  const open_container_2  = 'structural.open';
  const close_container_2 = 'structural.close';
  const open_container_3  = 'locational.open';
  const close_container_3 = 'locational.close';

  const rules = [
    [node => getFirstKind(node) === 'container', {text: {fontSize: 10}, fx: window.spwashi.parameters.width / 2, y: 0}],

    [node => getLastKind(node) === 'nominal', {fx: undefined, r: 10}],

    [node => getLastKind(node) === 'phrasal', {fx: undefined}],

    [node => getLastKind(node) === 'binding', {fx: 100, r: 5}],

    [node => getLastKind(node) === 'ordinal', {r: 5}],
    // [node => getLastKind(node) === 'ordinal' && isOperator(node), {fx: 0, fy: 0}],

    [node => getLastKind(node) === close_container_0 && isOperator(node), {r: 10, fx: edgeRight, fy: quantY[0]}],
    [node => getLastKind(node) === close_container_1 && isOperator(node), {r: 10, fx: edgeRight, fy: quantY[1]}],
    [node => getLastKind(node) === close_container_2 && isOperator(node), {r: 10, fx: edgeRight, fy: quantY[2]}],
    [node => getLastKind(node) === close_container_3 && isOperator(node), {r: 10, fx: edgeRight, fy: quantY[3]}],
    [node => getLastKind(node) === open_container_0 && isOperator(node), {r: 10, fx: edgeLeft, fy: quantY[0]}],
    [node => getLastKind(node) === open_container_1 && isOperator(node), {r: 10, fx: edgeLeft, fy: quantY[1]}],
    [node => getLastKind(node) === open_container_2 && isOperator(node), {r: 10, fx: edgeLeft, fy: quantY[2]}],
    [node => getLastKind(node) === open_container_3 && isOperator(node), {r: 10, fx: edgeLeft, fy: quantY[3]}],
  ]

  rules.forEach(([condition, rule]) => {
    if (condition(node)) {
      Object.entries(rule).forEach(([key, value]) => {
        node[key] = value;
      })
    }
  })
  return node;
}
