import * as dotenv from "dotenv";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { InterfacesModule } from "./interfaces/interfaces.module";
import { ApplicationModule } from "./application/application.module";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";

dotenv.config({ quiet: true });
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

@Module({
  imports: [
    MongooseModule.forRoot(databaseUrl),
    InfrastructureModule,
    ApplicationModule,
    InterfacesModule,
  ],
})
export class AppModule {}
