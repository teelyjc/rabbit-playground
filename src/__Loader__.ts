import { BrokerCore } from "@/BrokerCore";
import { Logger } from "@/utils/Logger";

const main = async () => {
  const brokerCore = new BrokerCore();
  const logger = new Logger(`Loader`);

  try {
    await brokerCore.start();
  } catch (error: any) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
    await brokerCore.stop();
  }
}

main();
