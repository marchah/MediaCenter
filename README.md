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
sudo npm install -g bower express mongoose passport connect-flash morgan cookie-parser body-parser ...
ou peut etre npm update
````

Install MongoBD
````
apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" | tee -a /etc/apt/sources.list.d/10gen.list
apt-get -y update
apt-get -y install mongodb
sudo service mongod start
````

Require FFMPEG and FFPROBE

Install FFMPEG and FFPROBE
````
sudo add-apt-repository ppa:jon-severinsson/ffmpeg && sudo apt-get update -qq
sudo apt-get install ffmpeg
````

Install MediaCenter
````
git clone https://github.com/marchah/MediaCenter
cd MediaCenter
sudo npm install
````


Usage
-----

````
node server/server.js
````

TODO
----

* Bug: delete video -> delete /video/undefined
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
* Bonus: signin Facebook/twitter/google+

