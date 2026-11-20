function wheel(R){const o=[];
for(let k=0;k<120;k++){const a=k/120*Math.PI*2;o.push([Math.cos(a)*R,Math.sin(a)*R,1.25,.55]);}
for(let k=0;k<96;k++){const a=k/96*Math.PI*2+.03;o.push([Math.cos(a)*(R-6),Math.sin(a)*(R-6),.9,.3]);}
for(let s=0;s<6;s++){const a=s/6*Math.PI*2+.26,nx=-Math.sin(a),ny=Math.cos(a);
 for(let k=0;k<12;k++){const d=18+k*6.6,si=k%2?3.2:-3.2;o.push([Math.cos(a)*d+nx*si,Math.sin(a)*d+ny*si,2.4,1]);o.push([Math.cos(a)*d-nx*si*1.9,Math.sin(a)*d-ny*si*1.9,.9,.35]);}
 const b=a+Math.PI/6;for(let k=0;k<6;k++){const d=56+k*6.4;o.push([Math.cos(b)*d,Math.sin(b)*d,1.7,.8]);}}
for(let k=0;k<18;k++){const a=k/18*Math.PI*2;o.push([Math.cos(a)*11,Math.sin(a)*11,1.5,.7]);}
o.push([0,0,4.2,1]);
return '<svg viewBox="-104 -104 208 208" width="100%" height="100%">'+o.map(d=>`<circle cx="${d[0].toFixed(2)}" cy="${d[1].toFixed(2)}" r="${d[2]}" fill="#0a0a0a" opacity="${d[3]}"/>`).join('')+'</svg>';}
