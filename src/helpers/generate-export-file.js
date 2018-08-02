/* etc modules */

import axios from "axios";
import has from "lodash/has";

class GenerateCsv {
  constructor(urlFetch, config, column) {
    this.column = column;
    this.config = config;
    this.urlFetch = urlFetch;
  }

  async getDataFromServer() {
    try {
      const data = await axios.get(this.urlFetch, this.config);
      if (!has(data, "data")) {
        throw new Error(data);
      }
      return data;
    } catch (e) {
      return e;
    }
  }

  async getFile(type) {
    try {
      let data = await this.getDataFromServer();
      if (!has(data, "data")) {
        throw new Error("Failed get data from server");
      }
      if (type === "csv") {
        return this.getCsvContentFile(data.data);
      }
    } catch (e) {
      return { error: true, data: e };
    }
  }

  getCsvContentFile(data) {
    let csvContentFile = "data:text/csv;charset=utf-8,";

    for (let iData = 0; iData < data.length; iData++) {
      let header = [];
      let row = [];
      for (let iColumn = 0; iColumn < this.column.length; iColumn++) {
        let itemColumn = this.column[iColumn];
        if (itemColumn.typeColumnTable !== "custom") {
          // for first looping add header at the top of table
          if (iData < 1) {
            header.push(itemColumn.titleColumnTable);
          }
          // add row item
          row.push(data[iData][itemColumn.attributeColumnTable]);
        }
      }

      // add header to csv file
      if (header.length > 0) {
        csvContentFile += `${header.join(",")}\r\n`;
      }
      csvContentFile += `${row.join(",")}\r\n`;
    }
    return csvContentFile;
  }
}

export default GenerateCsv;
