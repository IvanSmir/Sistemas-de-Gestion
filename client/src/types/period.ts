export default interface PayrollDetail {
  id: string
  periodId: string
  employeeId: string
  userId: string
  amount: any
  employee: Employee
}

export interface Employee {
  id: string
  person: Person
}

export interface Person {
  id: string
  name: string
  ciRuc: string
}
