import { Controller, Get, Param } from '@nestjs/common';
import { PersonService } from './person.service';
import { FindPersonDto } from './dto/find-person.dto';
import { ValidateCiRucPipe } from 'src/common/pipes/ci-ruc-pipe/ci-ruc-pipe.pipe';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}
  @Get(':ciRuc')
  findOne(@Param('ciRuc', ValidateCiRucPipe) ciRuc: string) {
    return this.personService.findOne(ciRuc);
  }
}
