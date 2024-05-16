import { Test, TestingModule } from '@nestjs/testing';
import { EventHubService } from './event-hub.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServiceBusService } from '../service-bus/service-bus.service';

describe('EventHubService', () => {
  let service: EventHubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        EventHubService,
        ConfigService,
        {
          provide: ServiceBusService,
          useValue: {
            sendMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventHubService>(EventHubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
