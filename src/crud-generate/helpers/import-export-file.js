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
          let { typeColumnTable, titleColumnTable, uniqueId } = column[i];
          if (typeColumnTable !== "custom") {
            arr.push(item[uniqueId]);
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
    let headers = [];
    let contents = [];
    let totalRows = formatDataImport[Object.keys(formatDataImport)[0]].length;

    for (let row = 0; row < totalRows; row++) {
      let maxColumnLength = 1;
      // get maxColumn first
      for (let index of Object.keys(formatDataImport)) {
        let rowColumnValue = formatDataImport[index][row];
        if (maxColumnLength < rowColumnValue.length) {
          maxColumnLength = rowColumnValue.length;
        }
        if (row == 0) {
          let headerName = index.split("as")[1];
          headers.push(headerName);
        }
      }

      let master = [];
      for (let i = 0; i < maxColumnLength; i++) {
        let column = 0;
        let content = [...master];
        for (let index of Object.keys(formatDataImport)) {
          let value =
            typeof formatDataImport[index][row][i] === "undefined"
              ? null
              : formatDataImport[index][row][i];
          // this is master index
          if (index.split("as")[0].split(".").length <= 1 && i == 0) {
            master.push(value);
          }

          if (i == 0) {
            content.push(value);
          } else if (i > 0 && index.split("as")[0].split(".").length > 1) {
            content.splice(column, 1, value);
          }
          column++;
        }
        contents.push(content);
      }
    }
    return [headers, ...contents];
  }

  downloadExampleData(formatDataImport) {
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
  }

  creatingKeyObject(headerSheet, formatDataImport) {
    let masterKey = { master: {}, detail: {}, mockup: {}, index: {} };
    // loop data header in every sheet maybe there are different header sheet with each other
    for (let headerIndex = 0; headerIndex < headerSheet.length; headerIndex++) {
      let valueHeader = headerSheet[headerIndex];
      // check if the valueHeader is not exist at formatDataImport (maybe the developer using [as] as a title of column table remember as title column table must be unique)
      if (!has(formatDataImport, valueHeader)) {
        let i = 0;
        while (i < Object.keys(formatDataImport).length) {
          let item = Object.keys(formatDataImport)[i].split("as");
          if (
            item.length > 1 &&
            item[1].replace(/\s/g, "") == valueHeader.replace(/\s/g, "")
          ) {
            valueHeader = item[0].replace(/\s/g, "");
            break;
          }
          i++;
        }
      }

      if (valueHeader.split(".").length > 1) {
        let splitIndex = valueHeader.split(".");
        masterKey["detail"][splitIndex[0].replace(/\s/g, "")] = [];
        masterKey["mockup"][splitIndex[0].replace(/\s/g, "")] = [];
      } else {
        masterKey["master"][valueHeader.replace(/\s/g, "")] = "";
        masterKey["mockup"][valueHeader.replace(/\s/g, "")] = "";
      }
      masterKey["index"][headerIndex] = valueHeader;
    }
    return masterKey;
  }

  removeValObj(obj) {
    for (let i = 0; i < Object.keys(obj).length; i++) {
      let val = obj[Object.keys(obj)[i]];
      if (Array.isArray(val)) {
        obj[Object.keys(obj)[i]] = [];
      } else {
        obj[Object.keys(obj)[i]] = "";
      }
    }
  }

  convertToNormalObjectData(dataSheet, formatDataImport) {
    let results = [];
    for (let sheetPage = 0; sheetPage < dataSheet.length; sheetPage++) {
      let result = [];
      let { mockup, index, master, detail } = this.creatingKeyObject(
        dataSheet[sheetPage][0],
        formatDataImport
      );

      // row start from 1 because the zero index row is the header value
      for (let row = 1; row < dataSheet[sheetPage].length; row++) {
        // loop column
        // details still take a value problem
        let mainMockup = { ...mockup };
        let detailMockup = { ...detail };
        let tempDetailColumnName = "";
        for (
          let column = 0;
          column < dataSheet[sheetPage][row].length;
          column++
        ) {
          let indexObj = { ...index };
          indexObj = indexObj[column];
          let value = dataSheet[sheetPage][row][column];

          if (has(mainMockup, indexObj)) {
            mainMockup[indexObj] = value;
          } else {
            let indexSplit = indexObj.split(".");
            if (tempDetailColumnName !== indexSplit[0]) {
              detailMockup[indexSplit[0]] = [{}];
            }
            detailMockup[indexSplit[0]][0][indexSplit[1]] = value;
            tempDetailColumnName = indexSplit[0];
          }
        }

        result = [...result, { ...mainMockup, ...detailMockup }];

        if (row > 1) {
          /* check if data master same or not */
          let isMasterSame = true;
          for (let attr of Object.keys(master)) {
            if (result[1][attr] != result[0][attr]) {
              isMasterSame = false;
              break;
            }
          }
          /* then if master same merge it, and just take data details */
          if (isMasterSame) {
            for (let attr of Object.keys(detail)) {
              result[0][attr] = [...result[0][attr], ...result[1][attr]];
            }

            if (row + 1 == dataSheet[sheetPage].length) {
              results.push(result[0]);
            }

            result.splice(1, 1);
          } else {
            results.push(result[0]);
            result.splice(0, 1);

            if (row + 1 == dataSheet[sheetPage].length) {
              results.push(result[0]);
              result.splice(0, 1);
            }
          }
        }
      }
    }
    return results;
  }

  getDataFromFileUpload(file, formatDataImport) {
    let data = [];
    const wb = xlsx.read(file, { type: "array" });
    const wsname = wb.SheetNames;
    for (let i = 0; i < wsname.length; i++) {
      data[i] = xlsx.utils.sheet_to_json(wb.Sheets[wsname[i]], {
        header: 1
      });
    }
    return this.convertToNormalObjectData(data, formatDataImport);
  }
}

export default ImportExportFile;
