/**
 * Consumes/receives events from Azure Event Hub and sends them to the appropriate Service Bus queues.
 * Implements OnModuleInit to start listening on module initialization.
 *
 * @author    Mohamed Riyad <m@ryad.me>
 * @link      https://ryadpasha.com
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  EventHubConsumerClient,
  earliestEventPosition,
} from '@azure/event-hubs';
import { ConfigService } from '@nestjs/config';
import { ServiceBusService } from '../service-bus/service-bus.service';

@Injectable()
export class EventHubService implements OnModuleInit {
  private readonly logger = new Logger(EventHubService.name);
  private client: EventHubConsumerClient;
  private readonly typeNames = ['high-priority', 'low-priority', 'default'];

  /**
   * Initializes the EventHubService with necessary dependencies.
   * @param configService     - Service to access environment variables and configuration.
   * @param serviceBusService - Service responsible for sending messages to Service Bus queues.
   */
  constructor(
    private configService: ConfigService,
    private serviceBusService: ServiceBusService,
  ) {}

  /**
   * Method called on module initialization to start listening to the Event Hub.
   * Subscribes to the Event Hub and processes incoming events.
   */
  async onModuleInit() {
    const connectionString = this.configService.get<string>(
      'AZURE_EVENT_HUB_CONNECTION_STRING',
    );
    const consumerGroup = '$Default';
    const eventHubName = 'EventHub';

    // Initialize the Event Hub consumer client with the connection string, consumer group, and Event Hub name.
    this.client = new EventHubConsumerClient(
      consumerGroup,
      connectionString,
      eventHubName,
    );

    // Subscribe to the Event Hub to process events and handle errors.
    this.client.subscribe(
      {
        /**
         * Processes received events by logging and sending them to the appropriate Service Bus queue.
         * @param events - Array of events received from the Event Hub.
         */
        processEvents: async (events) => {
          for (const event of events) {
            const type = this.typeNames.includes(event.body.type)
              ? event.body.type
              : 'default';

            this.logger.log(`Received event: ${JSON.stringify(event.body)}`);

            // Determine the queue name based on event type and send the event to the Service Bus.
            const queueName = this.determineQueue(type);
            await this.serviceBusService.sendMessage(queueName, event.body);
          }
        },
        /**
         * Handles errors encountered during event processing.
         * @param err - The error encountered.
         */
        processError: async (err) => {
          this.logger.error(`Error processing event: ${err.message}`);
        },
      },
      { startPosition: earliestEventPosition },
    );
  }

  /**
   * Determines the appropriate Service Bus queue name based on the event type.
   * @param eventBody - The body of the event.
   * @returns         The name of the Service Bus queue.
   */
  private determineQueue(eventBody: any): string {
    return `${eventBody}-queue`;
  }
}
