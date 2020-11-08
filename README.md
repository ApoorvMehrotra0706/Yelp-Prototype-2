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
1. config file with frontend URL in the Backend folder.
2. .env file with SESSION_YELP

## kafka-backend folder
1. .env file with GOOGLEAPIKEY, BUCKET_NAME, ACCESS_KEY_ID, SECRET_ACCESS_KEY
2  config file with MongoDB connection information

## Frontend folder
1. Config file in Frontend/yelp/src with the backedn URL information.


# Follow the below steps to run the project
1. Start Zookeeper and Kafka server.
2. Start kafka-backend with the command node server.js
3. Start Backend with the command node index.js
4. Start Frontend/yelp with the command npm start.

