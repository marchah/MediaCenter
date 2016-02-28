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

Backend API
````
POST /login param : login (String) (accept also email but the file has to be named « login »), password (String)
	→ Redirection 302
•	Success : GET /loginSuccess
JSON{isAuthenticated: Boolean, message: String}
•	Failure : GET /loginFailure
JSON{isAuthenticated: Boolean, message: String}


GET /listChannel
•	Succes : JSON {listChannel : {_id : ObjectId, name : String}, message : String}
•	Failure : JSON {listChannel : false, message : String}


GET /listVideo
GET /listVideo/:numPage(\\d+)
GET /listVideo/:idChannel (Warning : don't use this route with idChannel = 0 because the API will think your mean the page number)
GET /listVideo/:numPage(\\d+)/:nbVideoPerPage(\\d+)
GET /listVideo/:idChannel/:numPage(\\d+) (Warning : don't use this route with idChannel = 0 because the API will think your mean the page number)
GET /listVideo/:idChannel/:numPage(\\d+)/:nbVideoPerPage(\\d+)
	If general search put /listChannel/0/0/0
→ API ignore idChannel when it's not a valid id
→ if numPage < 1 API use numPage = 1
→  if nbVideoPerPage < 1 API use nbVideoPerPage = 10

•	Sucees: JSON { listChannel:[{_id : ObjectID, duration : String, title : String}], message : String}
•	Failure : JSON {listChannel : false, message : String}

````


Usage
-----

````
node server/server.js
````

TODO
----
* ~~Bug: delete video -> delete /video/undefined~~
* Bug: possible bug on add comment
* ~~Bug: when loggin HTML5 video tag take a long time to load~~
* style
* Bonus: search field in every page
* Bonus: signin ~~Facebook~~/twitter/~~google+~~

