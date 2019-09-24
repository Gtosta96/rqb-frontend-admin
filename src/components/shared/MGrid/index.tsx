import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MaterialTable, { Action, Column, Options, Query, QueryResult } from 'material-table';
import React from 'react';

import icons from './icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(3)
    }
  })
);

type IProps<RowData extends object> = {
  title?: string;
  actions?: (Action<RowData> | ((rowData: RowData) => Action<RowData>))[] | undefined;
  columns: Column<RowData>[];
  rows: RowData[] | ((query: Query<RowData>) => Promise<QueryResult<RowData>>);
  options?: Options | undefined;
};

function MGrid<RowData extends object>(props: IProps<RowData>) {
  const classes = useStyles();
  const { title, actions, columns, rows, options } = props;

  return (
    <div className={classes.root}>
      <MaterialTable
        title={title}
        icons={icons}
        actions={actions}
        columns={columns}
        data={rows}
        options={{
          paging: false,
          ...options
        }}
      />
    </div>
  );
}

MGrid.defaultProps = {
  options: {},
  title: ""
};

// Do not use React.Memo
// REF: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/37087
export default MGrid;
