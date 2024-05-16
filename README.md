# Azure Event Hub Data Processor

## Introduction

Hello, I'm Mohamed Riyad, a system architect and software engineer with over 8 years of experience. This project demonstrates an Azure Event Hub Data Processor, which processes data from Azure Event Hub, routes it through Azure Service Bus, and stores it in MongoDB.

## Overview

The Azure Event Hub Data Processor application is designed to read data from an Azure Event Hub, route the data to different Azure Service Bus queues based on specific criteria, and store the messages in a MongoDB database for further processing and analysis. The project leverages NestJS, TypeScript, MongoDB, Azure Event Hub, and Azure Service Bus.

## Architecture

![Azure Event Hub Data Processor Architecture](https://i.ibb.co/xHcfNR0/azure-event-hub-data-processor.png)

### Components

- **Client Application**: Initiates the process by sending sample events using `sendSampleMessages.ts`.
- **sendSampleMessages.ts**: Publishes sample events to Azure Event Hub.
- **Azure Event Hub**: Receives events and passes them to the `EventHubService`.
- **EventHubService**: Listens to the Event Hub, processes incoming events, and sends messages to the appropriate Azure Service Bus queues using `ServiceBusService`. Logs the event reception.
- **ServiceBusService**: Sends messages to the specific Azure Service Bus queues based on the event type. Logs the message sending process.
- **Azure Service Bus Queues**: Different queues (High Priority Queue, Default Queue, and Low Priority Queue) receive messages.
- **QueueListenerService**: Listens to the Service Bus queues, processes the messages, and stores them in the MongoDB collection `processed_events`. Logs the message processing.
- **MongoDB**: Stores the processed messages in the `event_hub_data` database and `processed_events` collection.
- **Logging**: Logs are maintained for event reception, message sending, and message processing.

## Prerequisites

- MS Azure Account (We need the following two services enabled on it)
  - [Azure Event Hub](https://learn.microsoft.com/en-us/azure/event-hubs/event-hubs-about)
  - [Azure Service Bus](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messaging-overview)
- MongoDB (either a local instance, MongoDB Atlas hosted, or an Azure-hosted instance)
- Node.js (v20.13 or later)
- npm (v6.x or later)
- TypeScript (v5.x or later)

## Installation

1. **Clone the repository**

   ```bash
   git clone git@github.com:RyadPasha/azure-event-hub-data-processor.git
   cd azure-event-hub-data-processor
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with the following content (Or copy and adjust the .env.example file)

   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/event_hub_data?retryWrites=true&w=majority&appName=Cluster0s
   AZURE_EVENT_HUB_CONNECTION_STRING=<event-hub-connection-string>
   AZURE_SERVICE_BUS_CONNECTION_STRING=<service-bus-connection-string>
   ```

   Replace `<username>`, `<password>`, and `<cluster>` with your MongoDB credentials and cluster details. Also, replace the placeholders for Azure Event Hub and Service Bus connection strings.

## Running the Application

1. **Start the NestJS application for receiving, processing, and storing events**

   ```bash
   npm run receiver
   ```

   This command will start the NestJS application. The application will listen for events from the Azure Event Hub, process them, and store the results in MongoDB.

2. **Send Sample Messages**

   To test the data flow, use the `sendSampleMessages.ts` script to send sample events to the Azure Event Hub.

   ```bash
   npm run sender
   ```

   This script sends predefined sample messages to the Event Hub for testing purposes.

## Project Structure

```plaintext
azure-event-hub-data-processor/
├── src/
│   ├── app.module.ts
│   ├── event-hub/
│   │   ├── event-hub.module.ts
│   │   └── event-hub.service.ts
│   ├── service-bus/
│   │   ├── service-bus.module.ts
│   │   ├── service-bus.service.ts
│   │   └── queue-listener.service.ts
│   ├── schemas/
│   │   └── message.schema.ts
│   ├── main.ts
├── scripts/
│   └── sendSampleMessages.ts
├── .env
├── nest-cli.json
├── package.json
├── tsconfig.build.json
├── tsconfig.json
```

### Explanation of Key Files

- **src/app.module.ts**: Main application module that imports necessary modules and sets up the application.
- **src/event-hub/event-hub.module.ts**: Module for the Event Hub service.
- **src/event-hub/event-hub.service.ts**: Service that listens to the Azure Event Hub and processes incoming events.
- **src/service-bus/service-bus.module.ts**: Module for the Service Bus service.
- **src/service-bus/service-bus.service.ts**: Service that sends messages to the Azure Service Bus queues.
- **src/service-bus/queue-listener.service.ts**: Service that listens to the Service Bus queues and stores messages in MongoDB.
- **src/schemas/message.schema.ts**: MongoDB schema definition for the messages.
- **scripts/sendSampleMessages.ts**: Script to send sample messages to the Azure Event Hub.

### Logging

The application uses NestJS's built-in logging functionality to log important events, including:

- Event reception in `EventHubService`.
- Message sending in `ServiceBusService`.
- Message processing and storage in `QueueListenerService`.

## Testing

The application includes basic unit tests for the main services. To run the tests, use the following command:

```bash
npm run test
```
