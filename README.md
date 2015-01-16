MediaCenter
===========
 
Install
-------

Install NodeJS

https://github.com/joyent/node/wiki/installing-node.js-via-package-manager

Install Bower

````
npm install -g bower
````

Install MongoBD

http://tuts.syrinxoon.net/tuts/installation-et-bases-de-mongodb

Require FFMPEG and FFPROBE

Install FFMPEG
````
sudo add-apt-repository ppa:jon-severinsson/ffmpeg && sudo apt-get update -qq
sudo apt-get install libavdevice53 libpostproc52 libswscale2 ffmpeg ffprobe
````

Usage
-----

````
node server/server.js
````

TODO
----

* ~~multisource video support~~
* ~~video image~~
* ~~video duration~~
* ~~get authentication when user reload page~~
* ~~public user profile~~
* ~~upload video message success/erreur~~
* ~~private user profile: update video, delete video~~
* search video
* style
* Bonus: video comments
* Bonus: video tags
* Bonus signin Facebook/twitter/google+
