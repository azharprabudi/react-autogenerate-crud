/* etc modules */
import axios from "axios";
import xlsx from "xlsx";
import has from "lodash/has";
import moment from "moment";
import random from "lodash/random";
import { saveAs } from "file-saver";
import faker from "faker";

/* my module */
import { libDefaultvalue } from "../components/form/lib";

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

  creatingArrayExampleData(fields, aliasData) {
    let body = [];
    let header = [];
    for (let i = 0; i < fields.length; i++) {
      let field = fields[i];
      for (let j = 0; j < field.details.length; j++) {
        if (
          !has(field.details[j], "mergingColumn") ||
          !field.details[j].mergingColumn
        ) {
          let columnName = field.details[j].titleColumnTable;
          if (!header[i]) {
            header[i] = [];
          }
          header[i].push(columnName);

          if (!body[i]) {
            body[i] = [];
          }
          let value = libDefaultvalue[field.details[j].component];
          body[i].push();
        }
      }
    }
  }

  async downloadExampleData(fields) {
    try {
      // creating array data from fields and alias data
      const arr = this.creatingArrayExampleData(fields);
    } catch (e) {
      return e;
    }
  }
}

export default ImportExportFile;
