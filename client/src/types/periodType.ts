export interface PeriodData {
  id: string;
  periodStart: string;
  periodEnd: string;
  isEnded: boolean;
  DetailsWithoutVerification: number;
  totalAmount: number;
  totalIncome: number;
  totalExpense: number;
  totalSalary: number;
  totalBonification: number;
  totalIps: number;
  payrollDetails: PayrollDetail[];
}

export interface PayrollDetail {
  isVerified: boolean;
  payrollItems: PayrollItem[];
  id: string;
  periodId: string;
  employeeId: string;
  userId: string;
  amount: number;
  amountBonification: number;
  amountExpense: number;
  amountIps: number;
  amountIncome: number;
  amountSalary: number;
  employee: Employee;
}

export interface PayrollItem {
  amount: number;
  description: string;
  isIncome: boolean;
  isIps: boolean;
  isBonification: boolean;
}

export interface Employee {
  id: string;
  person: Person;
}

export interface Person {
  id: string;
  name: string;
  ciRuc: string;
}
