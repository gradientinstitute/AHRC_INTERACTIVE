# AHRC_INTERACTIVE
An embeddable interactive web widget for the AHRC and partner website. Contents:

----

`demo.html` - an (almost) empty document embedding the interactive as an `<IFrame>`. Note that the interactive will fill the width of its container, so keep the box's ratio ~16:10 (eg 800x500, 1000x625).

`interactive.html` - the interactive itself, styles specified inside the HTML header. Essentially just commented SVG tags and a call to the script - edit this text to modify hex colours, font sizes, svg geometry.

`interact.js` - the script to animate the interactive.

-----

There are two places you'll find the code. `src/` is for our development, `publish/` is for uploading. There are a couple of convenience scripts also. 

`./build.sh` minifies (strips comments etc) out of the JavaScript. You'll need `pacin npm` and `sudo npm install uglify-js -g` as dependencies. The output goes into the `publish` folder. 

`./upload.sh` uploads the `publish` folder to our temporary paid gcloud hosting (not a permanent solution). It requires `pacin google-cloud-sdk` and [associated initialisation](https://cloud.google.com/sdk/docs/initializing) to connect.



## Tweaking the interactive

The starting point for minor changes is opening `src/interactive.html` and editing the code manually (hex-colours and coordinates should be self explanatory and the source is commented). It is essential not to rename component IDs, otherwise the Javascript may stop working. Yes you can often cut and paste from inkscape SVGs but be warned that it tends to mess up text and/or scaling so do as much manually as you can. 

Debug in your browser by opening `src/demo.html` .

When you're done, you'll then need to `./build.sh` and `./upload.sh` as above for these changes to be reflected in the test instance. If the changes aren't showing up, your ISP/browser is probably caching the old version, try adding a unique nonsense query, eg `iter=6`:

​	http://35.213.212.16/demo.html?iter=6



## Delivering code:

Just run `./build.sh`, and then give the customer a copy of the publish folder.

