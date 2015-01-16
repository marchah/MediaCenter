MediaCenter
===========
 
Install
-------

Install NodeJS

````
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install -y nodejs
````


Install Bower

````
sudo npm install -g bower
````

Install MongoBD

````
apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" | tee -a /etc/apt/sources.list.d/10gen.list
apt-get -y update
apt-get -y install mongodb-10gen
````

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
