import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';

// const origin = `
// 1、软件构造”指的是通过编码、验证、单元测试、（）的组合，详细地创建可工作的、有意义的软件。
// A、集成测试和调试  B、集成开发和单元调试  C、开发和调试  D、调试和测试

// 2、模块的独立程度可以由两个定性标准来度量（）
// A、内聚和耦合  B、内聚和聚合   C、外聚和内聚  D、偶然和内聚

// 3、泛化表示（），是一端带空心三角形的连线，从子类到父类，空心三角形一端是父类。
// A、泛化关系   B、继承关系   C、组合关系  D、聚合关系

// `;
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
});
