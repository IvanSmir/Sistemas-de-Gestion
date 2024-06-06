import { Controller, Get, Param } from '@nestjs/common';
import { PersonService } from './person.service';
import { ValidateCiRucPipe } from 'src/common/pipes/ci-ruc-pipe/ci-ruc-pipe.pipe';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Person')
@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get(':ciRuc')
  @ApiOperation({ summary: 'Find a person by CI/RUC' })
  @ApiResponse({
    status: 200,
    description: 'Person retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Person not found.' })
  findOne(@Param('ciRuc', ValidateCiRucPipe) ciRuc: string) {
    return this.personService.findOne(ciRuc);
  }
}
