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
import { Auth } from 'src/auth/decorators/auth.decorator';

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
  @Auth()
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
  @Auth()
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
  @Auth()
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
  @Auth()
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
  @Auth()
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
  @Auth()
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
    return this.payrollService.verifyPayrollDetails(user, periodDetailsId, id);
  }

  @Post(':id/familyBonification')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Calculate family bonus' })
  @ApiResponse({
    status: 200,
    description: 'Family bonus calculated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  calculateFamilyBonification(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: Users,
  ) {
    return this.payrollService.calculateBonificationForAllEmployees(user);
  }

  @Post(':id/ips')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Calculate IPS' })
  @ApiResponse({
    status: 200,
    description: 'IPS calculated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  calculateIps(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: Users) {
    return this.payrollService.calculateIpsForAllEmployees(user);
  }

  @Post(':id/ips/:payrollDetailId')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create IPS payment' })
  @ApiResponse({
    status: 200,
    description: 'IPS payment created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createIpsPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('payrollDetailId', ParseUUIDPipe) payrollDetailId: string,
    @GetUser() user: Users,
  ) {
    return this.payrollService.createOrUpdateIPS(payrollDetailId, user);
  }

  @Post(':id/bonusFamiliar/:payrollDetailId')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Bonus Familiar payment' })
  @ApiResponse({
    status: 200,
    description: 'Bonus Familiar payment created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createBonusFamiliarPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('payrollDetailId', ParseUUIDPipe) payrollDetailId: string,
    @GetUser() user: Users,
  ) {
    return this.payrollService.createOrUpdateBonificationFamiliar(
      payrollDetailId,
      user,
    );
  }

  @Get(':id/payrollDetails/:payrollDetailId')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payroll details' })
  @ApiResponse({
    status: 200,
    description: 'Payroll details retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Payroll details not found.' })
  findPayrollDetails(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('payrollDetailId', ParseUUIDPipe) payrollDetailId: string,
  ) {
    return this.payrollService.findPayrollDetails(id, payrollDetailId);
  }

  @Get('lastPaymnets')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get last payments' })
  @ApiResponse({
    status: 200,
    description: 'Payments retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Payments not found.' })
  findLastPayments() {
    return this.payrollService.getLastPaymnets();
  }

  @Get('lastTopEmployeesByIncome')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get top employees by income' })
  @ApiResponse({
    status: 200,
    description: 'Top employees retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Top employees not found.' })
  findLastTopEmployeesByIncome() {
    return this.payrollService.getLastTopEmployeesByIncome();
  }

  
}
