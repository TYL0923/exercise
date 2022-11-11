import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './modules/user/user.module';
import { QuestionModule } from './modules/question/question.module';
import { NavModule } from './modules/nav/nav.module';
import { QuestionSetModule } from './modules/question-set/question-set.module';
import { AnswerKeyModule } from './modules/answer-key/answer-key.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'exercise',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    QuestionModule,
    NavModule,
    QuestionSetModule,
    AnswerKeyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}