# Roboconf Web Administration
[![License](https://img.shields.io/hexpm/l/plug.svg)](http://www.apache.org/licenses/LICENSE-2.0)

Website: [http://roboconf.net](http://roboconf.net)  
Licensed under the terms of the **Apache License v2**.

A web application to interact with Roboconf's Deployment Manager.  
User documentation can be found on Roboconf's web site.


## Developer Guide

General guidelines about Roboconf's development are described on the web site.  
This read-me only lists specific items for the web console and Javascript development.

You need NPM installed on your machine.  
The primary thing to do is to execute...

```
npm install
```

To develop and test the application locally, execute...

```
gulp watch-dev
```

Then, open your web browser at http://localhost:8000.  
You can also use Gulp to execute advanced tasks. Here is a list.

* **gulp all** cleans output files, validates code quality, runs tests, minifies the scripts and packages a distribution.
* **gulp clean** cleans output files.
* **gulp lint** validates code quality with JS Hint.
* **gulp scripts** minifies and concatenates the JS scripts.
* **gulp** lists the available tasks.


## Files Description

The following files are used at some moment during development or build phases.

* **gulpfile.js**: the file that controls the build tasks.
* **package.json**: the NPM configuration (package identification and DEV dependencies management).
* **bower.json**: the Bower configuration (package identification and Front-End dependencies management).
* **.bowerrc**: additional configuration for Bower.
* **.jshintrc**: configuration for JS Hint (code quality).
* **.gitignore**: the usual file to list the files Git should not manage.

The following files are mainly for documentation.

* **readme.md**: the main documentation for this project.
* **NOTICE**: copyright mentions. 
* **LICENSE-2.0.txt**: the terms of the Apache license v2.


## Testing Policy

This web applications comes with tests.  
Unit tests run with [Mocha](http://mochajs.org/) and [Chai](http://chaijs.com/). Mainly services are tested unitly.  
Most of the tests are "end-to-end" (functional) tests. They are run with [protractor](http://angular.github.io/protractor).
These tests use real web browsers and mimic user actions. They also rely (indirectly) on [Selenium](http://www.seleniumhq.org/).

To run unit tests, either use...

	gulp unit-tests

... or use...

	karma start --single-run

Gulp is the build tool.  
It runs Karma to run tests during the build chain.
So, you can use both of them.
