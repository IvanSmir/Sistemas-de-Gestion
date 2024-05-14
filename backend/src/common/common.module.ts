import { Module } from '@nestjs/common';
import { HandleDbErrorService } from './services/handle-db-error.service';

@Module({
  providers: [HandleDbErrorService],
  exports: [HandleDbErrorService],
})
export class CommonModule {}
