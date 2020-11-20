'use strict';  // Enforce variable declarations etc


// drive the custom slider
var gui = document.getElementById("gradient_widget");

// Positions of gui elements when updating
var ms_width = [131.7, 131.7, 122.8];
var fs_width = [96.5, 105.4, 113.7];
var rej_reason = [0, 0, 1];  // one-hot indicator with linear transition
var msw = ms_width[0], fsw = fs_width[0], rej = rej_reason[0]
var mst = msw, fst=fsw, rejt = rej; // and default targets
var wid_anim = null;  // animation timer 

// Gui components defined in demo.html
var ws = document.getElementById("woman_selector");
var ms = document.getElementById("man_selector");
var fr = document.getElementById("bias_reject");
var rej_err = document.getElementById("reject_err");
var rej_bias = document.getElementById("reject_bias");

// Linear transition step
function towards(x, y, step) {
    if (x < y) {
        x += step;
        if (x > y)
            x = y;
    } else {
        x -= step;
        if (x < y)
            x = y;
    }
    return x; 
}


function wid_animation() {
    // animation timestep for when sliders are adjusted
    var step = 0.5;
    msw = towards(msw, mst, step);
    fsw = towards(fsw, fst, step);
    rej = towards(rej, rejt, .04); // same step?
    var fro = fsw + .3;  // female reject box offset = rhs of female select box

    // Set animation positions
    ws.setAttribute("width", fsw);
    ms.setAttribute("width", msw);
    fr.setAttribute("x", fsw + .257);
    fr.setAttribute("width", 123.6 - fro);

    // non-linear blend between the two possible annotations
    var a = Math.min(2 * rej, 1);
    var b = Math.min(2 * (1-rej), 1);

    // set relative to the group scroll-in transformation
    rej_bias.setAttribute("transform", "translate(" + (100 * a) + ", 0)")
    rej_err.setAttribute("transform", "translate(" + (100 * b) + ", 0)");


    // If finished, we can clear the animation timer
    if (msw == mst && fsw == fst && rej == rejt && wid_anim != null) {
        clearInterval(wid_anim);
        wid_anim = null;
    }
}

// init gui components to calculated positions
wid_animation(); // init everything


function coords(evt) {
    var svg_pt = gui.createSVGPoint();
    var bound = gui.getBoundingClientRect();
    svg_pt.x = evt.clientX - gui.clientLeft;
    svg_pt.y = evt.clientY - gui.clientTop;
    var loc = svg_pt.matrixTransform(gui.getScreenCTM().inverse());
    return loc;
}


// <path id="slider_bar" d="m93 11 h27.5" fill="none" stroke="#000" stroke-width=".9"/>
// <rect id="slider_knob" x="92" y="8" width="2" height="6" fill="#00A" stroke="#000" stroke-width=".2"/>
var slider_knob = document.getElementById("slider_knob");
var slider_bar = document.getElementById("slider_bar");
var readout = document.getElementById("readout");
var slider_active = document.getElementById("slider_active");


// Make the custom slider work
// slidable (but snap to the ticks...)
var dragging=false;
var step=0;
function sld_callback(evt) {
    // if (evt.buttons == 0)
    if (evt.pressure == 0)
        dragging = false;
    if (dragging) {
        var loc = coords(evt);
        var cx = loc.x;
        // 2014 @ x=39, 2 years = 27 units
        step = Math.max(0, Math.min(2, Math.round((cx-39)/27)));
        update_slider();
    }
};

slider_active.addEventListener('pointerdown', function (evt) {
    dragging=true;
    sld_callback(evt);
});

document.addEventListener('keydown', function(evt) {
    var last = step;
    if (evt.code == "ArrowLeft" & step > 0)
        step -= 1;
    if (evt.code == "ArrowRight" & step < 2)
        step += 1;
    if (step != last)
        update_slider();
});

// seems touch events don't always trigger pointermove
// but maybe support the pointers anyway
slider_active.addEventListener('pointermove', sld_callback);


function update_slider() {
    var year = 2015 + 2*step;
    
    // Adjust the text
    readout.innerHTML= "" + year;

    // adjust the slider components
    var x = 39 + 27 * step;
    slider_knob.setAttribute("transform", "translate(" + x + ", 0)");  // used to set x property
    slider_bar.setAttribute("d", "m" + x + " 11 h" + (106.5 - x));  // was 120

    // now animate the rest of the plot
    mst = ms_width[step];
    fst = fs_width[step];
    rejt = rej_reason[step];

    if ((mst != msw | fst != fsw | rej != rejt) & wid_anim == null) {
        wid_anim = setInterval(wid_animation, 20);
    }
    
}

// make sure the initial settings are consistent
update_slider(0);


// function getRealOffset() {
//     // Compute interactive's offset, even if code is embedded in an iframe
//     var y = window.pageYOffset;
//     // var current = window;

//     // while (current != window.top) {
//     //     current = current.Parent;
//     //     rect = frameElement.getBoundingClientRect()
//     //     y += current.pageYOffset
//     //     return window.pageYOffset;
//     // }
// }


// Handle the browser position scrolling
function scrollin(ident, callback) {
    var timer=null, step=0, t=0;
    var item = document.getElementById(ident);
    
    // function scrollfn(e) {

    //     var scroll = getRealOffset();
    //     var ih = window.innerHeight * .7;
    //     console.log("scrolled", scroll, ih);
    //     var rect = item.getBoundingClientRect();
    //     var mid = rect.top + rect.height * 0.5;
    //     if (scroll > mid + 50 - ih & t < 1) {
    //         step = 0.05;   
    //         if (timer == null)
    //             timer = setInterval(anim, 10);
    //     }
    //     if (scroll < mid - ih & t > 0) {
    //         step = -0.05;   
    //         if (timer == null)
    //             timer = setInterval(anim, 10);
    //     }
    // }
    // // window.addEventListener('scroll', scrollfn);

    // // can only do this if the frames are on the same web server
    // // (not even local files)
    // window.parent.addEventListener('scroll', scrollfn)

    // we run into cross origin problems if we do this on scroll
    // so just do it on a timer
    t = -1;
    step = 0.05;

    function anim() {
        t += step;
        // if (t < 0.) {
        //     t = 0.;
        //     clearInterval(timer);
        //     timer = null;
        // }
        if (t > 1.) {
            t = 1.;
            clearInterval(timer);
            timer = null;
        }
        if (t >= 0)
            callback(item, t);
    }

    timer = setInterval(anim, 10);
    
    // proc initial
    // scrollfn(null);
}


scrollin("annotations", function (item, t) {
    item.setAttribute("transform", "translate(" + (1. - t) * 95 + " 0)");
});


var item2 = document.getElementById("woman_selector");

scrollin("man_selector", function (item, t) {
    var xx = .257 + (t - 1) * 150;
    item.setAttribute("x", xx);
    item2.setAttribute("x", xx);
});
