import { Module } from '@nestjs/common';
import { SourceService } from './source.service';
import { SourceController } from './source.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Department, DepartmentSchema } from '../department/schemas/department.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Department.name, schema: DepartmentSchema }])],
  providers: [SourceService],
  controllers: [SourceController],
})
export class SourceModule {}
