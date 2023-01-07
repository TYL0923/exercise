import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { QuestionModule } from './modules/question/question.module';
import { QuestionSetModule } from './modules/question-set/question-set.module';
import { AnswerKeyModule } from './modules/answer-key/answer-key.module';
// import { TagModule } from './modules/tag/tag.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '47.113.144.160',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'exercise',
      autoLoadEntities: true,
      synchronize: false,
    }),
    UserModule,
    QuestionModule,
    QuestionSetModule,
    AnswerKeyModule,
    // TagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
