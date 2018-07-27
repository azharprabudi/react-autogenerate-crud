import React, { PureComponent, Fragment } from "react";

/* material ui */
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import Button from "@material-ui/core/Button";

/* etc modules */
import has from "lodash/has";
import omit from "lodash/omit";
import PropTypes from "prop-types";
import classNames from "classnames";

/* my modules */
import BaseTableHeader from "../components/table/base-table-header";
import BaseTableBody from "../components/table/base-table-body";

/* custom config */
import TableConf from "../constants/table-conf";
import Colors from "../constants/colors";

const styles = theme => ({
  loading: {
    position: "absolute",
    left: "48%",
    top: 120
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: "auto"
  },
  buttonWrapper: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "column"
  },
  button: {
    marginRight: 5
  },
  buttonAddNew: {
    backgroundColor: Colors.blue,
    color: "white"
  },
  buttonDelete: {
    backgroundColor: Colors.red,
    color: "white"
  },
  wrapper: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#f3f3f3",
    borderStyle: "solid"
  },
  icon: {
    marginHorizontal: theme.spacing.unit
  }
});

class BaseTable extends PureComponent {
  constructor(props) {
    super(props);

    /* this additional button added from user configuration at parent component */
    let additionalButton = has(props.tableOptions, "buttonTopTable")
      ? { ...props.tableOptions.buttonTopTable }
      : {};

    /* if there any configuration for button add new like change color, size and etc just replace it in configuration, this just working on delete and add button */
    let configurationAddNewButton = {
      label: "Add New",
      class: props.classes.buttonAddNew,
      onClick: () => alert(1),
      size: "medium",
      variant: "contained",
      style: {},
      href: "",
      type: "button",
      iconName: "Add"
    };

    if (
      has(additionalButton, "addNew") &&
      Object.keys(additionalButton.addNew).length > 0
    ) {
      configurationAddNewButton = {
        ...configurationAddNewButton,
        ...additionalButton.addNew
      };
      /* remove index add new */
      additionalButton = omit(additionalButton, "addNew");
    } else if (
      has(additionalButton, "addNew") &&
      Object.keys(additionalButton.addNew).length === 0
    ) {
      configurationAddNewButton = {};
      /* remove index add new */
      additionalButton = omit(additionalButton, "addNew");
    }

    let configurationDeleteButton = {
      label: "Delete",
      class: props.classes.buttonDelete,
      onClick: props.onClickDelete,
      size: "medium",
      variant: "contained",
      style: {},
      href: "",
      type: "button",
      iconName: "Delete"
    };

    if (
      has(additionalButton, "delete") &&
      Object.keys(additionalButton.delete).length > 0
    ) {
      configurationDeleteButton = {
        ...configurationDeleteButton,
        ...additionalButton.delete
      };
      /* remove index add new */
      additionalButton = omit(additionalButton, "delete");
    } else if (
      has(additionalButton, "delete") &&
      Object.keys(additionalButton.delete).length === 0
    ) {
      configurationDeleteButton = {};
      /* remove index add new */
      additionalButton = omit(additionalButton, "delete");
    }

    this.button = {
      addNew: configurationAddNewButton,
      delete: configurationDeleteButton,
      ...additionalButton
    };
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

        buttons = [
          ...buttons,
          <Button
            key={item.label}
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
        ];
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
      tableOptions,
      loadingOptions,
      checkboxOptions
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
                columns={tableOptions.columns}
                checkbox={checkboxOptions.enable}
                onChangeOrderBy={this.onChangeOrderBy}
                checkAllList={this.props.checkAllList}
                onCheckAllItem={this.props.onCheckAllItem}
                useAdditionalButton={
                  this.props.tableOptions.additionalButtons.enable
                }
              />
              <BaseTableBody
                data={data}
                columns={tableOptions.columns}
                checkbox={checkboxOptions.enable}
                checkboxObjName={checkboxOptions.objName}
                listChecked={this.props.listChecked}
                onClickCheckbox={this.props.onClickCheckbox}
                additionalButtons={this.props.tableOptions.additionalButtons}
              />
            </Table>
          </div>
          {loading === true && (
            <div className={classes.loading}>
              <CircularProgress
                color={loadingOptions.color}
                size={loadingOptions.size}
              />
            </div>
          )}
          <TablePagination
            page={this.props.page - 1}
            component="div"
            backIconButtonProps={{
              "aria-label": "Previous Page"
            }}
            nextIconButtonProps={{
              "aria-label": "Next Page"
            }}
            rowsPerPage={this.props.limit}
            onChangePage={this.props.onChangePage}
            rowsPerPageOptions={TableConf.limitValue}
            onChangeRowsPerPage={this.props.onChangeRowsPerPage}
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
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  sort: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  orderBy: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  onChangePage: PropTypes.func.isRequired,
  tableOptions: PropTypes.object.isRequired,
  checkboxOptions: PropTypes.object.isRequired,
  loadingOptions: PropTypes.object.isRequired,
  listChecked: PropTypes.array.isRequired,
  onClickCheckbox: PropTypes.func.isRequired,
  checkAllList: PropTypes.bool.isRequired,
  onCheckAllItem: PropTypes.func.isRequired,
  onClickDelete: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  onOrderingColumnTable: PropTypes.func.isRequired
};

export default withStyles(styles)(BaseTable);
