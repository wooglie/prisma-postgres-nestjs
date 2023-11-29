import { Configuration } from '@/core/config/configuration';
// import { WinstonTransport as AxiomTransport } from '@axiomhq/axiom-node';
import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClsService } from 'nestjs-cls';
import * as winston from 'winston';

@Injectable({ scope: Scope.DEFAULT })
export class LoggerService {
  private context = 'UNKNOWN';
  private logger: winston.Logger;

  constructor(
    private readonly cls: ClsService,
    private readonly configService: ConfigService<Configuration, true>,
  ) {
    // Enhance dev format
    const devFormat = winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.timestamp(),

      winston.format.json(),
      winston.format.prettyPrint(),
    );

    const prodFormat = winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.timestamp(),
      winston.format.json(),
    );

    const logLevel = this.configService.get('app.logLevel', { infer: true });
    const isLocalEnvironment = this.configService.get(
      'app.isLocalEnvironment',
      { infer: true },
    );

    this.logger = winston.createLogger({
      exitOnError: false,
      level: logLevel,
      transports: [
        new winston.transports.Console({
          handleExceptions: true,
          format: winston.format.colorize({
            all: true,
            colors: {
              error: 'redBG white',
              warn: 'yellowBG black',
              info: 'white',
              debug: 'bold blue',
            },
          }),
        }),
      ],
      format: isLocalEnvironment ? devFormat : prodFormat,
    });

    // if (!isLocalEnvironment) {
    //   // Intentionally hardcoded for now so we can see our logs in Axiom
    //   // Once verified, we'll create devops tickets and do it the right way
    //   this.logger.add(
    //     new AxiomTransport({
    //       dataset: 'beam-account-service',
    //       token: 'xaat-36fe4afd-02e5-4ee8-a627-83429edaeacb', // temporary token that will be rotated
    //       orgId: 'merit-circle-lpk3',
    //     }),
    //   );
    // }
  }

  setContext(context: string) {
    this.context = context;
  }

  // Should be called only once in main.ts file to register exception handler
  setListeners() {
    this.logger.transports[0].handleExceptions = true;
    this.logger.transports[0].handleRejections = true;
  }

  private logMessage(
    level: string,
    message: object | string,
    context?: string,
  ) {
    const environment = this.configService.get('app.environment', {
      infer: true,
    });
    const isLocalEnvironment = this.configService.get(
      'app.isLocalEnvironment',
      { infer: true },
    );
    const requestId = this.cls.getId();
    const metadata = {
      requestId,
      context: context || this.context,
    };

    this.logger.log(level, {
      ...metadata,
      environment,
      message: isLocalEnvironment ? message : JSON.stringify(message),
    });
  }

  private logError(error: Error, context?: string) {
    // Logs additional error message to capture metadata
    this.logMessage('error', error.message, context);
    // Logs stack
    this.logger.error(error);
  }

  log(message: object | string, context?: string) {
    this.logMessage('info', message, context);
  }

  error(error: Error, context?: string) {
    this.logError(error, context);
  }

  warn(message: object | string, context?: string) {
    this.logMessage('warn', message, context);
  }

  debug(message: object | string, context?: string) {
    this.logMessage('debug', message, context);
  }

  verbose(message: object | string, context?: string) {
    this.logMessage('verbose', message, context);
  }
}
