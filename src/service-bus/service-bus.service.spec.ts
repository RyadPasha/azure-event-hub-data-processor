import { Test, TestingModule } from '@nestjs/testing';
import { ServiceBusService } from './service-bus.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServiceBusClient } from '@azure/service-bus';

describe('ServiceBusService', () => {
  let service: ServiceBusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        ServiceBusService,
        ConfigService,
        {
          provide: ServiceBusClient,
          useValue: {
            createSender: jest.fn().mockReturnValue({
              sendMessages: jest.fn(),
              close: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ServiceBusService>(ServiceBusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send message to queue', async () => {
    const queueName = 'test-queue';
    const message = { body: 'test-message' };
    const senderMock = {
      sendMessages: jest.fn(),
      close: jest.fn(),
    };
    const clientMock = {
      createSender: jest.fn().mockReturnValue(senderMock),
    };

    jest
      .spyOn(service['client'], 'createSender')
      .mockReturnValue(clientMock.createSender(queueName));

    await service.sendMessage(queueName, message);

    expect(clientMock.createSender).toHaveBeenCalledWith(queueName);
    expect(senderMock.sendMessages).toHaveBeenCalledWith({ body: message });
    expect(senderMock.close).toHaveBeenCalled();
  });
});
