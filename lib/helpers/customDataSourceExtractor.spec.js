const extractDataSource = require("./customDataSourceExtractor");

test("named import", () => {
  const dataSourcePath = "@app/apis/DataSource#CustomDataSource";
  expect(extractDataSource(dataSourcePath)).toEqual({
    importString: "@app/apis/DataSource",
    dataSourceName: "CustomDataSource",
  });
});

test("default import", () => {
  const dataSourcePath = "@app/MyDataSource";
  expect(extractDataSource(dataSourcePath)).toEqual({
    importString: "@app/MyDataSource",
    dataSourceName: "DataSource",
  });
});
