import { Controller, Get, Param } from '@nestjs/common';
import { PersonService } from './person.service';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}
  @Get(':ciRuc')
  findOne(@Param('ciRuc') ciRuc: string) {
    return this.personService.findOne(ciRuc);
  }
}
