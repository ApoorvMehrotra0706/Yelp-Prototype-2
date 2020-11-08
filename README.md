# Yelp-Prototype
Created a prototype of yelp using MERN stack and Kafka Messaging Queue.

# Please follow the below steps to execute this project
1. Clone the repository.
2. npm install in the below path 
* Backend
* kakfa-backend
* Frontend/yelp

# Provide below folders in the below location
## Backend folder
1. config file with frontend URL and secret in the Backend folder as below

const config = {
  secret: < value >,
  frontendURL: < url:port >,
  
};

module.exports = config;

2. .env file with SESSION_YELP as below

SESSION_YELP= < value >

## kafka-backend folder
1. .env file with GOOGLEAPIKEY, BUCKET_NAME, ACCESS_KEY_ID, SECRET_ACCESS_KEY as below

SESSION_YELP= < value >
GOOGLEAPIKEY= < value >

BUCKET_NAME= < AWS S3 bucket >
ACCESS_KEY_ID= < AWS access key >
SECRET_ACCESS_KEY= < AWS secret access key >
  
2. Create below topics in the kafka server
* staticRoutes
* custRoutes
* restRoutes
* response_topic

3. config file with MongoDB connection information as below

const config = {
  secret: < value >,
  frontendURL: < url:port >,
  mongoDB:
    < connection url >,
};

module.exports = config;


## Frontend folder
1. Config file in Frontend/yelp/src with the backedn URL information as below.

const serverUrl = < url:port >;

export default serverUrl;



# Follow the below steps to run the project
1. Start Zookeeper and Kafka server.
2. Start kafka-backend with the command node server.js
3. Start Backend with the command node index.js
4. Start Frontend/yelp with the command npm start.

