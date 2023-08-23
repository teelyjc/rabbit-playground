import { MessageBroker } from "@/core/MessageBroker";
import { Logger } from "@/utils/Logger";

export class BrokerCore {
  private readonly logger: Logger = new Logger(BrokerCore.name);
  private readonly messageBroker: MessageBroker = new MessageBroker();

  public async start(): Promise<void> {
  }

  public async stop(): Promise<void> {
  }
}
