import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HandleDbErrorService } from 'src/common/services/handle-db-error.service';

@Injectable()
export class PayrollService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly handleDbErrorService: HandleDbErrorService,
  ) {}

  async create(user: Users) {
    try {
      const payroll = await this.prismaService.payrollPeriods.create({
        data: {
          userId: user.id,
          periodStart: new Date(),
        },
      });
      return payroll;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Payroll', '');
    }
  }

  async findAll() {
    try {
      const payrolls = await this.prismaService.payrollPeriods.findMany({
        select: {
          id: true,
          periodStart: true,
          periodEnd: true,
          isEnded: true,
          DetailsWithoutVerification: true,
        },
      });
      return payrolls;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Payroll', '');
    }
  }

  async findOne(id: string) {
    try {
      const payroll = await this.prismaService.payrollPeriods.findUnique({
        where: { id },
        select: {
          id: true,
          periodStart: true,
          periodEnd: true,
          isEnded: true,
          DetailsWithoutVerification: true,
          payrollDetails: {
            select: {
              id: true,
              periodId: true,
              employeeId: true,
              userId: true,
              amount: true,
              payrollItems: {
                select: {
                  id: true,
                  payrollDetailId: true,
                  isIncome: true,
                  amount: true,
                },
              },
            },
          },
        },
      });
      return payroll;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Payroll', id);
    }
  }

  async createPaymentforEmployee(
    periodId: string,
    employeeId: string,
    user: Users,
  ) {
    try {
      const payrollDetails = await this.prismaService.payrollDetails.create({
        data: {
          periodId,
          employeeId,
          userId: user.id,
        },
      });

      await this.prismaService.payrollPeriods.update({
        where: { id: periodId },
        data: {
          DetailsWithoutVerification: {
            increment: 1,
          },
        },
      });
      let PaymentTotal = 0;
      let PaymentDeductibleTotal = 0;

      // Creación de ítems de nómina para salarios
      const salaries = await this.prismaService.employeeDetails.findMany({
        where: { employeeId, isActive: true },
        select: { salary: true },
      });

      const payrollItemsSalariesPromises = salaries.map(async (salary) => {
        const payrollItem = await this.prismaService.payrollItems.create({
          data: {
            payrollDetailId: payrollDetails.id,
            userId: user.id,
            isIncome: true,
            amount: salary.salary,
          },
        });
        PaymentTotal += salary.salary;
        PaymentDeductibleTotal += salary.salary;
        return payrollItem;
      });
      const payrollItemsSalaries = await Promise.all(
        payrollItemsSalariesPromises,
      );

      // Creación de ítems de nómina para ingresos
      const incomes = await this.prismaService.income.findMany({
        where: { employeeId, active: true },
        select: {
          amount: true,
          incomeType: {
            select: { name: true, deductible: true },
          },
        },
      });

      const payrollItemsIncomesPromises = incomes.map(async (income) => {
        const payrollItem = await this.prismaService.payrollItems.create({
          data: {
            payrollDetailId: payrollDetails.id,
            userId: user.id,
            isIncome: true,
            amount: income.amount,
          },
        });
        PaymentTotal += income.amount;
        PaymentDeductibleTotal += income.incomeType.deductible
          ? income.amount
          : 0;
        return payrollItem;
      });

      const payrollItemsIncomes = await Promise.all(
        payrollItemsIncomesPromises,
      );

      // Creación de ítems de nómina para gastos
      const expenses = await this.prismaService.expenses.findMany({
        where: { employeeId, active: true },
        select: { amount: true },
      });

      const payrollItemsExpensesPromises = expenses.map(async (expense) => {
        const payrollItem = await this.prismaService.payrollItems.create({
          data: {
            payrollDetailId: payrollDetails.id,
            userId: user.id,
            isIncome: false,
            amount: expense.amount,
          },
        });
        PaymentTotal -= expense.amount;
        return payrollItem;
      });

      const payrollItemsExpenses = await Promise.all(
        payrollItemsExpensesPromises,
      );

      // Creación del ítem de IPS
      const ips = await this.prismaService.basicConfig.findFirst({
        where: { name: 'IPS' },
        select: { value: true },
      });
      const ipsAmount = (PaymentDeductibleTotal * ips.value) / 100;
      const payrollItemIps = await this.prismaService.payrollItems.create({
        data: {
          payrollDetailId: payrollDetails.id,
          userId: user.id,
          isIncome: false,
          amount: ipsAmount,
        },
      });
      PaymentTotal -= ipsAmount;

      // Creación del ítem de bonificación familiar
      const currentDate = new Date();
      const eighteenYearsAgo = new Date(
        currentDate.getFullYear() - 18,
        currentDate.getMonth(),
        currentDate.getDate(),
      );

      const familiares = await this.prismaService.familyMembers.findMany({
        where: {
          employeeId,
          AND: [
            {
              person: {
                birthDate: {
                  gte: eighteenYearsAgo,
                },
              },
            },
            {
              familyType: {
                name: {
                  in: ['Hijo', 'Hija'],
                },
              },
            },
          ],
        },
        select: {
          id: true,
        },
      });

      const bonificacionFamiliarPercentage =
        await this.prismaService.basicConfig.findFirst({
          where: { name: 'Bonificacion Familiar' },
          select: { value: true },
        });

      const BonificationAmount =
        salaries.reduce((acc, salary) => acc + salary.salary, 0) *
        (bonificacionFamiliarPercentage.value / 100) *
        familiares.length;

      const payrollItemsFamiliar = await this.prismaService.payrollItems.create(
        {
          data: {
            payrollDetailId: payrollDetails.id,
            userId: user.id,
            isIncome: true,
            amount: BonificationAmount,
          },
        },
      );

      PaymentTotal += BonificationAmount;

      // Creación del objeto de retorno
      const returnItems = [
        ...payrollItemsSalaries,
        ...payrollItemsIncomes,
        ...payrollItemsExpenses,
        payrollItemIps,
        payrollItemsFamiliar,
      ];

      return { items: returnItems, total: PaymentTotal };
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Payroll', '');
    }
  }

  async createPayments(periodId: string, user: Users) {
    try {
      const employees = await this.prismaService.employees.findMany({
        where: { isDeleted: false },
        select: { id: true },
      });

      const payrollDetailsPromises = employees.map(async (employee) => {
        const payments = await this.createPaymentforEmployee(
          periodId,
          employee.id,
          user,
        );
        return payments;
      });

      const payrollDetails = await Promise.all(payrollDetailsPromises);

      return payrollDetails;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Payroll', '');
    }
  }

  async deactivateIncome(user: Users, employeeId: string) {
    try {
      const incomes = await this.prismaService.income.updateMany({
        where: { employeeId, active: true },
        data: { active: false, userId: user.id },
      });
      return incomes;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Payroll', '');
    }
  }

  async deactivateExpense(user: Users, employeeId: string) {
    try {
      const expenses = await this.prismaService.expenses.updateMany({
        where: { employeeId, active: true },
        data: { active: false, userId: user.id },
      });
      return expenses;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Payroll', '');
    }
  }

  async closePayrollPeriod(periodId: string, user: Users) {
    try {
      const payrollDetails = await this.prismaService.payrollDetails.findMany({
        where: { periodId },
        select: {
          employeeId: true,
        },
      });

      const closeIncomePromises = payrollDetails.map(async (payrollDetail) => {
        const incomes = await this.deactivateIncome(
          user,
          payrollDetail.employeeId,
        );
        return incomes;
      });

      const closeExpensePromises = payrollDetails.map(async (payrollDetail) => {
        const expenses = await this.deactivateExpense(
          user,
          payrollDetail.employeeId,
        );
        return expenses;
      });

      const closeIncome = await Promise.all(closeIncomePromises);
      const closeExpense = await Promise.all(closeExpensePromises);

      const payrollPeriod = await this.prismaService.payrollPeriods.update({
        where: { id: periodId },
        data: {
          isEnded: true,
          userId: user.id,
        },
      });
      return payrollPeriod;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Payroll', '');
    }
  }

  async removePayrollPeriod(periodId: string) {
    try {
      // Eliminar todos los payrollItems relacionados
      const payroll = await this.prismaService.payrollPeriods.findUnique({
        where: { id: periodId },
        select: {
          id: true,
          isEnded: true,
        },
      });

      if (payroll.isEnded) {
        throw new BadRequestException('Payroll period already ended');
      }

      const payrollDetails = await this.prismaService.payrollDetails.findMany({
        where: { periodId },
        select: { id: true },
      });

      const payrollDetailIds = payrollDetails.map((detail) => detail.id);

      await this.prismaService.payrollItems.deleteMany({
        where: { payrollDetailId: { in: payrollDetailIds } },
      });

      // Eliminar todos los payrollDetails relacionados
      await this.prismaService.payrollDetails.deleteMany({
        where: { periodId },
      });

      // Finalmente, eliminar el payrollPeriod
      const deletedPayrollPeriod =
        await this.prismaService.payrollPeriods.delete({
          where: { id: periodId },
        });

      return deletedPayrollPeriod;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Payroll', periodId);
    }
  }

  async verifyPayrollDetails(user: Users, periodDetailsId: string) {
    try {
      const payrollDetails = await this.prismaService.payrollDetails.update({
        where: { id: periodDetailsId },
        data: {
          isVerified: true,
          userId: user.id,
        },
      });

      const payrollPeriod = await this.prismaService.payrollPeriods.update({
        where: { id: periodDetailsId },
        data: {
          isEnded: true,
          DetailsWithoutVerification: {
            decrement: 1,
          },
        },
      });

      return payrollDetails;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Payroll', '');
    }
  }
}
