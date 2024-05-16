/**
 * Interacts with Azure Service Bus.
 * Provides functionality to send messages to specified Service Bus queues.
 *
 * @author    Mohamed Riyad <m@ryad.me>
 * @link      https://ryadpasha.com
 */

import { Injectable, Logger } from '@nestjs/common';
import { ServiceBusClient } from '@azure/service-bus';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ServiceBusService {
  private readonly logger = new Logger(ServiceBusService.name);
  private client: ServiceBusClient;

  /**
   * Constructor initializes the ServiceBusClient using the connection string from configuration.
   * @param configService - Service to access environment variables and configuration.
   */
  constructor(private configService: ConfigService) {
    // Retrieve the Azure Service Bus connection string from the configuration service.
    const connectionString = this.configService.get<string>(
      'AZURE_SERVICE_BUS_CONNECTION_STRING',
    );
    // Initialize the Service Bus client with the connection string.
    this.client = new ServiceBusClient(connectionString);
  }

  /**
   * Sends a message to the specified Service Bus queue.
   * @param queueName - The name of the queue to send the message to.
   * @param message   - The message content to be sent.
   */
  async sendMessage(queueName: string, message: any) {
    // Create a sender for the specified queue.
    const sender = this.client.createSender(queueName);
    try {
      // Send the message to the queue.
      await sender.sendMessages({ body: message });
      this.logger.log(
        `Message sent to queue ${queueName}: ${JSON.stringify(message)}`,
      );
    } catch (error) {
      // Log an error if the message sending fails.
      this.logger.error(
        `Error sending message to queue ${queueName}: ${error.message}`,
      );
    } finally {
      // Ensure the sender is closed after the operation.
      await sender.close();
    }
  }
}
