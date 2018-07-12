## Travis Badge
[![Build Status](https://travis-ci.org/kgamer007/RemindR.svg?branch=master)](https://travis-ci.org/kgamer007/RemindR)

# RemindR App: Never go a day without a reminder 
# Contents
* [Authors](#authors)
* [Introduction](#introduction)
* [Getting Started](#getting-started)
* [Routes](#routes)
* [Packages and other Dependencies](#packages)

### Developers: 
- Andrew Peacock
- Ashton Ellis
- Jenny Lawrence
- Kevin Hwangpo

## Introduction:
```RemindR```is the back-end (server-side) application that reminds you when you have something to do. Users who want to use this app will be able to create an account/profile. Users will be able to send notification texts. Userees will be sent scheduled SMS messages which will let them know when an event is ready. Some examples include but are not limited to a pill that needs to be taken or you and a group of friends that need to make sure you follow through or just simply give your mom a remindR that you're hungry and need food. 

## Getting Started for other developers:
- ```npm i``` the specific packages needed to work on this app.
- Set up an AWS account (they are free for the first year you sign up)
- Make a Twilio account and follow their docs on how to connect your phone number to receive SMS messages (you will be credited '$15' worth of SMS messages) ((messages sent are 3/4 of a penny, so you can run many tests before you run out))

## Running Locally:

 You will need a <a href="https://www.twilio.com/">Twilio Number</a>

#### In Your.env File:

 - PORT: defaults to 3000, set to 5000 for testing purposes
 - NODE_ENV: set to development
 - MONGODB_URI: set to mongodb://localhost/testing
 - SECRET_KEY: set to your own personal randomized sequence of alphanumeric characters
 - TWILIO_ACCOUNT_SID: Twilio will give you this
 - TWILIO_AUTH_TOKEN: check Twilio account.
 - TWILIO_NUMBER: check Twilio account for reference
 - MY_NUMBER: personal phone number for testing purposes

## Routes
Account
POST 
GET
PUT 
DELETE

Profile
POST 
GET
PUT 
DELETE

Images
POST 
GET
PUT 
DELETE

Messages
POST: http://localhost:3000/api/messages When making a post request you are creating a new message. 
GET: http://localhost:3000/api/messages/:id This will grab information from Database by id. 
PUT: http://localhost:3000/api/messages/:id This route will allow the receiver to update a message with a response.
DELETE: http://localhost:3000/api/messages/:id This will delete a particuluar message by id. 

Reminder
POST 
GET
PUT 
DELETE

## Packages
```npm i``` For those of you who want to start and use our back-end RemindR app, download all required packages!
- [Aws-sdk](https://www.npmjs.com/package/aws-sdk) - Amazon Simple Storage Service (AWS S3) is simple but powerful cloud data storage solution. It can hold assets of any size. 
- [Twilio](https://www.npmjs.com/package/twilio) - A cloud communications platform to allow user to send SMS messages 
- [Express](https://www.npmjs.com/package/express) - HTTP server routing, routing refers to application’s endpoints (URIs) respond to client requests.
- [Mongoose](http://mongoosejs.com/docs/guide.html) - Simply used this service for helpful CRUD methods and additional schema properties
- [MongoDB](https://www.npmjs.com/package/mongodb) -  Allows developers to create schemas that store and query JSON like documents.
- [Dotenv](https://www.npmjs.com/package/dotenv) - Loads environment variables from a .env file into process.env.
- [Faker](https://www.npmjs.com/package/faker) - Generates fake data that we use for usernames/emails/password/phone#.
- [Winston](https://github.com/winstonjs/winston) - Used for error logging.
- [Multer](https://github.com/expressjs/multer) - Is essentially used as a body-parser. 
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#readme) - We wanted our users to be granted tokens to access their own accounts/profiles.