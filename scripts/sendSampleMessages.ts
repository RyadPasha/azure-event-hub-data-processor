/**
 * Produces/sends sample messages to an Azure Event Hub.
 * It creates an Event Hub producer client, adds messages to a batch, and sends the batch to the Event Hub.
 *
 * @author    Mohamed Riyad <m@ryad.me>
 * @link      https://ryadpasha.com
 */

import { EventHubProducerClient } from '@azure/event-hubs';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();
const logger = new Logger('SENDER');

async function sendSampleMessages() {
  const connectionString = process.env.AZURE_EVENT_HUB_CONNECTION_STRING;
  const eventHubName = 'EventHub';

  // Initialize the Event Hub producer client with the connection string and Event Hub name
  const producer = new EventHubProducerClient(connectionString, eventHubName);

  // Create a batch to send
  const batch = await producer.createBatch();

  // Add messages to the batch
  batch.tryAdd({ body: { data: 'sample event msg 1', type: 'high-priority' } });
  batch.tryAdd({ body: { data: 'sample event msg 2', type: 'low-priority' } });
  batch.tryAdd({ body: { data: 'sample event msg 3', type: 'default' } });

  // Send the batch to the Event Hub
  await producer.sendBatch(batch);
  logger.log('Messages sent successfully.');

  // Close the producer to release resources
  await producer.close();
}

sendSampleMessages().catch((err) => {
  console.error('Error sending messages: ', err);
});
