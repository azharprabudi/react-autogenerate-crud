/* etc modules */
import axios from "axios";
import xlsx from "xlsx";
import has from "lodash/has";
import moment from "moment";
import { saveAs } from "file-saver";

class ImportExportFile {
  async generateFile(urlFetch, config, column, type) {
    try {
      const data = await axios.get(urlFetch, config);
      if (!has(data, "data")) {
        throw new Error(data);
      }

      const header = [];
      const extension = type === "csv" ? "csv" : "xlsx";
      const fileDataExcel = data.data.map((item, index) => {
        let i = 0;
        let arr = [];
        while (i < column.length) {
          let {
            typeColumnTable,
            titleColumnTable,
            attributeColumnTable
          } = column[i];
          if (typeColumnTable !== "custom") {
            arr.push(item[attributeColumnTable]);
          }

          if (index < 1) {
            header.push(titleColumnTable);
          }
          i++;
        }
        return arr;
      });

      /* add header table at fileDataExcel array */
      fileDataExcel.splice(0, 0, header);

      const workbook = new xlsx.utils.book_new();
      const arrToSheet = xlsx.utils.aoa_to_sheet(fileDataExcel);
      xlsx.utils.book_append_sheet(workbook, arrToSheet, "Sheet 1");

      const workbookOutput = xlsx.write(workbook, {
        type: "array",
        bookType: extension,
        bookSST: false
      });

      saveAs(
        new Blob([workbookOutput], { type: "application/octet-stream" }),
        `export-${moment().format("DD/MM/YYYY")}.${extension}`
      );
    } catch (e) {
      return e;
    }
  }

  createDataForWB(formatDataImport) {
    let row = 0;
    let headers = [];
    let contents = [];
    let totalRows = formatDataImport[Object.keys(formatDataImport)[0]].length;

    while (row < totalRows) {
      let i = 0;
      let maxColumnLength = 1;
      // get maxColumn first
      while (i < Object.keys(formatDataImport).length) {
        let index = Object.keys(formatDataImport)[i];
        let rowColumnValue = formatDataImport[index][row];
        if (maxColumnLength < rowColumnValue.length) {
          maxColumnLength = rowColumnValue.length;
        }
        if (row == 0) {
          let headerName = index.split("as")[1];
          headers.push(headerName);
        }
        i++;
      }

      // then get value from obj data
      i = 0;
      let baseDataColumn = []; // this is meaning which column doest have details
      while (i < maxColumnLength) {
        let j = 0;
        let content = [...baseDataColumn];
        while (j < Object.keys(formatDataImport).length) {
          let column = formatDataImport[Object.keys(formatDataImport)[j]][row];
          let value = column[i] || null;

          if (i == 0) {
            if (column.length === 1) {
              baseDataColumn.push(value);
            } else {
              baseDataColumn.push(null);
            }
            content.push(value);
          } else {
            if (value !== null) {
              content[j] = value;
            }
          }
          j++;
        }
        contents.push(content);
        i++;
      }
      row++;
    }
    return [headers, ...contents];
  }

  async downloadExampleData(formatDataImport) {
    try {
      // creating array data from fields and alias data
      const exampleData = this.createDataForWB(formatDataImport);
      const workbook = new xlsx.utils.book_new();
      const arrToSheet = xlsx.utils.aoa_to_sheet(exampleData);
      xlsx.utils.book_append_sheet(workbook, arrToSheet, "Sheet 1");

      const workbookOutput = xlsx.write(workbook, {
        type: "array",
        bookType: "xlsx",
        bookSST: false
      });

      saveAs(
        new Blob([workbookOutput], { type: "application/octet-stream" }),
        `example-data-import.xlsx`
      );

      return true;
    } catch (e) {
      return e;
    }
  }
}

export default ImportExportFile;
