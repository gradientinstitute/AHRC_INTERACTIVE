mkdir -p publish
uglifyjs --compress --mangle --mangle-props --output publish/interact.js src/interact.js
cp src/*.html publish/
