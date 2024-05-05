const extractCircuitBreakerConfig = (circuitBreakerConfig = "") => {
  const split = circuitBreakerConfig.split("#");

  if (split.length > 1) {
    return {
      circuitBreakerImportString: `${split[0]}`,
      circuitBreakerConfigFn: split[1],
    };
  }
  return undefined;
};

module.exports = extractCircuitBreakerConfig;
