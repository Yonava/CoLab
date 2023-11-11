// the index where all SheetItems stored on Google Sheets must have their unique sysId
const SYS_ID_INDEX = 0;

const REPORTS = [
  'name',
  'client',
  'date',
  'status',
  'desc',
  'dataSets'
] as const;

export const map = <T>(spreadsheetMatrix: string[][], headerRow: readonly (keyof T)[]) => {
  const spreadsheetMatrixCopy = [...spreadsheetMatrix];

  return spreadsheetMatrix
    .filter((row) => {
      if (row.length === 0) {
        return false;
      }
      return !!row[SYS_ID_INDEX];
    })
    .map((row) => ({

      // the row number on the spreadsheet: + 1 for header row, + 1 for 0-indexing
      row: spreadsheetMatrixCopy.findIndex(([sysId]) => {
        return sysId === row[SYS_ID_INDEX];
      }) + 2,

      // sysId is the first column of all SheetItems
      sysId: row[SYS_ID_INDEX],

      // fields specific to SheetItem T
      ...headerRow.reduce((acc, curr, index) => {
        return {
          ...acc,
          [curr]: row[index + 1] ?? '',
        };
      }, {}),

      // note is the last column of all SheetItems
      note: row[headerRow.length + 1] ?? '',

      // custom fields
      ...row.reduce((acc, curr, index) => {
        const numberOfFields = headerRow.length;
        if (index < numberOfFields) {
          return acc;
        }
        return {
          ...acc,
          [index]: row[index] ?? '',
        };
      }, {}),

    }))
}

export const unmap = <T>(sheetItems: T[], headerRow: readonly (keyof T)[]) => {
  const matrix: string[][] = []

  for (const item of sheetItems) {

    const nonCustomFields = headerRow
      .map((key) => item[key]?.toString() ?? '');

    const row = [
      item.sysId,
      ...nonCustomFields,
      item.desc ?? '',
    ];

    const keys = Object.keys(item) as (keyof T)[];

    const customFields = keys
      .filter((key) => !isNaN(parseInt(key.toString())))
      .map((key) => ({
        key: parseInt(key.toString()),
        value: item[key]?.toString() ?? ''
      }));

    for (const { key, value } of customFields) {
      row[key] = value;
    }

    matrix.push(row);
  }

  return matrix;
}

const mapReports = (spreadsheetMatrix: string[][]) => {
  return map(spreadsheetMatrix, REPORTS);
}

const unmapReports = (reports: Report[]) => {
  return unmap(reports, REPORTS);
}

export {
  mapReports,
  unmapReports
}
