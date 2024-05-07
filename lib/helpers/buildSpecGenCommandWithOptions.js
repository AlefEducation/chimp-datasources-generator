const extractDataSource = require("./customDataSourceExtractor");
const extractCircuitBreakerConfig = require("./extractCircuitBreakerConfig");

const buildSpecGenCommandWithOptions = (
  pathToSwaggerJar,
  pathToTemplate,
  pathToSpecFile,
  codeOutputFolder,
  serviceName,
  options
) => {
  const additionalProps = [];
  let shellCommand = `java -jar ${pathToSwaggerJar} generate -l typescript-fetch --template-dir ${pathToTemplate} -i ${pathToSpecFile} -o ${codeOutputFolder}`;

  additionalProps.push(`serviceName=${serviceName}`);

  if (options.withCircuitBreaker) {
    additionalProps.push("withCircuitBreaker=true");
  }

  if (options.circuitBreakerConfig) {
    const config = extractCircuitBreakerConfig(options.circuitBreakerConfig);
    if (config) {
      const { circuitBreakerImportString, circuitBreakerConfigFn } = config;
      additionalProps.push(
        `circuitBreakerImportString=${circuitBreakerImportString}`
      );
      additionalProps.push(
        `circuitBreakerConfigFn="${circuitBreakerConfigFn}"`
      );
    }
  }

  if (options.dataSourceImport) {
    const { dataSourceName, importString } = extractDataSource(
      options.dataSourceImport
    );
    additionalProps.push(`dataSourceName=${dataSourceName}`);
    additionalProps.push(`dataSourceImportString="${importString}"`);
  } else {
    additionalProps.push("dataSourceName=RESTDataSource");
  }

  if (additionalProps.length > 0) {
    shellCommand = shellCommand.concat(
      ` --additional-properties=${additionalProps.toString()}`
    );
  }
  return shellCommand;
};

module.exports = buildSpecGenCommandWithOptions;
