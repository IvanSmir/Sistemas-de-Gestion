import { Controller, Get, Param } from '@nestjs/common';
import { PersonService } from './person.service';
import { FindPersonDto } from './dto/find-person.dto';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}
  @Get(':ciRuc')
  findOne(@Param('ciRuc') ciRuc: FindPersonDto) {
    return this.personService.findOne(ciRuc);
  }
}
