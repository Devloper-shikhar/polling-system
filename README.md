Polling System with Kafka, Zookeeper, and WebSocket (Dockerized)

This project implements a polling system with Kafka for message streaming, Zookeeper for Kafka coordination, and WebSocket for real-time updates. The entire setup, including Kafka, Zookeeper, and the WebSocket server, is Dockerized for easy deployment. PostgreSQL is used locally for database persistence.

Table of Contents
Prerequisites
Setup Instructions
Setting up Zookeeper with Docker
Setting up Kafka with Docker
Setting up WebSocket with Docker
Setting up the Backend
Running the Project
Troubleshooting
Prerequisites
Before running the project, ensure you have the following software installed:

Docker and Docker Compose (for container orchestration)
Node.js (for backend development)
npm or yarn (for managing Node.js packages)
PostgreSQL running locally (for database persistence)


Setup Instructions
1. Setting up Zookeeper with Docker
Zookeeper is required by Kafka for managing its metadata and maintaining coordination between Kafka nodes. You can run Zookeeper using Docker. The docker-compose.yml file below will handle the Zookeeper setup.

2. Setting up Kafka with Docker
Kafka depends on Zookeeper, and we have set them up together in the docker-compose.yml. Kafka will be automatically configured and started when you start the Docker containers.

3. Setting up WebSocket with Docker
The WebSocket server is part of the Node.js backend and will run alongside Kafka and Zookeeper. The ws package is used to handle WebSocket connections in the backend.

4. Setting up the Backend (Node.js)
To set up the backend:

Clone the repository or navigate to your project folder.

Install the necessary dependencies using npm or yarn:

npm install

Dependencies
Here’s a list of all the dependencies for this project:

express: A minimal and flexible Node.js web application framework.
kafka-node: A Node.js client for Kafka to communicate with Kafka brokers.
ws: WebSocket implementation for real-time communication.
docker-compose: Tool for defining and running multi-container Docker applications.
pg: PostgreSQL client for Node.js, used for database interaction.
dotenv: Module to load environment variables from a .env file.
async: A utility module for working with asynchronous JavaScript.
cors: Middleware to enable Cross-Origin Resource Sharing.
To install these dependencies, run:


npm install express kafka-node ws pg dotenv async cors



Configure the backend to connect to PostgreSQL locally and Kafka in the Docker containers.

PostgreSQL (Local Setup)
Since PostgreSQL is running locally, update the .env file to use the local PostgreSQL instance:

## Setting Up PostgreSQL Locally

### Step 1: Install PostgreSQL
Ensure PostgreSQL is installed on your local machine. You can download it from [here](https://www.postgresql.org/download/).

### Step 2: Create the Database
Create a new database called `polling_system`:

psql -U postgres -c "CREATE DATABASE polling_system;"

POSTGRES_URI=postgres://<username>:<password>@localhost:5432/polling-system

Replace <username> and <password> with your actual PostgreSQL username and password.


Here’s the docker-compose.yml configuration for Kafka and Zookeeper:

yaml

version: '3.7'
services:
  zookeeper:
    image: wurstmeister/zookeeper:latest
    container_name: zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
    ports:
      - "2181:2181"

  kafka:
    image: wurstmeister/kafka:latest
    container_name: kafka
    depends_on:
      - zookeeper
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: INSIDE://kafka:9093
      KAFKA_LISTENER_SECURITY_PROTOCOL: PLAINTEXT
      KAFKA_LISTENER_NAMES: INSIDE
      KAFKA_LISTENER_INTERNAL: INSIDE
      KAFKA_LISTENER_PORT: 9093
    ports:
      - "9092:9092"
WebSocket Server
Ensure your WebSocket server is configured to run on port 8080 and that it can connect to the backend.

Running the Project
To run the entire project, including Zookeeper, Kafka, WebSocket, and the Node.js backend, use Docker Compose.


docker-compose up --build

This will:

Start Zookeeper on port 2181
Start Kafka on port 9092
Build and start the Node.js backend on port 3000
Start the WebSocket server on port 8080
Once the services are up, your backend API and WebSocket server will be ready.

Troubleshooting
Kafka/Zookeeper Not Starting
Make sure Docker is running and check the logs for errors.
Use docker-compose logs to check logs for Kafka or Zookeeper services.
WebSocket Client Not Connecting
Verify that your WebSocket server is running on port 8080 and the client can connect to ws://localhost:8080.
Kafka Connection Error
Ensure the KAFKA_BROKER environment variable in .env is set to kafka:9092 (or the IP of the Kafka broker if running on a different host).
PostgreSQL Connection Issues
Make sure the PostgreSQL database is running locally and check that the connection string in .env is correct.

You can verify PostgreSQL by connecting using the command:

psql -U postgres -h localhost -d polling-system

By following these steps, you should have your complete polling system running with Kafka, Zookeeper, WebSocket, and PostgreSQL in a seamless Dockerized setup.
