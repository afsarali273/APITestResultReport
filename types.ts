// TypeScript types matching the Java DTO classes

export interface TestCaseDTO {
  idx: string
  testStepName: string
  method: string
  webURL: string
  headerSheet: string
  bodyText: string
  validationSheet: string
  correlateSheet: string
  negativeCase: string
  params: string
  comments: string
  input1: string
}

export interface TestOutputDTO {
  outputJson: string
  apiName: string
  executionTimeInSec: number
  length: number
}

export interface ValidationDTO {
  staticData: string
  type: string
  field: string
  value: string
  apiField: string
  apiValue: string
  sourceValue: string
  result: string
  parameters: string
  serviceName: string
  header: string
  body: string
  subHeader1: string
  subHeader2: string
}

// Combined test case with output and validation
export interface TestCase {
  testCase: TestCaseDTO
  output: TestOutputDTO
  validations: ValidationDTO[]
  status: "Pass" | "Fail"
}

// Test suite for a single run
export interface TestSuite {
  adoRunId: string
  suiteName: string
  totalTestCases: number
  passed: number
  failed: number
  startTime: string
  endTime: string
  executionDuration: string
  testCases: TestCase[]
  version?: string
}

// Dashboard summary
export interface DashboardSummary {
  suites: TestSuite[]
}
