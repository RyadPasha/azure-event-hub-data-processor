import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EventHubModule } from './event-hub/event-hub.module';
import { ServiceBusModule } from './service-bus/service-bus.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    EventHubModule,
    ServiceBusModule,
  ],
})
export class AppModule {}
