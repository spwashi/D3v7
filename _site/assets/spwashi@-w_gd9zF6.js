import{a as l,p as w,f as u,m,b as f,c as g,d as y}from"./index-x_8CaSAC.js";l();let n=0;function h(a=1e3,{charge:s=1e3}){const d=(o=()=>{})=>{const t="en-US",r=new Date().toLocaleDateString(t,{weekday:"long"}),e=r.length,i=e;f({id:n,r:5,identity:r.split("")[n%e],collisionRadius:100,text:{fontSize:50,fy:100,color:"white"},fx:n%e/e*window.spwashi.parameters.width+1/(2*e)*window.spwashi.parameters.width,fy:window.spwashi.parameters.height*(n%i/i),y:window.spwashi.parameters.height*(n%i/i),color:"var(--bg-start)"}),w([`charge=${s}`].filter(Boolean).join(`
`)),o(),h(a,{charge:-s}),n+=1};return new Promise((o,t)=>{setTimeout(()=>d(o),a)}).then(()=>{n%6===0&&setTimeout(()=>{u(o=>o.kind!=="__boon"),m(o=>{o.fy=void 0}),w("bonk")},a*6*2/3),n%6===0&&window.spwashi.boon(a/2,6).then(o=>{o.forEach(t=>{t.fy+=50}),window.spwashi.reinit()})})}g["@node"]=(a,s)=>{const c=new Date().getDay();return{...y(a,s),color:`var(--node-color-${c%13})`,callbacks:{ondrag:(d,o)=>{const t=window.spwashi.parameters.width,r=window.spwashi.parameters.height,e=255*(o.x/t),i=255*(o.y/r),p=255*(o.x/t);o.color=`rgb(${e}, ${i}, ${p})`}}}};setTimeout(()=>{w(["box=0"].join(`
`)),h(300,{charge:1e3})},1e3);
//# sourceMappingURL=spwashi@-w_gd9zF6.js.map