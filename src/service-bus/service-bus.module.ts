import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceBusService } from './service-bus.service';
import { QueueListenerService } from './queue-listener.service';
import { Message, MessageSchema } from '../schemas/message.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  providers: [ServiceBusService, QueueListenerService],
  exports: [ServiceBusService],
})
export class ServiceBusModule {}
