#!/bin/sh
# ----------> Start
echo Start project

# Create root dir
mkdir app

# Create views dir
mkdir app/views
{
  echo "doctype"
  echo "html"
  echo "  head"
  echo "    meta(charset='utf-8')"
  echo "    meta(http-equiv='Content-Type',content='text/html; charset=utf-8')"
  echo "    meta(http-equiv='X-UA-Compatible', content='IE=edge')"
  echo "    meta(name='viewport', content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')"
  echo "    title Project title"
  echo "    link(rel='stylesheet', id='mainStylesheet' href='../css/main.styl')"
  echo "  body"
  echo "    #main"
  echo "    script(src='../js/main.js')"
} > app/views/index.pug

# Create js dir
mkdir app/js
{
  echo "console.log('Welcome')"
} > app/js/main.js

# Create css dir
mkdir app/css
{
  echo "html"
  echo "    height 100%"
  echo "    padding 0"
  echo "    margin 0"
} > app/css/main.styl

# Create package.json
{
  echo '{'
  echo '  "name": "simulator",'
  echo '  "version": "0.0.0",'
  echo '  "description": "",'
  echo '  "main": "index.js",'
  echo '  "scripts": {'
  echo '    "start": "parcel app/views/index.pug --no-hmr",'
  echo '    "build": "rm -rf docs && parcel build app/views/index.pug --out-dir docs"'
  echo '  },'
  echo '  "keywords": [],'
  echo '  "author": "proper-code",'
  echo '  "license": "ISC",'
  echo '  "devDependencies": {'
  echo '    "parcel-bundler": "*",'
  echo '    "pug": "*",'
  echo '    "stylus": "*"'
  echo '  },'
  echo '  "dependencies": {'
  echo '  }'
  echo '}'
} > package.json

# Create .gitignore
{
  echo ".cache"
  echo "dist"
  echo "node_modules"
  echo "npm-debug.log"
  echo "package-lock.json"
} > .gitignore

# install
npm i

# run
npm start

# ----------> End