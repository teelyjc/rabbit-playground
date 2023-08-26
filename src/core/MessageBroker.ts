import { Logger } from "@/utils/Logger";

import { connect } from "amqplib";
import type { Connection, Channel } from "amqplib";

import "dotenv/config";

export class MessageBroker {
  private readonly logger: Logger = new Logger(MessageBroker.name);

  private connection!: Connection;
  private channel!: Channel;

  private async init(): Promise<void> {
    const { RMQ_USERNAME, RMQ_PASSWORD, RMQ_HOST, RMQ_PORT } = process.env;

    if (!RMQ_USERNAME || !RMQ_USERNAME || !RMQ_PASSWORD || !RMQ_HOST) {
      throw new Error("Please define RMQ_* at .env !")
    }

    this.connection = await connect(`amqp://${RMQ_USERNAME}:${RMQ_PASSWORD}@${RMQ_HOST}:${RMQ_PORT}`);
    this.channel = await this.connection.createChannel();
  }

  public async subscribe<T>(
    queueName: string,
    concurrentQueue: number = 1,
    handler: (
      pattern: string,
      data: T,
      ackFunction: (handler?: () => void | Promise<void>) => void
    ) => void | Promise<void>,
  ) {
    if (!this.connection) {
      await this.init();
    }

    await this.channel.prefetch(concurrentQueue);
    await this.channel.assertQueue(queueName, {
      durable: true
    });

    await this.channel.consume(queueName, async (message) => {
      if (!message) return;

      const { pattern, data }: { pattern: string; data: T } =
        JSON.parse(message.content.toString());

      await handler(pattern, data, async (handler) => {
        this.channel.ack(message);
        handler && await handler();
      });
    })

    this.logger.info(`Started listening ${queueName} queue.`)
  }
}
