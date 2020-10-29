if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line global-require
    require('dotenv').config();
  }


const mongoose = require('mongoose');

const connection =  new require('./kafka/Connection');
//topics files
//var signin = require('./services/signin.js');
const staticRoutes = require('./routes/fixedData/staticData');

const customerRoutes = require('./routes/customerData/customerHandling');

const restaurantRoutes = require('./routes/restaurantData/restaurantHandling');

// const customerRoutes = require('./routes/customerData/customerHandling');

// const 

const { mongoDB, frontendURL } = require('./config');

function handleTopicRequest(topic_name,fname){
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        
        fname.handle_request(data.data, function(err,res){
            console.log('after handle'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });        
    });
}

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 500,
    bufferMaxEntries: 0,
  };

mongoose.connect(mongoDB, options, (err, res) => {
    if (err) {
      console.log(err);
      console.log('MongoDB connection failed');
    } else {
      console.log('MongoDB connected');
    }
  });
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest('staticRoutes',staticRoutes)
handleTopicRequest('custRoutes',customerRoutes)
handleTopicRequest('restRoutes',restaurantRoutes)

