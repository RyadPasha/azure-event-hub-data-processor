/**
 * Listens to Azure Service Bus queues and process messages.
 * Implements OnModuleInit to start listening on module initialization.
 *
 * @author    Mohamed Riyad <m@ryad.me>
 * @link      https://ryadpasha.com
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceBusClient } from '@azure/service-bus';
import { ConfigService } from '@nestjs/config';
import { Message } from '../schemas/message.schema';

@Injectable()
export class QueueListenerService implements OnModuleInit {
  private readonly logger = new Logger(QueueListenerService.name);
  private client: ServiceBusClient;

  /**
   * Constructor initializes the ServiceBusClient and the MongoDB model for messages.
   * @param configService - Service to access environment variables and configuration.
   * @param messageModel - MongoDB model for storing messages.
   */
  constructor(
    private configService: ConfigService,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {
    // Retrieve the Azure Service Bus connection string from the configuration service.
    const connectionString = this.configService.get<string>(
      'AZURE_SERVICE_BUS_CONNECTION_STRING',
    );
    // Initialize the Service Bus client with the connection string.
    this.client = new ServiceBusClient(connectionString);
  }

  /**
   * Method called on module initialization to start listening to Service Bus queues.
   * Subscribes to multiple queues and processes incoming messages.
   */
  async onModuleInit() {
    const queueNames = [
      'high-priority-queue',
      'low-priority-queue',
      'default-queue',
    ];
    for (const queueName of queueNames) {
      // Create a receiver for the specified queue.
      const receiver = this.client.createReceiver(queueName);
      receiver.subscribe({
        /**
         * Processes received messages by logging and storing them in MongoDB.
         * @param message - The message received from the queue.
         */
        processMessage: async (message) => {
          this.logger.log(
            `Received message from ${queueName}: ${JSON.stringify(message.body)}`,
          );
          // Store the message in MongoDB.
          const createdMessage = new this.messageModel({
            content: message.body,
          });
          await createdMessage.save();

          this.logger.log(
            `Stored message from ${queueName} in MongoDB: ${JSON.stringify(message.body)}`,
          );
        },
        /**
         * Handles errors encountered during message processing.
         * @param err - The error encountered.
         */
        processError: async (err) => {
          this.logger.error(`Error receiving message from ${queueName}`, err);
        },
      });
    }
  }
}
