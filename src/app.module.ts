import { Module } from '@nestjs/common';
import { resources } from './resource';

@Module({
  imports: [...resources],
  controllers: [],
  providers: [],
})
export class AppModule {}
