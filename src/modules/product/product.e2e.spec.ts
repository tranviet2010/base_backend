import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { SuperTest, Test } from 'supertest';
import * as dotenv from 'dotenv';
dotenv.config();

describe('PRODUCT (e2e)', () => {
  let app: SuperTest<Test>;

  beforeEach(() => {
    app = request(process.env.APP_URL);
  });

  it('/products (GET)', async () => {
    const response = await app.get(`/product?sort=1&page=1&limit=10`);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.data).toBeDefined();
  });
});
