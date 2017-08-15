
## Prerequisites
Make sure you have installed all of the following prerequisites on your machine:
* Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Bower -  install bower globally using npm:

```bash
$ npm install -g bower
```

## Quick Install
Once you've downloaded the files and installed all the prerequisites,
The first thing you should do is install the Node.js dependencies to start the application.
To install Node.js dependencies you're going to use npm again. In the application folder run this in the command-line:

```bash
$ npm install
```

Then install the bower components by bower. In the application folder run this in the command-line:

```bash
$ bower install
```

## Running My Application
In the application folder run this in the command-line:

```bash
$ node server.js
```

and  just go to [http://localhost:3000](http://localhost:3000)

That's it! Application should be running.

Now You can signup and post the status messages and get status messages.


After click current message button, call the current status messages api.
After click previous 10 message button, call the previous 10 status messages api.
After click all button, call the all status messages api.

Go to particular  message and click the update after changing the message then update status message api called.
