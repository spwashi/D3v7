import{f as d,c as u,d as h,e as w,t as f,M as g,S as p,h as v,i as m,j as l,k as O,r as k,l as N,s as y,n as b,o as x}from"./main-TFYKJNo4.js";function A(){return window.spwashi.links}const S=()=>{const e=document.querySelector("#focal-square"),t=e.dataset.focalStatus!=="active"?"active":"inactive";e.disabled=t==="inactive",e.dataset.focalStatus=t};function I(){window.spwashi.clearCachedNodes()}function M(){d(e=>{e.fx=void 0,e.fy=void 0})}function D(){d(e=>{e.fx=e.x,e.fy=e.y})}function P(){const e=window.spwashi.parameters.nodes.count;u(e),window.spwashi.reinit()}function T(){window.spwashi.parameters.forces.velocityDecay=window.spwashi.parameters.forces.velocityDecay===.1?.9:.1,window.spwashi.reinit()}function _(){h()}function E(e){return`${window.location.href.split("?")[0]}?${e.toString()}`}function L(){window.localStorage.clear();const e=w();window.location.href=E(e)}function U(){f([g,window.spwashi.minimalism?v:p])}const C=[{revealOrder:0,shortcut:"ArrowUp",categories:["nodes"],shortcutName:"↑",title:"more",callback:_},{revealOrder:0,shortcut:"[",categories:["this"],title:"toggle main menu",callback:()=>{U()}},{revealOrder:0,shortcut:"]",categories:["this"],title:"toggle focal point",callback:S},{revealOrder:1,shortcut:"/",categories:["this"],title:"toggle hotkey menu",callback:()=>m()},{revealOrder:0,shortcut:"y",categories:["this"],title:"yoink",callback:()=>{const e=l(),i=A();e.forEach(t=>{t.fx=void 0,t.fy=void 0}),window.spwashi.simulation.force("center",null),window.spwashi.simulation.force("charge",null),window.spwashi.simulation.force("link",null),window.spwashi.simulation.force("collide",null),window.spwashi.simulation.force("center",t=>{const s=l(),r=s.length;let c=0,n=0;for(let a=0;a<r;++a)c+=s[a].x,n+=s[a].y;c/=r,n/=r;for(let a=0;a<r;++a){const o=s[a];o.x-=c,o.y-=n,(o.x<10||o.y<10)&&(o.r=10)}}),window.navigator.clipboard.writeText(JSON.stringify({nodes:e.map(t=>O(t)),links:i})),setTimeout(()=>{k(),N(),window.spwashi.reinit()},300),y("")}},{revealOrder:1,shortcut:"<space>"},{revealOrder:1,shortcut:";",categories:["forces","velocity decay"],shortcutName:";",title:"bonk",callback:T},{revealOrder:1,shortcut:"<space>"},{revealOrder:1,shortcut:".",categories:["nodes"],title:"fix position",callback:D},{revealOrder:1,shortcut:",",categories:["nodes"],title:"unfix position",callback:M},{revealOrder:1,shortcut:"<space>"},{revealOrder:1,shortcut:"k",categories:["data"],title:"clear nodes",callback:b},{revealOrder:1,shortcut:"-",categories:["data","cache"],title:"clear node cache",callback:I},{revealOrder:0,shortcut:"s",categories:["nodes"],title:"save",callback:x},{revealOrder:1,shortcut:"<space>"},{revealOrder:1,shortcut:"ArrowDown",categories:["nodes"],shortcutName:"↓",title:"fewer",callback:P},{revealOrder:1,shortcut:"<space>"},{revealOrder:1,shortcut:"\\",categories:["data","cache"],title:"reset interface",callback:L}];export{C as initialKeyStrokeOptions};
//# sourceMappingURL=keystrokes-wwv2Z17x.js.map