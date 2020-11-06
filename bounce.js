'use strict';  // Enforce variable declarations etc


// drive the slider
var slider = document.getElementById("ranger");

// Update the current slider value (each time you drag the slider handle)
var msw = 133, fsw = 97.5; // male select width
var mst = 133, fst = 97.5; // female select width
var fro = -8, frt = -8;  // reject box offset
var rej = 0, rejt = 0;  // swapover of rejection reason label


var wid_anim = null;
var ws = document.getElementById("woman_selector");
var ms = document.getElementById("man_selector");
var fr = document.getElementById("bias_reject");
var rej_err = document.getElementById("reject_err");
var rej_bias = document.getElementById("reject_bias");


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
    // called frequently
    var step = 0.5;
    msw = towards(msw, mst, step);
    fsw = towards(fsw, fst, step);
    fro = towards(fro, frt, step);
    rej = towards(rej, rejt, .04); // same step?

    ws.setAttribute("width", fsw);
    ms.setAttribute("width", msw);
    fr.setAttribute("x", 128 + fro);
    fr.setAttribute("width", 16.9 - fro);
   
    var a = Math.min(2 * rej, 1);
    var b = Math.min(2 * (1-rej), 1);

    // set relative to the group scroll-in transformation
    rej_bias.setAttribute("transform",
        "translate(" + (-18.6 + 100 * a) + ", -40.6)")
    rej_err.setAttribute("transform",
        "translate(" + (-18.2 + 100 * b) + ", -40.4)");


    if (msw == mst && fsw == fst && fro == frt && rej == rejt) {
        clearInterval(wid_anim);
        wid_anim = null;
    }
}

wid_animation(); // init everything


function slidefn() {
    // handle the transitions on this.value
    var i = slider.value;
    var ms_width = [133, 133, 123];
    var fs_width = [97.5, 106, 114];
    var fr_off = [-8, 0, 8];
    var rej_reason = [0, 0, 1];  // indicator variable
    mst = ms_width[i];
    fst = fs_width[i];
    frt = fr_off[i];
    rejt = rej_reason[i];

    if ((mst != msw | fst != fsw | fro != frt | rej != rejt) & wid_anim == null) {
        wid_anim = setInterval(wid_animation, 20);
    }

}
slider.oninput = slidefn;


// Handle the browser position scrolling
function scrollin(ident, callback) {
    var timer=null, step=0, t=0;
    var item = document.getElementById(ident);
    
    window.addEventListener('scroll', function(e) {
        var scroll = window.pageYOffset;
        var ih = window.innerHeight/3;
        var rect = item.getBoundingClientRect();
        if (scroll > rect.top + rect.height - ih & t < 1) {
            step = 0.05;   
            if (timer == null)
                timer = setInterval(anim, 10);
        }
        if (scroll < rect.top - ih & t > 0) {
            step = -0.05;   
            if (timer == null)
                timer = setInterval(anim, 10);
        }
    });

    function anim() {
        t += step;
        if (t < 0.) {
            t = 0.;
            clearInterval(timer);
            timer = null;
        }
        if (t > 1.) {
            t = 1.;
            clearInterval(timer);
            timer = null;
        }
        callback(item, t);
    }
    callback(item, t);
}


scrollin("rejectors", function (item, t) {
    item.setAttribute("transform", "translate(" + (1. - t) * 85 + " 0)");
});


var item2 = document.getElementById("woman_selector");

scrollin("man_selector", function (item, t) {
    var xx = 3 + (t - 1) * 150;
    item.setAttribute("x", xx);
    item2.setAttribute("x", xx);
});
