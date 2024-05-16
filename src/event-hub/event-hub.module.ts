import { Module } from '@nestjs/common';
import { EventHubService } from './event-hub.service';
import { ConfigModule } from '@nestjs/config';
import { ServiceBusModule } from '../service-bus/service-bus.module';

@Module({
  imports: [ConfigModule, ServiceBusModule],
  providers: [EventHubService],
})
export class EventHubModule {}
