/* etc modules */

import axios from "axios";
import xlsx from "xlsx";
import has from "lodash/has";
import moment from "moment";
import { saveAs } from "file-saver";

class GenerateCsv {
  constructor(urlFetch, config, column) {
    this.column = column;
    this.config = config;
    this.urlFetch = urlFetch;
  }

  async generateFile(type) {
    try {
      const data = await axios.get(this.urlFetch, this.config);
      if (!has(data, "data")) {
        throw new Error(data);
      }

      const header = [];
      const extension = type === "csv" ? "csv" : "xlsx";
      const fileDataExcel = data.data.map((item, index) => {
        let i = 0;
        let arr = [];
        while (i < this.column.length) {
          let {
            typeColumnTable,
            titleColumnTable,
            attributeColumnTable
          } = this.column[i];
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
}

export default GenerateCsv;
