import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { IClientDocumentResponse } from '../../../interfaces/models/client-documents';
import MGrid from '../../shared/MGrid';

interface IProps extends RouteComponentProps {
  clientDocuments: IClientDocumentResponse[] | null;
  editClientDocument: (ClientDocumentInfo: IClientDocumentResponse) => void;
  deleteClientDocument: (info: IClientDocumentResponse) => void;
}

function ClientDocumentsGrid(props: IProps) {
  function editClientDocument(clientDocument: IClientDocumentResponse) {
    props.editClientDocument(clientDocument);
  }

  function deleteClientDocument(info: IClientDocumentResponse) {
    props.deleteClientDocument(info);
  }

  return (
    props.clientDocuments && (
      <MGrid
        actions={[
          {
            icon: () => <Edit color="action" />,
            tooltip: "Edit Client Document",
            onClick: (event, rowData) => editClientDocument(rowData as IClientDocumentResponse)
          },
          {
            icon: () => <Delete color="action" />,
            tooltip: "Delete Client Document",
            onClick: (event, rowData) => deleteClientDocument(rowData as IClientDocumentResponse)
          }
        ]}
        columns={[
          { title: "Class", field: "documentUiClass" },
          { title: "Applicable Risk(s)", field: "riskListName" },
          { title: "Minimum Document Count", field: "minDocsRequired" },
          { title: "Required Where", field: "requiredIf" },
          { title: "Menu Order", field: "orderNum" }
        ]}
        rows={props.clientDocuments}
      />
    )
  );
}

export default React.memo(withRouter(ClientDocumentsGrid));
