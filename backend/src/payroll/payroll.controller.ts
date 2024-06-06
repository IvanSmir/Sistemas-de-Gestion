import {
  Controller,
  Get,
  Post,
  Param,
  ParseUUIDPipe,
  Delete,
} from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { Users } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Payroll')
@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new payroll' })
  @ApiResponse({
    status: 201,
    description: 'Payroll created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@GetUser() user: Users) {
    return this.payrollService.create(user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payrolls' })
  @ApiResponse({
    status: 200,
    description: 'Payrolls retrieved successfully.',
  })
  findAll() {
    return this.payrollService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a payroll by ID' })
  @ApiResponse({
    status: 200,
    description: 'Payroll retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Payroll not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.payrollService.findOne(id);
  }

  @Post(':id/createPayments')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create payments for a payroll period' })
  @ApiResponse({
    status: 201,
    description: 'Payments created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createPayments(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: Users,
  ) {
    return this.payrollService.createPayments(id, user);
  }

  @Post(':id/createPayments/:employeeId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a payment for a specific employee' })
  @ApiResponse({
    status: 201,
    description: 'Payment created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @GetUser() user: Users,
  ) {
    return this.payrollService.createPaymentforEmployee(id, employeeId, user);
  }

  @Post(':id/closePayrollPeriod')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Close a payroll period' })
  @ApiResponse({
    status: 200,
    description: 'Payroll period closed successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  closePayrollPeriod(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: Users,
  ) {
    return this.payrollService.closePayrollPeriod(id, user);
  }

  @Delete(':id/removePayrollPeriod')
  @ApiOperation({ summary: 'Remove a payroll period' })
  @ApiResponse({
    status: 200,
    description: 'Payroll period removed successfully.',
  })
  @ApiResponse({ status: 404, description: 'Payroll period not found.' })
  removePayrollPeriod(@Param('id', ParseUUIDPipe) id: string) {
    return this.payrollService.removePayrollPeriod(id);
  }

  @Post(':id/verifyPayrollDetails/:periodDetailsId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify payroll details' })
  @ApiResponse({
    status: 200,
    description: 'Payroll details verified successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  verifyPayrollDetails(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('periodDetailsId', ParseUUIDPipe) periodDetailsId: string,
    @GetUser() user: Users,
  ) {
    return this.payrollService.verifyPayrollDetails(user, periodDetailsId);
  }
}
