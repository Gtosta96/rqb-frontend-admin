import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { booleanToString } from '../../../helpers/functions';
import { IDocumentAttributesResponse } from '../../../interfaces/models/document-attributes';
import MGrid from '../../shared/MGrid';

interface IProps extends RouteComponentProps {
  documentAttributes: IDocumentAttributesResponse[] | null;
  editDocumentAttribute: (documentAttributeInfo: IDocumentAttributesResponse) => void;
  deleteDocumentAttribute: (info: IDocumentAttributesResponse) => void;
}

function DocumentAttributesGrid(props: IProps) {
  function editDocumentAttribute(documentAttribute: IDocumentAttributesResponse) {
    props.editDocumentAttribute(documentAttribute);
  }

  function deleteDocumentAttribute(info: IDocumentAttributesResponse) {
    props.deleteDocumentAttribute(info);
  }

  return (
    props.documentAttributes && (
      <MGrid
        actions={[
          {
            icon: () => <Edit color="action" />,
            tooltip: "Edit Document Attributes",
            onClick: (event, rowData) =>
              editDocumentAttribute(rowData as IDocumentAttributesResponse)
          },
          {
            icon: () => <Delete color="action" />,
            tooltip: "Delete Document Attributes",
            onClick: (event, rowData) =>
              deleteDocumentAttribute(rowData as IDocumentAttributesResponse)
          }
        ]}
        columns={[
          { title: "Binder", field: "binder" },
          { title: "Class", field: "documentUiClass" },
          { title: "Tag Name", field: "tagName" },
          { title: "Format", field: "format" },
          {
            title: "Comma Separator",
            field: "commaSeparator",
            render: rowData => booleanToString(rowData, "commaSeparator")
          }
        ]}
        rows={props.documentAttributes}
      />
    )
  );
}

export default React.memo(withRouter(DocumentAttributesGrid));
