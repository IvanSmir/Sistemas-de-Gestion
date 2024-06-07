export interface PayrollPeriod {
  id: string
  periodStart: string
  periodEnd: any
  isEnded: boolean
  DetailsWithoutVerification: number
  payrollDetails: any[]
}