// 3D desk scene (three.js r128, framework-free). React mounts it in <DeskCanvas />.
import * as THREE from 'three';
import { DATA } from './data';
import heroUrl from './assets/hero.jpg';
import wallUrl from './assets/wall.jpg';

export function createDesk({ canvas, stage, onPick }) {
  var alive = true, raf = 0;
  var dark = true; // the room is always a dark hacker den
    var renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.shadowMap.enabled = true;
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(dark?0x0b0806:0xe9ddcb);
    scene.fog = new THREE.Fog(scene.background.getHex(),20,50);
    var camera = new THREE.PerspectiveCamera(40,1,.1,100);
    scene.add(new THREE.HemisphereLight(0xfff1dc,0x4a382a,dark?.5:.85));
    var rim=new THREE.DirectionalLight(0xd9a46b,dark?.5:.25);rim.position.set(-5,4,-4);scene.add(rim);
    var sun = new THREE.DirectionalLight(0xfff0d8,dark?.65:.95);
    sun.position.set(5,8,4); sun.castShadow = true; sun.shadow.mapSize.set(2048,2048);
    var sc = sun.shadow.camera; sc.left=-11; sc.right=11; sc.top=11; sc.bottom=-11; scene.add(sun);

    function mat(c){return new THREE.MeshStandardMaterial({color:c,flatShading:true,roughness:.8})}
    function box(w,h,d,c,x,y,z,p){var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;(p||scene).add(m);return m}
    var floor = new THREE.Mesh(new THREE.CircleGeometry(16,48),mat(dark?0x140e09:0xcdb99d));
    floor.rotation.x=-Math.PI/2; floor.receiveShadow=true; scene.add(floor);
    function woodTex(){var cv=document.createElement('canvas');cv.width=512;cv.height=256;var g=cv.getContext('2d');g.fillStyle='#9c6b43';g.fillRect(0,0,512,256);for(var i=0;i<90;i++){g.strokeStyle='rgba('+(60+Math.random()*40|0)+',30,10,'+(.05+Math.random()*.12)+')';g.lineWidth=1+Math.random()*2;g.beginPath();var y=Math.random()*256;g.moveTo(0,y);g.bezierCurveTo(150,y+Math.random()*14-7,350,y+Math.random()*14-7,512,y+Math.random()*10-5);g.stroke()}return new THREE.CanvasTexture(cv)}
    var top=new THREE.Mesh(new THREE.BoxGeometry(5,.2,2.6),new THREE.MeshStandardMaterial({map:woodTex(),roughness:.55}));top.position.set(0,1.4,0);top.castShadow=top.receiveShadow=true;scene.add(top);
    box(4.9,.1,2.5,0x2a1a10,0,1.25,0);
    // rug, wall, skirting
    var rug=new THREE.Mesh(new THREE.CylinderGeometry(3.7,3.7,.03,48),mat(dark?0x2a1c13:0x8b6a4c));rug.position.y=.015;rug.receiveShadow=true;scene.add(rug);
    var rug2=new THREE.Mesh(new THREE.CylinderGeometry(3.2,3.2,.035,48),mat(dark?0x1d130d:0xb08a66));rug2.position.y=.017;rug2.receiveShadow=true;scene.add(rug2);
    var wallM=box(34,10,.2,0xffffff,0,4.3,-2.5);
    (function(){var cv=document.createElement('canvas');cv.width=512;cv.height=256;var g=cv.getContext('2d');g.fillStyle='#0b0705';g.fillRect(0,0,512,256);
      for(var r=0;r<8;r++){for(var c=-1;c<9;c++){var sh=Math.floor(Math.random()*16);g.fillStyle='rgb('+(40+sh)+','+(26+sh)+','+(20+sh)+')';g.fillRect(c*64+(r%2?32:0)+2,r*32+2,60,28)}}
      var tx=new THREE.CanvasTexture(cv);tx.wrapS=tx.wrapT=THREE.RepeatWrapping;tx.repeat.set(8,5);wallM.material=new THREE.MeshStandardMaterial({map:tx,roughness:.95})})();
    box(34,.35,.24,dark?0x0d0805:0x7a5a40,0,.18,-2.48);
    // framed portrait on the wall
    box(1.15,1.4,.08,0x1a120d,0,4.1,-2.36);
    var pm=new THREE.Mesh(new THREE.PlaneGeometry(.95,1.19),new THREE.MeshBasicMaterial({color:0x2a1a10}));pm.position.set(0,4.1,-2.31);scene.add(pm);
    new THREE.TextureLoader().load(heroUrl,function(t){pm.material.map=t;pm.material.color.setHex(0xffffff);pm.material.needsUpdate=true});
    function hang(x,y,w,h,src,cv){
      box(w+.2,h+.2,.08,0x1a120d,x,y,-2.36);
      var m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:0x2a1a10}));m.position.set(x,y,-2.31);scene.add(m);
      if(cv){m.material.map=new THREE.CanvasTexture(cv);m.material.color.setHex(0xffffff)}
      else new THREE.TextureLoader().load(src,function(tx){m.material.map=tx;m.material.color.setHex(0xffffff);m.material.needsUpdate=true});
    }
    function art(w,h,kind){
      var cv=document.createElement('canvas');cv.width=w;cv.height=h;var g=cv.getContext('2d');
      var gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,'#2a1a10');gr.addColorStop(1,'#8a5a35');g.fillStyle=gr;g.fillRect(0,0,w,h);
      if(kind===0){for(var i=0;i<14;i++){g.strokeStyle='rgba(239,227,208,'+(.08+i*.02)+')';g.lineWidth=2;g.beginPath();g.arc(w*.7,h*1.1,40+i*26,Math.PI,2*Math.PI);g.stroke()}g.fillStyle='#d9a46b';g.beginPath();g.arc(w*.7,h*.62,34,0,6.28);g.fill()}
      else if(kind===1){g.fillStyle='#d9a46b';for(var r=0;r<6;r++)for(var c=0;c<8;c++){if((r*7+c*3)%4<2)g.fillRect(20+c*(w-40)/8,20+r*(h-40)/6,(w-40)/8-8,(h-40)/6-8)}}
      else{g.strokeStyle='#efe3d0';g.lineWidth=3;for(var j=0;j<9;j++){g.beginPath();g.moveTo(0,h*(j+1)/10);g.bezierCurveTo(w*.3,h*(j/10),w*.6,h*((j+2)/10),w,h*(j+1)/10);g.stroke()}}
      return cv;
    }
    hang(-1.9,4.05,.9,1.36,wallUrl);
    hang(1.95,4.25,1.4,1.05,null,art(420,315,0));
    hang(3.35,4.45,.6,.6,null,art(240,240,1));
    hang(3.35,3.55,.6,.6,null,art(240,240,2));
    // desk mat, keyboard, mouse, books
    box(2.1,.02,.95,0x1b1410,-.55,1.51,.45);
    box(1.1,.05,.34,0x2d2520,-.95,1.55,.5);
    for(var kr=0;kr<3;kr++)box(1,.012,.07,0x4a3d33,-.95,1.585,.4+kr*.09);
    box(.12,.05,.2,0x2d2520,-.2,1.55,.5);
    box(.7,.12,.5,0x8a5a35,-1.9,1.56,-.7);
    box(.62,.1,.46,0xe8d3b0,-1.9,1.67,-.7).rotation.y=.12;
    box(.55,.09,.4,0x3a2418,-1.9,1.76,-.7).rotation.y=-.1;
    // drawer unit
    box(1.1,1.1,2,0x3a2418,1.55,.6,0);
    for(var dr=0;dr<3;dr++){box(.96,.3,.04,0x5a3b27,1.55,.25+dr*.38,1.02);box(.16,.04,.05,0xd9a46b,1.55,.25+dr*.38,1.06)}
    // coffee steam
    var steam=[0,1,2].map(function(i){var m=new THREE.Mesh(new THREE.SphereGeometry(.05,8,8),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0}));m.userData.o=i/3;scene.add(m);return m});
    [[-2.3,-1.1],[2.3,-1.1],[-2.3,1.1],[2.3,1.1]].forEach(function(p){box(.12,1.3,.12,0x15100c,p[0],.65,p[1])});

    function screenTex(w,h,lines){
      var cv=document.createElement('canvas');cv.width=w;cv.height=h;var g=cv.getContext('2d');
      g.fillStyle='#0b0806';g.fillRect(0,0,w,h);
      g.font='bold '+Math.round(h/11)+'px monospace';
      lines.forEach(function(l,i){g.fillStyle=i%2?'#e8d3b0':'#d9a46b';g.fillText(l,18,38+i*h/9)});
      return new THREE.CanvasTexture(cv);
    }
    var clickable=[];
    function tag(obj,sec){obj.userData.section=sec;clickable.push(obj)}

    var mon=new THREE.Group();mon.position.set(-.9,1.5,-.6);scene.add(mon);
    box(.7,.08,.5,0x2c3a45,0,0,0,mon);box(.12,.7,.12,0x2c3a45,0,.38,-.1,mon);
    (function(){
      var R=3.4,hb=.34,hs=.31,H=1.3;           // curve radius, bezel / screen half-angles, height
      var sh=new THREE.Shape();
      sh.absarc(0,-R,R+.12,Math.PI/2-hb,Math.PI/2+hb,false);
      sh.absarc(0,-R,R,Math.PI/2+hb,Math.PI/2-hb,true);
      var bg=new THREE.ExtrudeGeometry(sh,{depth:H,bevelEnabled:false,curveSegments:28});
      bg.rotateX(-Math.PI/2);bg.translate(0,-H/2,0);
      var body=new THREE.Mesh(bg,new THREE.MeshStandardMaterial({color:0x1d2a34,roughness:.5,metalness:.3}));
      body.position.set(0,1.15,0);body.castShadow=true;mon.add(body);tag(body,'projects');
      var tx=screenTex(512,300,['// projects'].concat(DATA.projects.slice(0,5).map(function(p){return '> '+p.title.slice(0,24)})));
      tx.wrapS=THREE.RepeatWrapping;tx.repeat.x=-1;tx.offset.x=1;
      var s1=new THREE.Mesh(new THREE.CylinderGeometry(R-.02,R-.02,H-.16,32,1,true,Math.PI-hs,hs*2),new THREE.MeshBasicMaterial({map:tx,side:THREE.BackSide}));
      s1.position.set(0,1.15,R);mon.add(s1);tag(s1,'projects');
    })();

    var lap=new THREE.Group();lap.position.set(1.2,1.5,.35);lap.rotation.y=-.35;scene.add(lap);
    tag(box(1.3,.06,.9,0xaab4bc,0,.03,0,lap),'skills');
    var lid=new THREE.Group();lid.position.set(0,.06,-.43);lid.rotation.x=-.25;lap.add(lid);
    tag(box(1.3,.85,.05,0xaab4bc,0,.42,0,lid),'skills');
    var s2=new THREE.Mesh(new THREE.PlaneGeometry(1.18,.72),new THREE.MeshBasicMaterial({map:screenTex(384,250,['// skills'].concat(DATA.skills.slice(0,5).map(function(s){return '+ '+s.slice(0,18)})))}));
    s2.position.set(0,.43,.03);lid.add(s2);tag(s2,'skills');

    var mug=new THREE.Mesh(new THREE.CylinderGeometry(.14,.12,.24,8),mat(0xa0522d));
    mug.position.set(.2,1.62,.7);mug.castShadow=true;scene.add(mug);tag(mug,'about');
    var lamp=new THREE.Group();lamp.position.set(2,1.5,-.8);scene.add(lamp);
    tag(box(.4,.05,.4,0x2c3a45,0,0,0,lamp),'contact');
    var arm=box(.05,.9,.05,0x2c3a45,0,.45,0,lamp);arm.rotation.z=.2;tag(arm,'contact');
    var shade=new THREE.Mesh(new THREE.ConeGeometry(.28,.3,6),mat(0xf5c26b));
    shade.position.set(-.15,.95,0);shade.rotation.z=.5;lamp.add(shade);tag(shade,'contact');var lampL=new THREE.PointLight(0xffc36b,0,7);lampL.position.set(-.3,.9,.2);lamp.add(lampL);
    var pot=new THREE.Mesh(new THREE.CylinderGeometry(.2,.15,.28,7),mat(0xc9805a));pot.position.set(-2,1.64,.7);scene.add(pot);
    var lv=new THREE.Mesh(new THREE.IcosahedronGeometry(.3,0),mat(0x3fa66a));lv.position.set(-2,2,.7);scene.add(lv);

    var floaters=[];
    [[new THREE.OctahedronGeometry(.28),0xd9a46b,-2.6,3.4,-1],[new THREE.TorusKnotGeometry(.2,.07,48,8),0xe8d3b0,2.4,3.6,0],
     [new THREE.IcosahedronGeometry(.25,0),0x8a5a35,-3.3,4.3,-1.4],[new THREE.TetrahedronGeometry(.3),0xc98b5a,-.8,3.2,1.4]].forEach(function(d,i){
      var m=new THREE.Mesh(d[0],mat(d[1]));m.position.set(d[2],d[3],d[4]);m.userData.y=d[3];m.userData.o=i*1.7;scene.add(m);floaters.push(m)});

    // ===== room decor: fills the left and right sides of the room =====
    var tickers=[], seed=7;
    function rnd(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646}
    function place(g,x,y,z,ry){g.position.set(x,y,z);if(ry)g.rotation.y=ry;scene.add(g);return g}
    function cyl(rt,rb,h,c,x,y,z,p,seg){var m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||8),mat(c));m.position.set(x,y,z);m.castShadow=true;(p||scene).add(m);return m}
    function blob(r,c,x,y,z,p){var m=new THREE.Mesh(new THREE.IcosahedronGeometry(r,0),mat(c));m.position.set(x,y,z);m.castShadow=true;(p||scene).add(m);return m}
    function plant(x,z,h,k){
      var g=new THREE.Group(),stems=[];
      cyl(.42*k,.32*k,.7*k,0xc9805a,0,.35*k,0,g,7);
      for(var j=0;j<5;j++){
        var a=j/5*6.283,len=h*(.7+rnd()*.5),st=new THREE.Group();
        st.position.set(0,.7*k,0);st.userData.bx=Math.sin(a)*.35;st.userData.bz=Math.cos(a)*.35;
        st.rotation.set(st.userData.bx,0,st.userData.bz);g.add(st);
        cyl(.03,.04,len,0x3f7a4a,0,len/2,0,st,5);
        blob(.28*k+rnd()*.1,j%2?0x3fa66a:0x2f8a58,0,len,0,st);
        stems.push(st);
      }
      place(g,x,0,z);
      tickers.push(function(t){if(reduce)return;stems.forEach(function(s,j){s.rotation.x=s.userData.bx+Math.sin(t*.8+j)*.05;s.rotation.z=s.userData.bz+Math.cos(t*.7+j)*.05})});
    }

    // LEFT: bookshelf, floor lamp, big plant
    (function(){
      var g=new THREE.Group(),W=2.6,H=2.7,D=.7,wood=0x4a2e1d,ch=(H-.15)/3;
      box(.12,H,D,wood,-W/2,H/2,0,g);box(.12,H,D,wood,W/2,H/2,0,g);
      box(W,.1,D,wood,0,H,0,g);box(W,.1,D,wood,0,.05,0,g);
      box(W,H,.06,0x2a1a10,0,H/2,-D/2+.03,g);
      var cols=[0x8a5a35,0xe8d3b0,0x3a2418,0xc98b5a,0xd9a46b,0x6b4a33,0xa0522d,0x15100c];
      for(var s=0;s<3;s++){
        if(s>0)box(W,.07,D,wood,0,.05+s*ch,0,g);
        var x=-W/2+.12,base=.05+s*ch+.05;
        while(true){
          var w=.1+rnd()*.12,h=.5+rnd()*(ch-.65);
          if(x+w>W/2-.1)break;
          var b=box(w,h,.5,cols[Math.floor(rnd()*cols.length)],x+w/2,base+h/2,.02,g);
          b.rotation.z=rnd()<.12?.12:0;x+=w+.01;
        }
      }
      place(g,-5.5,0,-1.9);
    })();
    (function(){
      var g=new THREE.Group();
      cyl(.35,.4,.06,0x15100c,0,.03,0,g,16);cyl(.03,.03,3.1,0x15100c,0,1.6,0,g,8);
      var sh=new THREE.Mesh(new THREE.CylinderGeometry(.32,.5,.55,10,1,true),new THREE.MeshStandardMaterial({color:0xf5c26b,emissive:0x9a6a22,flatShading:true,side:THREE.DoubleSide}));
      sh.position.set(0,3.25,0);g.add(sh);
      var L=new THREE.PointLight(0xffc36b,dark?1.2:.5,10);L.position.set(0,3.1,0);g.add(L);
      place(g,-3.2,0,-1.2);
    })();

    // RIGHT: window with light beam, server rack, crates, tall plant
    (function(){
      var g=new THREE.Group();
      box(1.9,2.7,.1,0x2a1a10,0,0,0,g);
      var gl=new THREE.Mesh(new THREE.PlaneGeometry(1.6,2.4),new THREE.MeshBasicMaterial({color:0xfff0cf}));gl.position.z=.06;g.add(gl);
      box(.06,2.4,.04,0x2a1a10,0,0,.08,g);box(1.6,.06,.04,0x2a1a10,0,0,.08,g);
      box(2.1,.1,.3,0x3a2418,0,-1.4,.1,g);
      place(g,5.3,3.5,-2.32);
      // soft light shaft from the window down to the floor
      var cv=document.createElement('canvas');cv.width=8;cv.height=128;var c2=cv.getContext('2d');
      var gr=c2.createLinearGradient(0,0,0,128);gr.addColorStop(0,'rgba(255,236,190,.5)');gr.addColorStop(1,'rgba(255,236,190,0)');
      c2.fillStyle=gr;c2.fillRect(0,0,8,128);
      var sg=new THREE.PlaneGeometry(1,1),pa=sg.attributes.position;
      pa.setXYZ(0,4.5,4.85,-2.3);pa.setXYZ(1,6.1,4.85,-2.3);pa.setXYZ(2,1.8,.02,.9);pa.setXYZ(3,3.5,.02,.9);
      var sm=new THREE.Mesh(sg,new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));
      scene.add(sm);
      tickers.push(function(t){sm.material.opacity=reduce?.8:.7+Math.sin(t*.6)*.25});
    })();
    (function(){
      var g=new THREE.Group(),leds=[];
      box(.9,2.6,.8,0x15100c,0,1.3,0,g);
      for(var r=0;r<9;r++){
        box(.78,.2,.03,0x241a14,0,.25+r*.27,.41,g);
        for(var k=0;k<3;k++){
          var m=new THREE.MeshBasicMaterial({color:0xd9a46b});
          var l=new THREE.Mesh(new THREE.BoxGeometry(.05,.05,.03),m);l.position.set(-.3+k*.1,.25+r*.27,.43);g.add(l);
          leds.push({m:m,s:.8+rnd()*2.2,o:rnd()*6});
        }
        box(.3,.03,.03,0x4a3626,.15,.25+r*.27,.43,g);
      }
      place(g,7.2,0,-1.9,-.12);
      tickers.push(function(t){leds.forEach(function(l){l.m.color.setHex(!reduce&&Math.sin(t*l.s+l.o)<0?0x4a3626:0xd9a46b)})});
    })();
    (function(){var g=new THREE.Group();box(.95,.6,.7,0x8a5a35,0,.3,0,g);box(.7,.45,.6,0xb98b5e,.05,.83,0,g).rotation.y=-.2;place(g,6,0,-.5,.2)})();
    plant(4.7,-1.5,2,1);

    // floating code glyphs (always face the camera) on both sides
    var GLY=['{ }','</>','=>','( )','[ ]','npm','git','JS','JSX','01','&&','API','DB','#'], sprites=[];
    GLY.forEach(function(txt,i){
      var cv=document.createElement('canvas');cv.width=cv.height=128;var g=cv.getContext('2d');
      g.font='bold '+(txt.length>2?40:56)+'px "JetBrains Mono",monospace';g.textAlign='center';g.textBaseline='middle';
      g.shadowColor='rgba(217,164,107,.9)';g.shadowBlur=14;
      g.fillStyle=dark?(i%3?'#e8d3b0':'#d9a46b'):(i%3?'#5a3b27':'#8a5a35');g.fillText(txt,64,64);
      var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),transparent:true,opacity:.85,depthWrite:false}));
      var x=(i%2===0?-1:1)*(3.6+rnd()*4.4);
      sp.position.set(x,1.2+rnd()*4.6,-1.8+rnd()*3);sp.scale.set(.9,.9,1);
      sp.userData={x:x,y:sp.position.y,o:rnd()*6,s:.4+rnd()*.5};
      scene.add(sp);sprites.push(sp);
    });
    tickers.push(function(t){if(reduce)return;sprites.forEach(function(sp){var u=sp.userData;sp.position.y=u.y+Math.sin(t*u.s+u.o)*.25;sp.position.x=u.x+Math.cos(t*u.s*.7+u.o)*.15;sp.material.rotation=Math.sin(t*.3+u.o)*.2})});

    // drifting dust in the light
    var N=140,dp=new Float32Array(N*3);
    for(var di=0;di<N;di++){dp[di*3]=(rnd()-.5)*18;dp[di*3+1]=.4+rnd()*5.5;dp[di*3+2]=-2+rnd()*4}
    var dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.BufferAttribute(dp,3));
    scene.add(new THREE.Points(dg,new THREE.PointsMaterial({color:dark?0xfff1d0:0xb98b5e,size:.05,transparent:true,opacity:.7,depthWrite:false})));
    tickers.push(function(t){if(reduce)return;var a=dg.attributes.position;for(var q=0;q<N;q++){var y=a.getY(q)+.004+(q%5)*.0006;a.setY(q,y>6?.4:y);a.setX(q,a.getX(q)+Math.sin(t+q)*.0008)}a.needsUpdate=true});

    // ===== hacker den: wall code, evidence board, router, cables, CPU, sticky notes =====
    function txtCanvas(w,h,draw){var cv=document.createElement('canvas');cv.width=w;cv.height=h;draw(cv.getContext('2d'),w,h);return cv}
    function decal(cv,w,h,x,y,z){var m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthWrite:false}));m.position.set(x,y,z);scene.add(m);return m}
    function glowText(g,lines,size,x,y,gap,cols){g.font='bold '+size+'px "JetBrains Mono",monospace';g.textBaseline='top';g.shadowColor='rgba(217,164,107,.85)';g.shadowBlur=16;lines.forEach(function(l,i){g.fillStyle=cols[i%cols.length];g.fillText(l,x,y+i*gap)})}

    // code painted on the brick wall
    decal(txtCanvas(1024,200,function(g){glowText(g,['// amal.config.js','const dev = { stack: "MERN", coffee: Infinity };','while (alive) { learn(); build(); deploy(); }'],34,10,8,56,['#8a6a48','#e8d3b0','#d9a46b'])}),6.4,1.25,0,5.65,-2.385);
    decal(txtCanvas(512,220,function(g){glowText(g,['$ ssh amal@portfolio','> access granted_','$ npm run hire','> deploying offer...'],30,10,10,50,['#e8d3b0','#39ff88','#e8d3b0','#d9a46b'])}),2.4,1.03,7.6,4.3,-2.385);

    // evidence board: photos, red strings, pins and sticky notes (MERN stack as the "case")
    var boardCv=txtCanvas(1024,640,function(g,w,h){
      g.fillStyle='#9b6c42';g.fillRect(0,0,w,h);
      for(var i=0;i<1800;i++){g.fillStyle='rgba('+(60+Math.random()*60|0)+',35,10,'+(Math.random()*.25)+')';g.fillRect(Math.random()*w,Math.random()*h,2,2)}
      var nodes=[['React',150,150],['Express',440,120],['MongoDB',770,170],['Node',250,410],['JWT',570,430],['Vercel',870,450]];
      nodes.forEach(function(n,i){
        g.save();g.translate(n[1],n[2]);g.rotate((i%3-1)*.09);
        g.shadowColor='rgba(0,0,0,.45)';g.shadowBlur=14;g.fillStyle='#e8dcc6';g.fillRect(-80,-62,160,124);g.shadowBlur=0;
        var gr=g.createLinearGradient(-70,-52,70,40);gr.addColorStop(0,'#1a120d');gr.addColorStop(1,'#8a5a35');g.fillStyle=gr;g.fillRect(-70,-52,140,90);
        g.fillStyle='#d9a46b';g.font='bold 26px monospace';g.textAlign='center';g.fillText(['</>','{ }','[ ]','=>','#!','*'][i],0,-2);
        g.fillStyle='#2a1a10';g.font='bold 20px monospace';g.fillText(n[0],0,56);
        g.restore();
      });
      g.strokeStyle='#c0392b';g.lineWidth=3;
      [[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5],[0,4],[2,4]].forEach(function(c){
        var a=nodes[c[0]],b=nodes[c[1]];g.beginPath();g.moveTo(a[1],a[2]-58);g.quadraticCurveTo((a[1]+b[1])/2,(a[2]+b[2])/2+24,b[1],b[2]-58);g.stroke();
      });
      nodes.forEach(function(n){var px=n[1],py=n[2]-58;g.fillStyle='#8f1f14';g.beginPath();g.arc(px,py,8,0,6.283);g.fill();g.fillStyle='#ff8a7a';g.beginPath();g.arc(px-2,py-2,3,0,6.283);g.fill()});
      [[40,290,'#f5c26b',['TODO','fix bug'],-.1],[560,30,'#e8d3b0',['npm run','build'],.08],[925,290,'#d9a46b',['git push','--force?'],.1],[680,540,'#f0b8a0',['404','brain'],-.07],[30,500,'#e8d3b0',['ask','mentor'],.06]].forEach(function(s){
        g.save();g.translate(s[0]+55,s[1]+55);g.rotate(s[4]);g.shadowColor='rgba(0,0,0,.4)';g.shadowBlur=10;g.fillStyle=s[2];g.fillRect(-55,-55,110,110);g.shadowBlur=0;
        g.fillStyle='#2a1a10';g.font='bold 18px monospace';g.textAlign='center';g.fillText(s[3][0],0,-4);g.fillText(s[3][1],0,22);g.restore();
      });
    });
    box(3.9,2.5,.1,0x2a1a10,-5.8,4.5,-2.34);
    var bm=new THREE.Mesh(new THREE.PlaneGeometry(3.7,2.3),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(boardCv),roughness:.9}));
    bm.position.set(-5.8,4.5,-2.28);scene.add(bm);

    // cables with little data packets travelling along them
    function cable(pts,c,pk,r){
      var curve=new THREE.CatmullRomCurve3(pts.map(function(p){return new THREE.Vector3(p[0],p[1],p[2])}));
      var m=new THREE.Mesh(new THREE.TubeGeometry(curve,48,r||.018,6,false),new THREE.MeshStandardMaterial({color:c,roughness:.6}));m.castShadow=true;scene.add(m);
      if(pk){var p=new THREE.Mesh(new THREE.SphereGeometry(.045,8,8),new THREE.MeshBasicMaterial({color:pk}));scene.add(p);var sp=.1+rnd()*.1,o=rnd();
        tickers.push(function(t){p.position.copy(curve.getPoint(reduce?o:((t*sp+o)%1)))})}
      return curve;
    }
    // wall router with blinking lights
    (function(){
      var g=new THREE.Group(),leds=[];
      box(.95,.32,.12,0x15100c,0,0,0,g);cyl(.02,.02,.5,0x15100c,.38,.4,0,g,6);cyl(.02,.02,.5,0x15100c,-.38,.4,0,g,6);
      for(var k=0;k<6;k++){var m=new THREE.MeshBasicMaterial({color:0x39ff88});var l=new THREE.Mesh(new THREE.BoxGeometry(.05,.05,.02),m);l.position.set(-.35+k*.14,0,.07);g.add(l);leds.push({m:m,s:1.5+rnd()*3,o:rnd()*6})}
      place(g,-7.3,2.2,-2.33);
      tickers.push(function(t){leds.forEach(function(l){l.m.color.setHex(!reduce&&Math.sin(t*l.s+l.o)<0?0x1a3a28:0x39ff88)})});
    })();
    box(.28,.28,.03,0xe8d3b0,-3.7,.6,-2.38); // wall socket
    cable([[-1.6,.3,-.45],[-2.5,.04,-.8],[-4,.04,-1.2],[-5.8,.04,-1.1],[-7.1,.04,-1.9],[-7.3,.5,-2.3],[-7.3,1.5,-2.32],[-7.3,2.05,-2.3]],0xd9a46b,0xfff1d0);   // network: CPU -> router
    cable([[-1.55,.15,-.55],[-2.2,.03,-1.2],[-3,.03,-1.7],[-3.6,.15,-2.2],[-3.7,.55,-2.35]],0x4a4a4a,0xd9a46b);                                     // power: CPU -> socket
    cable([[-1.3,1.52,-.6],[-1.4,1.52,-.9],[-1.5,1.52,-1.28],[-1.5,1.2,-1.4],[-1.45,.8,-.9],[-1.4,1.0,-.35]],0xe8d3b0,0xffffff);                    // monitor -> CPU
    cable([[-.95,1.53,.33],[-1,1.52,0],[-1.2,1.52,-.3],[-1.3,1.5,-.55]],0x6b4a33);                                                                  // keyboard
    cable([[-.2,1.53,.4],[-.3,1.52,.3],[-.55,1.52,.15],[-1,1.52,-.05]],0x6b4a33);                                                                   // mouse
    cable([[-7.55,2.35,-2.3],[-7.75,2.8,-2.27],[-7.5,3.2,-2.3]],0xc0392b,0xff8a7a);                                                                 // router -> board
    cable([[-7.05,2.35,-2.3],[-6.9,2.9,-2.27],[-7.1,3.25,-2.3]],0xe8d3b0);

    // CPU tower under the desk
    (function(){
      var g=new THREE.Group(),fans=[];
      box(.52,1.05,.82,0x15100c,0,.55,0,g);box(.46,.98,.02,0x241a14,0,.55,.42,g);
      [.82,.4].forEach(function(y){
        var f=new THREE.Group();f.position.set(0,y,.44);g.add(f);
        f.add(new THREE.Mesh(new THREE.TorusGeometry(.13,.014,8,24),new THREE.MeshBasicMaterial({color:0xd9a46b})));
        for(var b=0;b<5;b++){var arm=new THREE.Group();arm.rotation.z=b/5*6.283;f.add(arm);box(.12,.045,.01,0x4a3626,.07,0,0,arm)}
        fans.push(f);
      });
      var strip=new THREE.Mesh(new THREE.BoxGeometry(.02,.9,.02),new THREE.MeshBasicMaterial({color:0xd9a46b}));strip.position.set(-.21,.55,.44);g.add(strip);
      box(.07,.05,.03,0x39ff88,.15,1.0,.43,g);
      place(g,-1.4,0,-.1,.18);
      var gl=new THREE.PointLight(0xd9a46b,.9,3.4);gl.position.set(-1.4,.5,.7);scene.add(gl);
      tickers.push(function(t){if(reduce)return;fans.forEach(function(f,i){f.rotation.z=t*(i?6:7)})});
    })();

    // sticky notes
    function note(x,y,z,col,lines,rz,flat){
      var cv=txtCanvas(128,128,function(g,w,h){g.fillStyle=col;g.fillRect(0,0,w,h);g.fillStyle='rgba(0,0,0,.08)';g.fillRect(0,0,w,14);g.fillStyle='#2a1a10';g.font='bold 20px "JetBrains Mono",monospace';g.textAlign='center';lines.forEach(function(l,i){g.fillText(l,64,56+i*26)})});
      var m=new THREE.Mesh(new THREE.BoxGeometry(.3,.3,.012),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv)}));
      m.position.set(x,y,z);if(flat){m.rotation.x=-Math.PI/2;m.rotation.z=rz}else m.rotation.z=rz;scene.add(m);return m;
    }
    note(-7.8,1.5,-2.385,'#f5c26b',['pass:','*****'],.1);
    note(-6.95,1.2,-2.385,'#e8d3b0',['sudo','hire amal'],-.08);
    note(-7.75,2.75,-2.385,'#d9a46b',['coffee','++'],-.12);
    note(-6.85,2.8,-2.385,'#f0b8a0',['deploy','FRIDAY?'],.09);
    note(-2.75,2.5,-2.385,'#f5c26b',['TODO:','sleep'],.07);
    note(-2.95,3.0,-2.385,'#e8d3b0',['fix','bug #42'],-.1);
    note(-.4,1.516,.95,'#f5c26b',['ideas','...'],.3,true);
    note(.55,1.516,1.05,'#d9a46b',['call','mentor'],-.25,true);
    var mglow=new THREE.PointLight(0xd9a46b,.7,5);mglow.position.set(-.9,2.3,.5);scene.add(mglow);

    var mobile=function(){return stage.clientWidth/stage.clientHeight<1};
    function views(){var m=mobile();return{
      home:{p:new THREE.Vector3(0,4,m?17:12),l:new THREE.Vector3(0,1.8,0)},
      projects:{p:new THREE.Vector3(m?-.9:-1.7,2.9,m?4.6:3.4),l:new THREE.Vector3(-.9,2.6,-.5)},
      skills:{p:new THREE.Vector3(1.9,2.9,m?4.2:3.2),l:new THREE.Vector3(1.2,2.0,.3)},
      about:{p:new THREE.Vector3(.2,2.7,m?3.6:3),l:new THREE.Vector3(.2,1.7,.7)},
      contact:{p:new THREE.Vector3(2.6,3,m?4.2:3),l:new THREE.Vector3(2,2,-.8)}}}
    var hov=null;var V=views(),cur='home',pos=V.home.p.clone(),look=V.home.l.clone(),mx=0,my=0,sp=0;

    function go(sec){onPick(sec)}

    var ray=new THREE.Raycaster(),ndc=new THREE.Vector2();
    function pick(e){
      var r=canvas.getBoundingClientRect();
      ndc.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);
      ray.setFromCamera(ndc,camera);var h=ray.intersectObjects(clickable,false);
      return h.length?h[0].object.userData.section:null;
    }
    var onClick=function(e){var s=pick(e);if(s)go(s)};
    var onMove=function(e){
      mx=(e.clientX/innerWidth-.5);my=(e.clientY/innerHeight-.5);
      hov=pick(e);canvas.style.cursor=hov?'pointer':'default';
    };
    canvas.addEventListener('click',onClick);
    canvas.addEventListener('pointermove',onMove);

    function resize(){renderer.setSize(stage.clientWidth,stage.clientHeight,false);camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();V=views()}
    addEventListener('resize',resize);resize();

    var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,t0=performance.now();
    function clamp(x){return Math.max(0,Math.min(1,x))}
    function frame(now){
      var t=(now-t0)/1000,k=reduce?1:.06,v=V[cur];
      // scroll-driven values
      sp=clamp(1-stage.getBoundingClientRect().top/innerHeight); // 0 = below fold, 1 = fully in view
      var dolly=(cur==='home'&&!reduce)?(1-sp):0;
      pos.lerp(v.p,k);look.lerp(v.l,k);
      camera.position.set(pos.x+(reduce?0:mx*.6),pos.y+(reduce?0:-my*.3)+dolly*3,pos.z+dolly*9);
      camera.lookAt(look);
      floaters.forEach(function(m){
        m.rotation.x=reduce?0:t*.6+m.userData.o;m.rotation.y=reduce?0:t*.8;
        m.position.y=m.userData.y+(reduce?0:Math.sin(t+m.userData.o)*.15)});
      clickable.forEach(function(o){if(o.material&&o.material.emissive)o.material.emissive.setHex(o.userData.section===hov?0x6b4a1f:0)});
      lampL.intensity+=((cur==='contact'?2.4:0)-lampL.intensity)*.08;
      tickers.forEach(function(f){f(t)});
      steam.forEach(function(m){var k=((now/2600)+m.userData.o)%1;m.position.set(.2+Math.sin(k*6+m.userData.o*9)*.04,1.78+k*.5,.7);m.material.opacity=reduce?0:(1-k)*.32;m.scale.setScalar(1+k*2)});
      renderer.render(scene,camera);if(alive)raf=requestAnimationFrame(frame);
    }
    raf=requestAnimationFrame(frame);

  return {
    // called by React whenever the active section changes (camera fly-to, lamp light)
    setActive: function (sec) { cur = sec; V = views(); },
    dispose: function () {
      alive = false;
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('pointermove', onMove);
      scene.traverse(function (o) {
        if (o.geometry) o.geometry.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); });
      });
      renderer.dispose();
    }
  };
}