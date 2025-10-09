import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";

const logger = new Logger("Bootstrap");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3001);
}
bootstrap()
  .then(() => {
    logger.log("Application is running on port " + (process.env.PORT || 3001));
  })
  .catch((err) => {
    logger.error("Error during app bootstrap:", err);
    process.exit(1);
  });
