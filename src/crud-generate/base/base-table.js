import React, { PureComponent, Fragment } from "react";

/* material ui */
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

/* etc modules */
import has from "lodash/has";
import omit from "lodash/omit";
import PropTypes from "prop-types";
import classNames from "classnames";

/* my modules */
import BaseTableHeader from "../components/table/base-table-header";
import BaseTableBody from "../components/table/base-table-body";

/* custom config */
import OptionsConf from "../constants/options-conf";

const styles = theme => ({
  loading: {
    position: "absolute",
    top: "48%",
    left: "48%"
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: "auto"
  },
  buttonWrapper: {
    marginTop: 15,
    marginBottom: 15,
    flexDirection: "column"
  },
  button: {
    marginRight: 5
  },
  buttonAddNew: {
    backgroundColor: theme.palette.primary.main,
    color: "white"
  },
  buttonDelete: {
    backgroundColor: theme.palette.error.main,
    color: "white"
  },
  buttonExport: {
    backgroundColor: theme.palette.alternative2.main,
    color: "white"
  },
  buttonImport: {
    backgroundColor: theme.palette.alternative1.main,
    color: "white"
  },
  wrapper: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#f3f3f3",
    borderStyle: "solid"
  },
  icon: {
    marginRight: 5
  },
  inputHidden: {
    display: "none"
  }
});

class BaseTable extends PureComponent {
  constructor(props) {
    super(props);

    const { table, aclSelected, export: exportConf } = props;

    /* this additional button added from user configuration at parent component */
    let buttonTopTable = has(table, "buttonTopTable")
      ? table.buttonTopTable
      : {};

    /* if there any configuration for button add new like change color, size and etc just replace it in configuration, this just working on delete and add button */
    let buttonCreate = {};
    let buttonDelete = {};
    let buttonExport = { csv: {}, excel: {} };
    let buttonImport = {};

    /* check acl for button add */
    if (has(aclSelected, "create") && aclSelected.create) {
      buttonCreate = {
        label: "Add New",
        class: props.classes.buttonAddNew,
        onClick: () => props.onToggleFormDialog("Add New"),
        size: "medium",
        variant: "contained",
        style: {},
        href: "",
        type: "button",
        iconName: "Add",
        ...buttonTopTable.create
      };
      buttonTopTable = omit(buttonTopTable, "create");
    }

    if (has(aclSelected, "export") && aclSelected.export) {
      let baseExportButton = {
        label: "",
        class: props.classes.buttonExport,
        onClick: () => {},
        size: "medium",
        variant: "contained",
        style: {},
        href: "",
        type: "button",
        iconName: "CloudDownload"
      };

      if (exportConf.type === "csv") {
        buttonExport.csv = {
          ...baseExportButton,
          label: "CSV",
          onClick: props.onClickExportCsv,
          ...buttonTopTable.exportCsv
        };
        buttonTopTable = omit(buttonTopTable, "exportCsv");
      }

      if (exportConf.type === "excel") {
        buttonExport.excel = {
          ...baseExportButton,
          label: "Excel",
          onClick: props.onClickExportExcel,
          ...buttonTopTable.exportExcel
        };
        buttonTopTable = omit(buttonTopTable, "exportExcel");
      }
    }

    if (has(aclSelected, "import") && aclSelected.import) {
      // check point
      buttonImport = {
        label: "Import",
        class: props.classes.buttonImport,
        size: "medium",
        variant: "contained",
        style: {},
        type: "button",
        iconName: "CloudUpload",
        ...buttonTopTable.import
      };

      buttonTopTable = omit(buttonTopTable, "import");
    }

    /* check acl for button delete */
    if (has(aclSelected, "delete") && aclSelected.delete) {
      buttonDelete = {
        label: "Delete",
        class: props.classes.buttonDelete,
        onClick: props.onClickBulkDelete,
        size: "medium",
        variant: "contained",
        style: {},
        href: "",
        type: "button",
        iconName: "Delete",
        ...buttonTopTable.delete
      };
      buttonTopTable = omit(buttonTopTable, "delete");
    }

    this.button = {
      create: buttonCreate,
      exportCsv: buttonExport.csv,
      exportExcel: buttonExport.excel,
      import: buttonImport,
      delete: buttonDelete,
      ...buttonTopTable
    };

    /* just for flag for the header table and body table */
    this.useAdditionalButtons = false;
    if (
      (has(aclSelected, "delete") && aclSelected.delete) ||
      (has(aclSelected, "update") && aclSelected.update)
    ) {
      this.useAdditionalButtons = true;
    } else if (has(table, "row") && has(table, "additionalButtons")) {
      for (let [index, item] of Object.entries(table.row.additionalButtons)) {
        if (index !== "update" || index !== "create") {
          this.useAdditionalButtons = true;
          break;
        }
      }
    }

    /* this for additional butt in row item */
    this.additionalRowColumn = {
      additionalButtons: {},
      replaceUrl: "",
      attributeName: ""
    };
    if (has(props.table, "row")) {
      this.additionalRowColumn = {
        ...this.additionalRowColumn,
        ...props.table.row
      };
    }
  }

  renderButton() {
    let buttons = [];
    for (let [index, item] of Object.entries(this.button)) {
      if (Object.keys(item).length > 0) {
        /* if the item has the icon name give the icon */
        let IconSelected = "";
        if (has(item, "iconName") && item.iconName !== "") {
          let Icon = require(`@material-ui/icons/${item.iconName}`);
          if (has(Icon, "default")) {
            IconSelected = Icon.default;
          }
        }

        // do something different with import button
        if (index !== "import") {
          buttons.push(
            <Button
              key={index}
              size={item.size}
              style={item.style}
              variant={item.variant}
              onClick={item.type === "button" ? item.onClick : () => {}}
              href={item.type === "link" ? item.href : ""}
              className={classNames(this.props.classes.button, item.class)}
            >
              {IconSelected !== "" && (
                <IconSelected className={this.props.classes.icon} />
              )}
              {item.label}
            </Button>
          );
        } else {
          buttons.push(
            <Fragment key={index}>
              <input
                type="file"
                id="button-upload-file"
                accept=".xls,.xlsx,.csv"
                className={this.props.classes.inputHidden}
                onChange={this.props.doImportData}
              />
              <label htmlFor="button-upload-file">
                <Button
                  size={item.size}
                  style={item.style}
                  component={"span"}
                  variant={item.variant}
                  className={classNames(this.props.classes.button, item.class)}
                >
                  {IconSelected !== "" && (
                    <IconSelected className={this.props.classes.icon} />
                  )}
                  {item.label}
                </Button>
                <Tooltip title="Download Example Data For Import">
                  <IconButton
                    className={this.props.classes.button}
                    aria-label="Download Example Data For Import"
                    onClick={this.props.doDownloadImportdata}
                  >
                    <CloudDownloadIcon />
                  </IconButton>
                </Tooltip>
              </label>
            </Fragment>
          );
        }
      }
    }

    return buttons;
  }

  onChangeOrderBy = orderByNameColumn => {
    let { sort, orderBy } = this.props;

    /* set sorting asc | desc and index orderBy */
    if (orderBy === orderByNameColumn && sort === "asc") {
      sort = "desc";
    } else {
      sort = "asc";
    }

    this.props.onOrderingColumnTable(orderByNameColumn, sort);
  };

  render() {
    const {
      sort,
      data,
      classes,
      orderBy,
      loading,
      isLoading,
      page,
      limit,
      columns,
      aclSelected,
      listChecked,
      onChangePage,
      dataFromProps,
      isCheckAllItem,
      onCheckAllItem,
      onClickCheckbox,
      onToggleFormDialog,
      onChangeRowsPerPage,
      onClickDeleteRowItem,
      deleteAttributeName,
      editAttributeName,
      useCheckbox
    } = this.props;
    return (
      <Fragment>
        <div className={classes.buttonWrapper}>{this.renderButton()}</div>
        <Paper>
          <div className={classes.tableWrapper}>
            <Table component="table" className={classes.table}>
              <BaseTableHeader
                sort={sort}
                orderBy={orderBy}
                columns={columns}
                isCheckAllItem={isCheckAllItem}
                onCheckAllItem={onCheckAllItem}
                onChangeOrderBy={this.onChangeOrderBy}
                useAdditionalButtons={this.useAdditionalButtons}
                checkbox={useCheckbox}
              />
              <BaseTableBody
                data={data}
                columns={columns}
                listChecked={listChecked}
                aclSelected={aclSelected}
                dataFromProps={dataFromProps}
                onClickCheckbox={onClickCheckbox}
                onToggleFormDialog={onToggleFormDialog}
                onClickDeleteRowItem={onClickDeleteRowItem}
                editAttributeName={editAttributeName}
                deleteAttributeName={deleteAttributeName}
                additionalRowColumn={this.additionalRowColumn}
                useAdditionalButtons={this.useAdditionalButtons}
                checkbox={useCheckbox}
              />
            </Table>
          </div>
          {isLoading === true && (
            <div className={classes.loading}>
              <CircularProgress
                size={loading.size}
                style={{ color: loading.color }}
              />
            </div>
          )}
          <TablePagination
            page={page - 1}
            component="div"
            backIconButtonProps={{
              "aria-label": "Previous Page"
            }}
            nextIconButtonProps={{
              "aria-label": "Next Page"
            }}
            rowsPerPage={limit}
            onChangePage={onChangePage}
            rowsPerPageOptions={OptionsConf.limitValue}
            onChangeRowsPerPage={onChangeRowsPerPage}
            count={99999999999999999999999999999999}
            labelDisplayedRows={({ from, to, count }) => `${from} - ${to}`}
          />
        </Paper>
      </Fragment>
    );
  }
}

BaseTable.propTypes = {
  /* required */
  data: PropTypes.array.isRequired,
  sort: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  table: PropTypes.shape({
    row: PropTypes.shape({
      replaceUrl: PropTypes.string,
      attributeName: PropTypes.string,
      additionalButtons: PropTypes.object.isRequired
    }),
    buttonTopTable: PropTypes.object.isRequired
  }).isRequired,
  orderBy: PropTypes.string.isRequired,
  loading: PropTypes.shape({
    size: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired
  }).isRequired,
  classes: PropTypes.object.isRequired,
  listChecked: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  aclSelected: PropTypes.shape({
    create: PropTypes.bool,
    read: PropTypes.bool,
    update: PropTypes.bool,
    delete: PropTypes.bool,
    export: PropTypes.bool,
    import: PropTypes.bool
  }).isRequired,
  onChangePage: PropTypes.func.isRequired,
  isCheckAllItem: PropTypes.bool.isRequired,
  deleteAttributeName: PropTypes.string.isRequired,
  onCheckAllItem: PropTypes.func.isRequired,
  onClickCheckbox: PropTypes.func.isRequired,
  onClickBulkDelete: PropTypes.func.isRequired,
  onClickDeleteRowItem: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  onToggleFormDialog: PropTypes.func.isRequired,
  onOrderingColumnTable: PropTypes.func.isRequired,
  export: PropTypes.shape({
    url: PropTypes.string,
    config: PropTypes.object,
    type: PropTypes.oneOf(OptionsConf.typeExportValue).isRequired
  }).isRequired,
  dataFromProps: PropTypes.bool.isRequired,
  doDownloadImportdata: PropTypes.func.isRequired,
  doImportData: PropTypes.func.isRequired,
  useCheckbox: PropTypes.bool.isRequired
};

export default withStyles(styles)(BaseTable);
