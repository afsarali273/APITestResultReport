import type { TestSuite, TestCase } from "./types"

// Mock data generator for testing the UI with comprehensive suite details
export const generateMockData = (): TestSuite[] => {
  const microservices = [
    "User Service",
    "Payment Service",
    "Order Service",
    "Inventory Service",
    "Notification Service",
    "Auth Service",
  ]

  const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"]
  const urls = [
    "/api/v1/users",
    "/api/v1/payments",
    "/api/v1/orders",
    "/api/v1/inventory",
    "/api/v1/notifications",
    "/api/v1/auth",
  ]

  const sampleHeaders = {
    "Content-Type": "application/json",
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "X-Request-ID": "req-12345-abcde",
    Accept: "application/json",
    "User-Agent": "API-Test-Framework/1.0",
  }

  const validationTypes = ["API", "DB", "STATIC", "REGEX", "SCHEMA"]
  const validationFields = [
    "status",
    "userId",
    "orderId",
    "amount",
    "currency",
    "timestamp",
    "email",
    "name",
    "address",
    "phoneNumber",
    "paymentMethod",
    "transactionId",
  ]

  const testSuites: TestSuite[] = []

  for (let run = 1; run <= 25; run++) {
    const serviceIndex = Math.floor(Math.random() * microservices.length)
    const totalTests = Math.floor(Math.random() * 20) + 10
    const passRate = 0.7 + Math.random() * 0.25 // 70-95% pass rate
    const passed = Math.floor(totalTests * passRate)
    const failed = totalTests - passed

    const startTime = new Date(Date.now() - run * 24 * 60 * 60 * 1000)
    const duration = Math.floor(Math.random() * 300) + 60 // 60-360 seconds
    const endTime = new Date(startTime.getTime() + duration * 1000)

    const testCases: TestCase[] = []

    for (let i = 0; i < totalTests; i++) {
      const status = i < passed ? "Pass" : "Fail"
      const methodIndex = Math.floor(Math.random() * methods.length)
      const method = methods[methodIndex]
      const isNegativeCase = Math.random() > 0.8

      const requestBody =
        method === "GET" || method === "DELETE"
          ? ""
          : JSON.stringify(
              {
                userId: 1000 + i,
                ...(microservices[serviceIndex].includes("Payment") && {
                  amount: Math.floor(Math.random() * 10000) / 100,
                  currency: "USD",
                  paymentMethod: "credit_card",
                  cardLast4: "4242",
                }),
                ...(microservices[serviceIndex].includes("Order") && {
                  orderId: `ORD-${String(10000 + i).padStart(8, "0")}`,
                  items: [
                    { productId: "PROD-001", quantity: Math.floor(Math.random() * 5) + 1, price: 29.99 },
                    { productId: "PROD-002", quantity: Math.floor(Math.random() * 3) + 1, price: 49.99 },
                  ],
                  shippingAddress: {
                    street: "123 Main St",
                    city: "San Francisco",
                    state: "CA",
                    zipCode: "94102",
                    country: "USA",
                  },
                }),
                ...(microservices[serviceIndex].includes("User") && {
                  email: `user${i}@example.com`,
                  name: `Test User ${i}`,
                  phoneNumber: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
                  role: "customer",
                }),
                ...(microservices[serviceIndex].includes("Inventory") && {
                  productId: `PROD-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
                  quantity: Math.floor(Math.random() * 100),
                  warehouseId: `WH-${Math.floor(Math.random() * 5) + 1}`,
                }),
                timestamp: new Date().toISOString(),
              },
              null,
              2,
            )

      const outputData = {
        success: status === "Pass",
        statusCode: status === "Pass" ? 200 : isNegativeCase ? 400 : 500,
        message: status === "Pass" ? "Operation completed successfully" : "Validation failed",
        data: {
          id: `${microservices[serviceIndex].split(" ")[0].toUpperCase()}-${String(10000 + i).padStart(8, "0")}`,
          ...(microservices[serviceIndex].includes("Payment") && {
            transactionId: `TXN-${String(Math.floor(Math.random() * 1000000)).padStart(10, "0")}`,
            amount: Math.floor(Math.random() * 10000) / 100,
            currency: "USD",
            status: status === "Pass" ? "completed" : "failed",
            processingTime: Math.floor(Math.random() * 3000),
            provider: "Stripe",
          }),
          ...(microservices[serviceIndex].includes("Order") && {
            orderId: `ORD-${String(10000 + i).padStart(8, "0")}`,
            orderStatus: status === "Pass" ? "confirmed" : "pending",
            totalAmount: Math.floor(Math.random() * 50000) / 100,
            itemCount: Math.floor(Math.random() * 10) + 1,
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          }),
          ...(microservices[serviceIndex].includes("User") && {
            userId: 1000 + i,
            email: `user${i}@example.com`,
            accountStatus: "active",
            createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
            lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            preferences: {
              notifications: true,
              newsletter: false,
              language: "en-US",
            },
          }),
          timestamp: new Date().toISOString(),
          processingNode: `node-${Math.floor(Math.random() * 10) + 1}`,
          traceId: `trace-${Math.random().toString(36).substring(2, 15)}`,
        },
        metadata: {
          apiVersion: "v1",
          requestId: `req-${Math.random().toString(36).substring(2, 15)}`,
          executionTime: Math.random() * 5 + 0.5,
          cacheHit: Math.random() > 0.7,
        },
      }

      const numValidations = Math.floor(Math.random() * 8) + 5
      const validations = Array.from({ length: numValidations }, (_, idx) => {
        const validationType = validationTypes[Math.floor(Math.random() * validationTypes.length)]
        const validationField = validationFields[Math.floor(Math.random() * validationFields.length)]
        const expectedValue =
          validationType === "API"
            ? `expected_${validationField}_value`
            : validationType === "DB"
              ? `db_${validationField}`
              : validationType === "STATIC"
                ? "static_constant"
                : validationType === "REGEX"
                  ? "^[A-Z]{3}-[0-9]{8}$"
                  : "schema_valid"

        const actualValue = status === "Pass" || idx > 0 ? expectedValue : `wrong_${validationField}_value`
        const validationResult = status === "Pass" ? "Pass" : idx === 0 ? "Fail" : Math.random() > 0.3 ? "Pass" : "Fail"

        return {
          staticData: validationType === "STATIC" ? "CONSTANT_VALUE_123" : "",
          type: validationType,
          field: validationField,
          value: expectedValue,
          apiField: validationType === "API" ? `response.data.${validationField}` : "",
          apiValue: actualValue,
          sourceValue: validationType === "DB" ? `SELECT ${validationField} FROM table WHERE id=${i}` : "",
          result: validationResult,
          parameters: `testCase=${i + 1}|runId=${run}|service=${microservices[serviceIndex]}`,
          serviceName: microservices[serviceIndex],
          header:
            validationType === "API" && validationField === "status" ? JSON.stringify({ "X-Status-Code": "200" }) : "",
          body: validationType === "API" ? JSON.stringify({ [validationField]: actualValue }) : "",
          subHeader1: validationType === "API" ? "Content-Type" : "",
          subHeader2: validationType === "API" ? "X-Response-Time" : "",
        }
      })

      const params =
        method === "GET"
          ? `id=${1000 + i}&page=1&limit=10&sort=desc&filter=${microservices[serviceIndex].split(" ")[0].toLowerCase()}`
          : method === "POST" || method === "PUT"
            ? `version=v1&async=false`
            : `id=${1000 + i}&confirm=true`

      testCases.push({
        testCase: {
          idx: String(i + 1),
          testStepName: `${microservices[serviceIndex]} - ${method} ${isNegativeCase ? "(Negative Test)" : "Test"} Case ${i + 1}`,
          method: method,
          webURL: `https://api.example.com${urls[serviceIndex]}/${i + 1}`,
          headerSheet: "HeadersSheet",
          bodyText: requestBody,
          validationSheet: "ValidationSheet",
          correlateSheet: i % 3 === 0 ? "CorrelationSheet" : "",
          negativeCase: isNegativeCase ? "Yes" : "No",
          params: params,
          comments: `Test case for ${microservices[serviceIndex]} - ${method} operation. ${isNegativeCase ? "Validates error handling." : "Validates successful response."}`,
          input1: i % 5 === 0 ? `extraParam=value${i}` : "",
        },
        output: {
          outputJson: JSON.stringify(outputData, null, 2),
          apiName: microservices[serviceIndex],
          executionTimeInSec: Math.random() * 5 + 0.5,
          length: JSON.stringify(outputData).length,
        },
        validations,
        status,
      })
    }

    testSuites.push({
      adoRunId: `ADO-${String(10000 + run).padStart(5, "0")}`,
      suiteName: microservices[serviceIndex],
      totalTestCases: totalTests,
      passed,
      failed,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      executionDuration: `${Math.floor(duration / 60)}m ${duration % 60}s`,
      testCases,
      version: `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
    })
  }

  return testSuites.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
}

export const mockTestSuites = generateMockData()
