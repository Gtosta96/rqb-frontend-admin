import Edit from '@material-ui/icons/Edit';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { IDocumentClauseResponse } from '../../../interfaces/models/document-clauses';
import MGrid from '../../shared/MGrid';

interface IProps extends RouteComponentProps {
  DocumentClauses: IDocumentClauseResponse[] | null;
  editDocumentClause: (DocumentClauseInfo: IDocumentClauseResponse) => void;
}

function DocumentClausesGrid(props: IProps) {
  function editDocumentClause(DocumentClause: IDocumentClauseResponse) {
    props.editDocumentClause(DocumentClause);
  }

  return (
    props.DocumentClauses && (
      <MGrid
        actions={[
          {
            icon: () => <Edit color="action" />,
            tooltip: "Edit DocumentClause",
            onClick: (event, rowData) => editDocumentClause(rowData as IDocumentClauseResponse)
          }
        ]}
        columns={[
          { title: "Clause ID", field: "clauseId" },
          { title: "Reference", field: "reference" },
          { title: "Title", field: "title" },
          { title: "Specific To Binder", field: "specificToBinder" },
          { title: "Specific To State", field: "specificToStateName" },
          { title: "S3 Path", field: "s3Path" },
          { title: "Type", field: "type" },
          { title: "Created", field: "created" }
        ]}
        rows={props.DocumentClauses}
      />
    )
  );
}

export default React.memo(withRouter(DocumentClausesGrid));
