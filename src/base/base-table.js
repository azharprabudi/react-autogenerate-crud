import React, { Component, Fragment } from "react";

/* material ui */
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import CircularProgress from "@material-ui/core/CircularProgress";

/* etc modules */
import has from "lodash/has";
import each from "lodash/each";
import isEqual from "lodash/isEqual";
import PropTypes from "prop-types";

const styles = theme => ({
  loading: {
    position: "absolute",
    left: "48%",
    top: 120
  }
});

class BaseTable extends Component {
  constructor(props) {
    super(props);

    this.initialState = { data: props.data, listLabelSort: { no: false } };
    // set initial state
    this.setInitialState();

    this.state = this.initialState;
  }

  componentDidUpdate(previousProps) {
    if (!isEqual(previousProps.data, this.props.data)) {
      this.setState({
        ...this.state,
        data: this.props.data
      });
    }
  }

  setInitialState = () => {
    /*
      false => asc
      true => desc
    */
    each(this.props.tableOptions.columns, headItem => {
      if (has(headItem, "canBeSort") && headItem.canBeSort === true) {
        this.initialState = {
          ...this.initialState,
          listLabelSort: {
            ...this.initialState.listLabelSort,
            [headItem.objName]: false
          }
        };
      }
    });
  };

  setActiveLabelSort = objName => () => {
    /*
    false => asc
    true => desc
    */
    const valueSort = !this.state.listLabelSort[objName];
    const sort = valueSort === true ? "asc" : "desc";
    this.setState({
      ...this.state,
      data: this.state.data.sort((prev, curr) => {
        if (sort === "asc") {
          return curr[objName] < prev[objName];
        } else {
          return curr[objName] > prev[objName];
        }
      }),
      listLabelSort: {
        ...this.state.listLabelSort,
        [objName]: valueSort
      }
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Table component="table">
          <TableHead component="thead">
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={this.state.listLabelSort.no}
                  direction={this.state.listLabelSort.no ? "desc" : "asc"}
                  onClick={this.setActiveLabelSort("no")}
                >
                  <h3>No</h3>
                </TableSortLabel>
              </TableCell>
              {this.props.tableOptions.columns.map(headItem => (
                <TableCell key={headItem.title}>
                  {has(headItem, "canBeSort") && headItem.canBeSort === true ? (
                    <TableSortLabel
                      active={this.state.listLabelSort[headItem.objName]}
                      direction={
                        this.state.listLabelSort[headItem.objName]
                          ? "desc"
                          : "asc"
                      }
                      onClick={this.setActiveLabelSort(headItem.objName)}
                    >
                      <h3>{headItem.title}</h3>
                    </TableSortLabel>
                  ) : (
                    <h3>{headItem.title}</h3>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody component="tbody">
            {this.state.data.map(bodyItem => {
              return (
                <TableRow key={this.props.startAt + bodyItem.no} hover>
                  <TableCell>{this.props.startAt + bodyItem.no}</TableCell>
                  {this.props.tableOptions.columns.map(headItem => (
                    <TableCell key={bodyItem[headItem.objName]}>
                      {bodyItem[headItem.objName]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {this.props.loading === true && (
          <div className={classes.loading}>
            <CircularProgress
              color={this.props.loadingOptions.color}
              size={this.props.loadingOptions.size}
            />
          </div>
        )}
      </Fragment>
    );
  }
}

BaseTable.propTypes = {
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  tableOptions: PropTypes.object,
  startAt: PropTypes.number
};

BaseTable.defaultProps = {
  loading: false,
  loadingOptions: {
    color: "primary",
    size: 30
  },
  tableOptions: {
    btnAddNew: true,
    btnEdit: true,
    columns: [
      {
        title: "No",
        objName: ""
      }
    ]
  },
  loadingOptions: {
    color: "primary",
    size: 30
  },
  startAt: 0
};

export default withStyles(styles)(BaseTable);
