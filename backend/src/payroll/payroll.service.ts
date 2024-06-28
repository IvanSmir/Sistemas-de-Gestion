import { BadRequestException, Injectable } from '@nestjs/common';
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
        orderBy: {
          createdAt: 'desc',
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
              isVerified: true,
              payrollItems: {
                where: {
                  isDeleted: false,
                },
                select: {
                  amount: true,
                  description: true,
                  isIncome: true,
                  isIps: true,
                  isBonification: true,
                },
              },
              id: true,
              periodId: true,
              employeeId: true,
              userId: true,
              amount: true,
              employee: {
                select: {
                  id: true,
                  person: {
                    select: {
                      id: true,
                      name: true,
                      ciRuc: true,
                    },
                  },
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
      const existingPayrollDetails =
        await this.prismaService.payrollDetails.findMany({
          where: { periodId, employeeId },
          select: { id: true },
        });

      const payrollDetailIds = existingPayrollDetails.map(
        (detail) => detail.id,
      );

      if (payrollDetailIds.length > 0) {
        await this.prismaService.payrollItems.deleteMany({
          where: { payrollDetailId: { in: payrollDetailIds } },
        });
      }

      let payrollDetails;

      if (payrollDetailIds.length > 0) {
        payrollDetails = existingPayrollDetails[0];
      } else {
        payrollDetails = await this.prismaService.payrollDetails.create({
          data: {
            periodId,
            employeeId,
            userId: user.id,
          },
        });
      }

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
        where: {
          employeeId,
          isActive: true,
          OR: [
            {
              endDate: { gte: new Date() },
            },
            {
              endDate: { equals: null },
            },
          ],
          salary: { gt: 0 },
        },
        select: {
          salary: true,
          position: {
            select: {
              name: true,
            },
          },
        },
      });

      console.log('salaries', salaries);

      const payrollItemsSalariesPromises = salaries.map(async (salary) => {
        const payrollItem = await this.prismaService.payrollItems.create({
          data: {
            payrollDetailId: payrollDetails.id,
            userId: user.id,
            isIncome: true,
            amount: salary.salary,
            description: 'Salario de ' + salary.position.name,
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
            description: income.incomeType.name,
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
        select: { amount: true, expenseType: { select: { name: true } } },
      });

      const payrollItemsExpensesPromises = expenses.map(async (expense) => {
        const payrollItem = await this.prismaService.payrollItems.create({
          data: {
            payrollDetailId: payrollDetails.id,
            userId: user.id,
            isIncome: false,
            amount: expense.amount,
            description: expense.expenseType.name,
          },
        });
        PaymentTotal -= expense.amount;
        return payrollItem;
      });

      const payrollItemsExpenses = await Promise.all(
        payrollItemsExpensesPromises,
      );

      const ipsAmount = await this.createOrUpdateIPS(payrollDetails.id, user);
      PaymentTotal -= ipsAmount;

      const BonificationAmount = await this.createOrUpdateBonificationFamiliar(
        payrollDetails.id,
        user,
      );
      PaymentTotal += BonificationAmount;

      // Creación del objeto de retorno
      const returnItems = [
        ...payrollItemsSalaries,
        ...payrollItemsIncomes,
        ...payrollItemsExpenses,
      ];

      return { items: returnItems, total: PaymentTotal };
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Payroll', '');
    }
  }

  async createOrUpdateIPS(payrollDetailId: string, user: Users) {
    // Obtener el monto deducible total
    const payrollDetail = await this.prismaService.payrollDetails.findUnique({
      where: { id: payrollDetailId },
      select: {
        periodId: true,
        employeeId: true,
      },
    });

    const incomes = await this.prismaService.income.findMany({
      where: { employeeId: payrollDetail.employeeId, active: true },
      select: {
        amount: true,
        incomeType: {
          select: { deductible: true },
        },
      },
    });

    console.log('INCOMES:', incomes);

    const salaries = await this.prismaService.employeeDetails.findMany({
      where: { employeeId: payrollDetail.employeeId, isActive: true },
      select: { salary: true },
    });

    console.log('SALARIES:', salaries);

    let PaymentDeductibleTotal = incomes.reduce(
      (acc, income) => acc + (income.incomeType.deductible ? income.amount : 0),
      0,
    );

    PaymentDeductibleTotal += salaries.reduce(
      (acc, salary) => acc + (salary.salary ? salary.salary : 0),
      0,
    );

    // Calcular el monto de IPS
    const ips = await this.prismaService.basicConfig.findFirst({
      where: { name: 'IPS' },
      select: { value: true },
    });
    const ipsAmount = PaymentDeductibleTotal * (ips.value / 100);

    console.log('IPS AMOUNT:', ipsAmount);
    // Verificar si ya existe un ítem de IPS
    const existingIpsItem = await this.prismaService.payrollItems.findFirst({
      where: { payrollDetailId, isIps: true, isDeleted: false },
    });

    console.log('EXISTING IPS ITEM:', existingIpsItem);
    if (existingIpsItem) {
      // Si existe, actualizarlo
      await this.prismaService.payrollItems.update({
        where: { id: existingIpsItem.id },
        data: { amount: ipsAmount, userId: user.id },
      });
    } else {
      // Si no existe, crearlo
      const ipsItem = await this.prismaService.payrollItems.create({
        data: {
          payrollDetailId,
          userId: user.id,
          isIncome: false,
          amount: ipsAmount,
          description: 'IPS',
          isIps: true,
        },
      });
      console.log('IPS ITEM:', ipsItem);
    }

    return ipsAmount;
  }

  async createOrUpdateBonificationFamiliar(
    payrollDetailId: string,
    user: Users,
  ) {
    const payrollDetail = await this.prismaService.payrollDetails.findUnique({
      where: { id: payrollDetailId },
      select: {
        periodId: true,
        employeeId: true,
      },
    });

    const currentDate = new Date();
    const eighteenYearsAgo = new Date(
      currentDate.getFullYear() - 18,
      currentDate.getMonth(),
      currentDate.getDate(),
    );

    const familiares = await this.prismaService.familyMembers.findMany({
      where: {
        employeeId: payrollDetail.employeeId,
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

    const salaries = await this.prismaService.employeeDetails.findMany({
      where: { employeeId: payrollDetail.employeeId, isActive: true },
      select: { salary: true },
    });

    const BonificationAmount =
      salaries.reduce((acc, salary) => acc + salary.salary, 0) *
      (bonificacionFamiliarPercentage.value / 100) *
      familiares.length;

    // Verificar si ya existe un ítem de bonificación familiar
    const existingBonificationItem =
      await this.prismaService.payrollItems.findFirst({
        where: { payrollDetailId, isBonification: true, isDeleted: false },
      });

    if (existingBonificationItem) {
      // Si existe, actualizarlo
      await this.prismaService.payrollItems.update({
        where: { id: existingBonificationItem.id },
        data: { amount: BonificationAmount, userId: user.id },
      });
    } else {
      // Si no existe, crearlo
      await this.prismaService.payrollItems.create({
        data: {
          payrollDetailId,
          userId: user.id,
          isIncome: true,
          amount: BonificationAmount,
          description: 'Bonificación Familiar',
          isBonification: true,
        },
      });
    }

    return BonificationAmount;
  }

  async calculateIpsForAllEmployees(user: Users) {
    try {
      const payrollDetails = await this.prismaService.payrollDetails.findMany({
        where: {
          period: {
            isEnded: false,
          },
        },
        select: {
          id: true,
        },
      });

      const ipsPromises = payrollDetails.map(async (payrollDetail) => {
        const ipsAmount = await this.createOrUpdateIPS(payrollDetail.id, user);
        return { payrollDetailId: payrollDetail.id, ipsAmount };
      });

      const ipsResults = await Promise.all(ipsPromises);
      return ipsResults;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Payroll', '');
    }
  }

  async calculateBonificationForAllEmployees(user: Users) {
    try {
      const payrollDetails = await this.prismaService.payrollDetails.findMany({
        where: {
          period: {
            isEnded: false,
          },
        },
        select: {
          id: true,
        },
      });

      const bonificationPromises = payrollDetails.map(async (payrollDetail) => {
        const bonificationAmount =
          await this.createOrUpdateBonificationFamiliar(payrollDetail.id, user);
        return { payrollDetailId: payrollDetail.id, bonificationAmount };
      });

      const bonificationResults = await Promise.all(bonificationPromises);
      return bonificationResults;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Payroll', '');
    }
  }

  async createPayments(periodId: string, user: Users) {
    try {
      const period = await this.prismaService.payrollPeriods.update({
        where: { id: periodId },
        data: { DetailsWithoutVerification: 0 },
      });

      const employees = await this.prismaService.employees.findMany({
        where: { isDeleted: false },
        include: {
          EmployeeDetails: true,
        },
      });

      console.log('employees', employees);

      const payrollDetailsPromises = employees.map(async (employee) => {
        if (!employee.EmployeeDetails) return;
        console.log('employee.EmployeeDetails', employee.EmployeeDetails);
        let noRole = true;
        for (const role of employee.EmployeeDetails) {
          if (
            role.endDate > new Date() ||
            role.endDate == new Date('1900-06-03T00:00:00.000Z') ||
            role.endDate == null
          ) {
            noRole = false;
            break;
          }
        }
        console.log('noRole', noRole);
        if (noRole) return;
        console.log('noRole', noRole);
        const payments = await this.createPaymentforEmployee(
          periodId,
          employee.id,
          user,
        );
        console.log('payments', payments);
        return payments;
      });

      const payrollDetails = await Promise.all(payrollDetailsPromises);
      console.log('payrollDetails', payrollDetails);
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
          id: true,
          payrollItems: {
            select: {
              id: true,
              isIncome: true,
              amount: true,
              isIps: true,
              isBonification: true,
              description: true,
            },
          },
        },
      });

      const updatePayrollDetailsAndReceiptNumber = async (periodId: string) => {
        await this.prismaService.$transaction(async (prisma) => {
          const receiptConfig = await prisma.basicConfig.findFirst({
            where: { name: 'Numero de recibo' },
            select: { value: true },
          });

          if (!receiptConfig || !receiptConfig.value) {
            throw new Error('Número de recibo no encontrado');
          }

          let receiptNumber = receiptConfig.value;

          const payrollDetails = await prisma.payrollDetails.findMany({
            where: { periodId: periodId },
            include: {
              payrollItems: true,
            },
          });

          for (const detail of payrollDetails) {
            let totalAmount = 0;
            let totalIps = 0;
            let totalSalary = 0;
            let totalBonification = 0;
            let totalOtherIncome = 0;
            let totalOtherExpense = 0;

            for (const item of detail.payrollItems) {
              if (item.isIncome) {
                totalAmount += item.amount;
                if (item.isBonification) {
                  totalBonification += item.amount;
                } else if (item.description.includes('Salario')) {
                  totalSalary += item.amount;
                } else {
                  totalOtherIncome += item.amount;
                }
              } else {
                totalAmount -= item.amount;
                if (item.isIps) {
                  totalIps += item.amount;
                } else {
                  totalOtherExpense += item.amount;
                }
              }
            }

            await prisma.payrollDetails.update({
              where: { id: detail.id },
              data: {
                isVerified: true,
                receiptNumber: `${receiptNumber}`,
                amount: totalAmount,
                amountIps: totalIps,
                amountSalary: totalSalary,
                amountBonification: totalBonification,
                amountIncome: totalOtherIncome,
                amountExpense: totalOtherExpense,
              },
            });

            receiptNumber += 1;
          }

          await prisma.basicConfig.update({
            where: { name: 'Numero de recibo' },
            data: { value: receiptNumber },
          });
        });
      };

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

      await updatePayrollDetailsAndReceiptNumber(periodId);

      const closeIncome = await Promise.all(closeIncomePromises);
      const closeExpense = await Promise.all(closeExpensePromises);

      let totalAmount = 0;
      let totalIncome = 0;
      let totalExpense = 0;
      let totalSalary = 0;
      let totalBonification = 0;
      let totalIps = 0;

      payrollDetails.forEach((payrollDetail) => {
        payrollDetail.payrollItems.forEach((item) => {
          if (item.isIncome) {
            totalAmount += item.amount;
            totalIncome += item.amount;
            if (item.isBonification) {
              totalBonification += item.amount;
            } else if (item.description.includes('Salario')) {
              totalSalary += item.amount;
            }
          } else {
            totalAmount -= item.amount;
            totalExpense += item.amount;
            if (item.isIps) {
              totalIps += item.amount;
            }
          }
        });
      });

      const payrollPeriod = await this.prismaService.payrollPeriods.update({
        where: { id: periodId },
        data: {
          isEnded: true,
          periodEnd: new Date(),
          userId: user.id,
          totalAmount: totalAmount,
          totalIncome: totalIncome,
          totalExpense: totalExpense,
          totalSalary: totalSalary,
          totalBonification: totalBonification,
          totalIps: totalIps,
        },
      });
      await this.createSalaryPayment(user, periodId);
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

  async verifyPayrollDetails(
    user: Users,
    periodDetailsId: string,
    periodId: string,
  ) {
    try {
      const payrollDetails = await this.prismaService.payrollDetails.update({
        where: { id: periodDetailsId },
        data: {
          isVerified: true,
          userId: user.id,
        },
      });

      const payrollPeriod = await this.prismaService.payrollPeriods.update({
        where: { id: periodId },
        data: {
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

  async createSalaryPayment(user: Users, payrollPeriodId: string) {
    try {
      const payrollPeriod = await this.prismaService.payrollPeriods.findUnique({
        where: { id: payrollPeriodId },
        select: {
          id: true,
          periodStart: true,
          periodEnd: true,
          isEnded: true,
          totalAmount: true,
          totalBonification: true,
          totalIncome: true,
          totalExpense: true,
          totalSalary: true,
          totalIps: true,
        },
      });

      // Registro del gasto por sueldos y salarios
      const salaryPayment = await this.prismaService.accountingEntry.create({
        data: {
          netAmount: payrollPeriod.totalSalary,
          name: 'Gastos de Sueldos y Salarios',
          type: 'DEBE',
          paymentDate: payrollPeriod.periodEnd,
          payrollperiodId: payrollPeriod.id,
        },
      });

      const salaryExpense = await this.prismaService.accountingEntry.create({
        data: {
          netAmount: payrollPeriod.totalSalary,
          name: 'Sueldos y Salarios por Pagar',
          type: 'HABER',
          paymentDate: payrollPeriod.periodEnd,
          payrollperiodId: payrollPeriod.id,
        },
      });

      // Retenciones de Ley (IPS)
      const ipsRetained = await this.prismaService.accountingEntry.create({
        data: {
          netAmount: payrollPeriod.totalIps,
          name: 'Retenciones de IPS',
          type: 'DEBE',
          paymentDate: payrollPeriod.periodEnd,
          payrollperiodId: payrollPeriod.id,
        },
      });

      const ipsPayable = await this.prismaService.accountingEntry.create({
        data: {
          netAmount: payrollPeriod.totalIps,
          name: 'IPS por Pagar',
          type: 'HABER',
          paymentDate: payrollPeriod.periodEnd,
          payrollperiodId: payrollPeriod.id,
        },
      });

      // Pago de los salarios netos a los empleados
      const netAmountToPay =
        payrollPeriod.totalSalary +
        payrollPeriod.totalIncome +
        payrollPeriod.totalBonification -
        payrollPeriod.totalExpense -
        payrollPeriod.totalIps;

      const salaryPaymentBank = await this.prismaService.accountingEntry.create(
        {
          data: {
            netAmount: netAmountToPay,
            name: 'Banco',
            type: 'HABER',
            paymentDate: payrollPeriod.periodEnd,
            payrollperiodId: payrollPeriod.id,
          },
        },
      );

      const salaryPaymentNet = await this.prismaService.accountingEntry.create({
        data: {
          netAmount: netAmountToPay,
          name: 'Pago Neto de Salarios',
          type: 'DEBE',
          paymentDate: payrollPeriod.periodEnd,
          payrollperiodId: payrollPeriod.id,
        },
      });

      // Pago a retenciones de ley (IPS)
      const ipsPayment = await this.prismaService.accountingEntry.create({
        data: {
          netAmount: payrollPeriod.totalIps,
          name: 'Pago a IPS',
          type: 'DEBE',
          paymentDate: payrollPeriod.periodEnd,
          payrollperiodId: payrollPeriod.id,
        },
      });

      const ipsBankPayment = await this.prismaService.accountingEntry.create({
        data: {
          netAmount: payrollPeriod.totalIps,
          name: 'Banco',
          type: 'HABER',
          paymentDate: payrollPeriod.periodEnd,
          payrollperiodId: payrollPeriod.id,
        },
      });

      return {
        salaryPayment,
        salaryExpense,
        ipsRetained,
        ipsPayable,
        salaryPaymentBank,
        salaryPaymentNet,
        ipsPayment,
        ipsBankPayment,
      };
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Payroll', '');
    }
  }

  async findPayrollDetails(id: string, payrollDetailId: string) {
    try {
      const payrollDetails = await this.prismaService.payrollDetails.findUnique(
        {
          where: { id: payrollDetailId },
          select: {
            id: true,
            employee: {
              select: {
                person: {
                  select: {
                    ciRuc: true,
                    name: true,
                  },
                },
              },
            },
            isVerified: true,
            receiptNumber: true,
            employeeId: true,
            user: {
              select: {
                fullName: true,
              },
            },
            userId: true,
            amount: true,
            payrollItems: {
              select: {
                id: true,
                description: true,
                payrollDetailId: true,
                isIncome: true,
                amount: true,
              },
            },
          },
        },
      );

      return payrollDetails;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Payroll', '');
    }
  }

  async getLastPaymnets() {
    try {
      const payrollPeriods = await this.prismaService.payrollPeriods.findMany({
        where: {
          isEnded: true,
        },
        orderBy: {
          periodEnd: 'desc',
        },
        take: 1,
      });
      return payrollPeriods;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Payroll', '');
    }
  }

  async getLastTopEmployeesByIncome() {
    try {
      const payrollPeriods = await this.prismaService.payrollPeriods.findMany({
        where: {
          isEnded: true,
        },
        orderBy: {
          periodEnd: 'desc',
        },
        take: 1,
      });
      const payrollDetails = await this.prismaService.payrollDetails.findMany({
        where: {
          periodId: payrollPeriods[0].id,
        },
        select: {
          id: true,
          employee: {
            select: {
              person: {
                select: {
                  ciRuc: true,
                  name: true,
                },
              },
            },
          },
          amountIncome: true,
          amountSalary: true,
          amountBonification: true,
          amountExpense: true,
          amountIps: true,
        },
        orderBy: {
          amount: 'desc',
        },
        take: 3,
      });
      return payrollDetails;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Payroll', '');
    }
  }

  async getLastSalaryPayments() {
    try {
      const payrollPeriods = await this.prismaService.payrollPeriods.findMany({
        where: {
          isEnded: true,
        },
        orderBy: {
          periodEnd: 'desc',
        },
        take: 1,
      });
      const payments = await this.prismaService.accountingEntry.findMany({
        where: {
          payrollperiodId: payrollPeriods[0].id,
        },
        orderBy: {
          paymentDate: 'desc',
        },
      });
      return payments;
    } catch (error) {
      this.handleDbErrorService.handleDbError(error, 'Payroll', '');
    }
  }
}
