import { IsNotEmpty } from 'class-validator';
import { IsCedulaOrRUC } from '../decorators/is-ci-ruc.decorator';

export class FindPersonDto {
  @IsNotEmpty()
  @IsCedulaOrRUC({
    message: 'The value must be a valid Paraguayan Cédula or RUC',
  })
  ciRuc: string;
}
