import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { FindPersonDto } from 'src/person/dto/find-person.dto';

@Injectable()
export class ValidateCiRucPipe implements PipeTransform<string> {
  async transform(value: string, { metatype }: ArgumentMetadata) {
    const object = { ciRuc: value };
    const dto = plainToClass(FindPersonDto, object);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(
        'The value must be a valid Paraguayan Cédula or RUC',
      );
    }
    return value;
  }
}
