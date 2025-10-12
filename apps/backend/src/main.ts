import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, VersioningType, INestApplication } from "@nestjs/common";
import * as dotenv from "dotenv";

// Immediately Invoked Function Expression (IIFE) to allow use of async/await at the top level
// and to encapsulate the application bootstrap logic
// This pattern also helps in managing the application lifecycle and error handling
// by allowing us to use try/catch and ensure proper cleanup on failure.
void (async () => {
  let app: INestApplication | undefined;
  const logger = new Logger("Bootstrap");

  try {
    app = await NestFactory.create(AppModule);

    // Enable CORS with environment-based origin
    app.enableCors({
      origin: process.env.CORS_ORIGIN ?? "*",
      credentials: true,
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });

    // Set global API prefix and versioning
    app.setGlobalPrefix("api");
    app.enableVersioning({
      type: VersioningType.URI,
      prefix: "v",
    });

    dotenv.config({ quiet: true });
    logger.log("Environment variables loaded");
    logger.debug(`Current Environment: ${process.env.NODE_ENV || "development"}`);
    logger.debug(`Log Level: ${process.env.LOG_LEVEL || "not set"}`);
    logger.debug(`CORS Origin: ${process.env.CORS_ORIGIN || "*"}`);

    // Start the application
    const port = parseInt(process.env.PORT ?? "3001", 10);
    await app.listen(port);
    logger.log(`Application is running on http://localhost:${port}`);
  } catch (error) {
    // Safely normalize the caught value to an Error for logging
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error("Application failed to start", err.stack ?? err.message);

    if (app) {
      try {
        await app.close();
        logger.log("Application closed due to startup error");
      } catch (closeError) {
        const cerr = closeError instanceof Error ? closeError : new Error(String(closeError));
        logger.error("Failed to close application gracefully", cerr.stack ?? cerr.message);
      }
    }

    process.exit(1); // Exit with failure
  }
})();
