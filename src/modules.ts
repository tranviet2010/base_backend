import { BullModule } from '@nestjs/bull';
import { CacheModule, Logger } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import * as redisStore from 'cache-manager-redis-store';
import { ConsoleModule } from 'nestjs-console';
import { mongodb } from 'src/configs/database.config';
import { redisConfig } from 'src/configs/redis.config';
import { HttpClientModule } from 'src/shares/http-clients/http.module';
import { UploadModule } from './modules/upload/upload.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { MessageModule } from './modules/message/message.module';
import { CrudModule } from './modules/testcrud/crud.module';
import { ClientModule } from './modules/client/client.module';

const Modules = [
  Logger,
  MongooseModule.forRoot(mongodb.uri, mongodb.options),
  ScheduleModule.forRoot(),
  ConsoleModule,
  HttpClientModule,
  BullModule.forRoot({
    redis: redisConfig,
  }),
  CacheModule.register({
    store: redisStore,
    ...redisConfig,
    isGlobal: true,
  }),
  AuthModule,
  UploadModule,
  UsersModule,
  MailModule,
  MessageModule,
  CrudModule,
  ClientModule
];
export default Modules;
