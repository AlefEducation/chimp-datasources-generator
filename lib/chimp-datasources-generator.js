#!/usr/bin/env node

const shelljs = require("shelljs");
const { Command } = require("commander");

const program = new Command();
const path = require("path");
const buildSpecGenCommandWithOptions = require("./helpers/buildSpecGenCommandWithOptions");

program
  .name("chimp-datasources-generator")
  .command("create")
  .argument("<directory>", "Directory for the generated source files.")
  .argument(
    "<api-location>",
    "Location/URL for the json/yaml swagger specs. Use http/https when pointing to a URL and relative location when pointing to a file."
  )
  .option(
    "-ds, --dataSourceImport <string>",
    "You can also specify your own custom data source import. \n" +
      ' "@app/apis/DataSource#DataSource" will use an import of:\n' +
      ' import { DataSource } from "@app/apis/DataSource"\n' +
      "For a default import just use the path:\n" +
      ' "@app/apis/BaseDataSource"'
  )
  .option(
    "-cb, --withCircuitBreaker <boolean>",
    "Add circuit breakers for api calls.",
    false
  )
  .option(
    "-cbc, --circuitBreakerConfig <string>",
    "You can also specify your own custom circuit breaker import per service. \n" +
      ' "@app/circuit-breakers/CircuitBreakerConfig#getServiceCircuitBreaker" will use an import of:\n' +
      ' import { getServiceCircuitBreaker } from "@app/circuit-breakers/CircuitBreakerConfig"\n'
  )
  .description(
    "Generate RestDatasource from swagger specs\n" +
      "Examples: \n" +
      "   chimp-datasources-generator create ./generated/external-apis https://domain.com/v3/api-docs.yaml --withCircuitBreaker\n" +
      "   chimp-datasources-generator create ./generated/external-apis ./api-docs.yaml\n" +
      '   chimp-datasources-generator create ./generated/external-apis ./api-docs.yaml "@app/apis/DataSource#DataSource"\n' +
      '   chimp-datasources-generator create ./generated/external-apis ./api-docs.yaml -cbc "@app/circuit-breakers/CircuitBreakerConfig#getServiceCircuitBreaker"\n'
  )
  .action((directory, location, options) => {
    const API_DIR = directory;
    const API_URL = location;

    const resolvedPath = path.join(process.cwd(), API_DIR);

    const resolvedAPI = API_URL.match(/http(s)?:/)
      ? API_URL
      : path.join(process.cwd(), API_URL);

    const pathToSwagger = path.join(__dirname, "./swagger-codegen-cli.jar");
    const pathToTemplate = path.join(__dirname, "./typescript-fetch");
    // // shelljs.rm("-rf", API_DIR);
    const serviceName = path.parse(resolvedPath).base;
    shelljs.mkdir("-p", resolvedPath);
    const shellCommand = buildSpecGenCommandWithOptions(
      pathToSwagger,
      pathToTemplate,
      resolvedAPI,
      resolvedPath,
      serviceName,
      options
    );
    shelljs.exec(shellCommand);

    shelljs.sed("-i", /this.DELETE/, "this.delete", `${resolvedPath}/api.ts`);
    shelljs.sed("-i", /this.GET/, "this.get", `${resolvedPath}/api.ts`);
    shelljs.sed("-i", /this.POST/, "this.post", `${resolvedPath}/api.ts`);
    shelljs.sed("-i", /this.UPDATE/, "this.update", `${resolvedPath}/api.ts`);
    shelljs.sed("-i", /this.PUT/, "this.put", `${resolvedPath}/api.ts`);

    shelljs.sed(
      "-i",
      /extends null/,
      "extends GenericObject",
      `${resolvedPath}/api.ts`
    );
  });

program.parse(process.argv);

// rm -rf __generated_api__ && mkdir __generated_api__ && java -jar ../swagger-codegen-cli.jar generate -l typescript-fetch -i http://localhost:8091/v3/api-docs.yaml -o __generated_api__
