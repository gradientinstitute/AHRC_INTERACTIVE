

function scrollin(ident, callback) {
    var timer=null, step=0, t=0;
    var item = document.getElementById(ident);

    window.addEventListener('scroll', function(e) {
        var scroll = window.pageYOffset;
        var rect = item.getBoundingClientRect();
        if (scroll > rect.top + rect.height & t < 1) {
            step = 0.05;   
            if (timer == null)
                timer = setInterval(anim, 10);
            console.log("BING");
        }
        if (scroll < rect.top & t > 0) {
            step = -0.05;   
            if (timer == null)
                timer = setInterval(anim, 10);
            console.log("BONG");
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


scrollin("rejector", function (item, t) {
    var xx = -18.6 + (1. - t) * 75;
    item.setAttribute("transform", "translate(" + xx + " -40.6)")
});


var item2 = document.getElementById("woman_selector");

scrollin("man_selector", function (item, t) {
    var xx = 3 + (t - 1) * 150;
    item.setAttribute("x", xx);
    item2.setAttribute("x", xx);
});
