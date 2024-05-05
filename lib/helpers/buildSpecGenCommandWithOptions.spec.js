const buildSpecGenCommandWithOptions = require("./buildSpecGenCommandWithOptions");

describe("Build spec gen command test", () => {
  const pathToSpecFile = "/spec/input.json";
  const codeOutputFolder = "/output";
  const pathToTemplate = "/template";
  const pathToSwaggerJar = "/swagger.jar";
  const baseCommand =
    "java -jar /swagger.jar generate -l typescript-fetch --template-dir /template -i /spec/input.json -o /output";
  test("should create command for no options passed", () => {
    const options = {};
    const result = buildSpecGenCommandWithOptions(
      pathToSwaggerJar,
      pathToTemplate,
      pathToSpecFile,
      codeOutputFolder,
      "test-service-name",
      options
    );
    expect(result).toBe(
      `${baseCommand} --additional-properties=serviceName=test-service-name,dataSourceName=RESTDataSource`
    );
  });

  test("should create command for custom datasource passed", () => {
    const options = {
      dataSourceImport: "@app/apis/DataSource#CustomDataSource",
    };
    const result = buildSpecGenCommandWithOptions(
      pathToSwaggerJar,
      pathToTemplate,
      pathToSpecFile,
      codeOutputFolder,
      "test-service-name",
      options
    );
    expect(result).toBe(
      `${baseCommand} --additional-properties=serviceName=test-service-name,dataSourceName=CustomDataSource,dataSourceImportString="@app/apis/DataSource"`
    );
  });

  test("should create command for custom datasource passed", () => {
    const options = {
      dataSourceImport: "@app/apis/DataSource#CustomDataSource",
    };
    const result = buildSpecGenCommandWithOptions(
      pathToSwaggerJar,
      pathToTemplate,
      pathToSpecFile,
      codeOutputFolder,
      "test-service-name",
      options
    );
    expect(result).toBe(
      `${baseCommand} --additional-properties=serviceName=test-service-name,dataSourceName=CustomDataSource,dataSourceImportString="@app/apis/DataSource"`
    );
  });

  test("should create command for circuit breaker options", () => {
    const options = { withCircuitBreaker: "--withCircuitBreaker" };
    const result = buildSpecGenCommandWithOptions(
      pathToSwaggerJar,
      pathToTemplate,
      pathToSpecFile,
      codeOutputFolder,
      "test-service-name",
      options
    );
    expect(result).toBe(
      `${baseCommand} --additional-properties=serviceName=test-service-name,withCircuitBreaker=true,dataSourceName=RESTDataSource`
    );
  });

  test("should create command for circuit breaker with external circuit breaker config", () => {
    const options = {
      withCircuitBreaker: "--withCircuitBreaker",
      circuitBreakerConfig:
        "@app/circuit-breakers/CircuitBreakerConfig#getServiceCircuitBreaker",
    };
    const result = buildSpecGenCommandWithOptions(
      pathToSwaggerJar,
      pathToTemplate,
      pathToSpecFile,
      codeOutputFolder,
      "test-service-name",
      options
    );
    expect(result).toBe(
      `${baseCommand} --additional-properties=serviceName=test-service-name,withCircuitBreaker=true,circuitBreakerImportString=@app/circuit-breakers/CircuitBreakerConfig,circuitBreakerConfigFn="getServiceCircuitBreaker",dataSourceName=RESTDataSource`
    );
  });
});
