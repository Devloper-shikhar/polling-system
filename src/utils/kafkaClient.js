// const { KafkaClient } = require('kafka-node');

// const kafkaClient = new KafkaClient({ kafkaHost: 'kafka:9092' });
// module.exports = kafkaClient;

const kafka = require('kafka-node');

const kafkaClient = new kafka.KafkaClient({
    kafkaHost: process.env.KAFKA_BROKER || 'kafka:9092', // Ensure this matches the Kafka service
});

module.exports = kafkaClient;

