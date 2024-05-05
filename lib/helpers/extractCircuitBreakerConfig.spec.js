const extractCircuitBreakerConfig = require("./extractCircuitBreakerConfig");

describe("extract circuit breaker config", () => {
  test("should return imports for circuit breaker config", () => {
    const dataSourcePath =
      "@app/circuit-breakers/CircuitBreakerConfig#getServiceCircuitBreaker";
    expect(extractCircuitBreakerConfig(dataSourcePath)).toEqual({
      circuitBreakerImportString: "@app/circuit-breakers/CircuitBreakerConfig",
      circuitBreakerConfigFn: "getServiceCircuitBreaker",
    });
  });

  test("should return undefined", () => {
    let dataSourcePath;
    expect(extractCircuitBreakerConfig(dataSourcePath)).not.toBeDefined();

    dataSourcePath = "undefined";
    expect(extractCircuitBreakerConfig(dataSourcePath)).not.toBeDefined();
  });
});
