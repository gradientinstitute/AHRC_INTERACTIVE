// Copyright (C) 2020 Australian Human Rights Commission. All Rights Reserved. 
"use strict";var gui=document.getElementById("gradient_widget"),ms_width=[131.7,131.7,122.8],fs_width=[96.5,105.4,113.7],rej_reason=[0,0,1],msw=ms_width[0],fsw=fs_width[0],rej=rej_reason[0],mst=msw,fst=fsw,rejt=rej,wid_anim=null,ws=document.getElementById("woman_selector"),ms=document.getElementById("man_selector"),fr=document.getElementById("bias_reject"),rej_err=document.getElementById("reject_err"),rej_bias=document.getElementById("reject_bias");function towards(t,e,r){return t<e?e<(t+=r)&&(t=e):(t-=r)<e&&(t=e),t}function wid_animation(){msw=towards(msw,mst,.5),fsw=towards(fsw,fst,.5),rej=towards(rej,rejt,.04);var t=fsw+.3;ws.setAttribute("width",fsw),ms.setAttribute("width",msw),fr.setAttribute("x",fsw+.257),fr.setAttribute("width",123.6-t);var e=Math.min(2*rej,1),t=Math.min(2*(1-rej),1);rej_bias.setAttribute("transform","translate("+100*e+", 0)"),rej_err.setAttribute("transform","translate("+100*t+", 0)"),msw==mst&&fsw==fst&&rej==rejt&&null!=wid_anim&&(clearInterval(wid_anim),wid_anim=null)}function coords(t){var e=gui.createSVGPoint();gui.getBoundingClientRect();return e.x=t.clientX-gui.clientLeft,e.y=t.clientY-gui.clientTop,e.matrixTransform(gui.getScreenCTM().inverse())}wid_animation();var slider_knob=document.getElementById("slider_knob"),slider_bar=document.getElementById("slider_bar"),readout=document.getElementById("readout"),slider_active=document.getElementById("slider_active"),dragging=!1,step=0;function sld_callback(t){0==t.pressure&&(dragging=!1),dragging&&(t=coords(t).x,step=Math.max(0,Math.min(2,Math.round((t-39)/27))),update_slider())}function update_slider(){var t=2015+2*step;readout.innerHTML=""+t;t=39+27*step;slider_knob.setAttribute("transform","translate("+t+", 0)"),slider_bar.setAttribute("d","m"+t+" 11 h"+(106.5-t)),mst=ms_width[step],fst=fs_width[step],rejt=rej_reason[step],(mst!=msw|fst!=fsw|rej!=rejt)&null==wid_anim&&(wid_anim=setInterval(wid_animation,20))}function scrollin(t,e){var r=null,s=0,n=document.getElementById(t);s=-1,r=setInterval(function(){1<(s+=.05)&&(s=1,clearInterval(r),r=null),0<=s&&e(n,s)},10)}slider_active.addEventListener("pointerdown",function(t){dragging=!0,sld_callback(t)}),document.addEventListener("keydown",function(t){var e=step;"ArrowLeft"==t.code&0<step&&--step,"ArrowRight"==t.code&step<2&&(step+=1),step!=e&&update_slider()}),slider_active.addEventListener("pointermove",sld_callback),update_slider(0),scrollin("annotations",function(t,e){t.setAttribute("transform","translate("+95*(1-e)+" 0)")});var item2=document.getElementById("woman_selector");scrollin("man_selector",function(t,e){e=.257+150*(e-1);t.setAttribute("x",e),item2.setAttribute("x",e)});
