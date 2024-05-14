import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class HandleDbErrorService {
  handleDbError(e: any, type: string, value: string) {
    console.error(e);
    if (e.code === 'P2002') {
      throw new BadRequestException(`${type} with ${value} already exists`);
    }

    if (e.code === 'P2025') {
      throw new BadRequestException(`The provided ${type} does not exist)`);
    }

    throw new InternalServerErrorException(
      'An error occurred while processing the request, please try again later.',
    );
  }
}
