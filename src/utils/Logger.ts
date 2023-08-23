import { createLogger, transports, format } from "winston";
import { Logger as WinstonLogger } from "winston";

export class Logger {
  private readonly logger: WinstonLogger;

  public constructor(className: string) {
    this.logger = createLogger({
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      format: format.combine(
        format.json(),
        format.colorize(),
        format.splat(),
        format.errors({ stack: true }),
      ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.printf((info) => {
              const timestamp = new Date().toUTCString();
              return `${timestamp} | ${info.level} | ${className} | ${info.message}`;
            })
          )
        })
      ]
    })
  }

  public debug(message: string): void {
    this.logger.debug(message);
  }

  public info(message: string): void {
    this.logger.info(message);
  }
  public error(message: string): void {
    this.logger.error(message);
  }
  public warn(message: string): void {
    this.logger.warn(message);
  }
}
