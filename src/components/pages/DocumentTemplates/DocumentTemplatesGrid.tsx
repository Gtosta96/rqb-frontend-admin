import Edit from '@material-ui/icons/Edit';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { IDocumentTemplateResponse } from '../../../interfaces/models/document-templates';
import MGrid from '../../shared/MGrid';

interface IProps extends RouteComponentProps {
  documentTemplates: IDocumentTemplateResponse[] | null;
  editDocumentTemplate: (DocumentTemplateInfo: IDocumentTemplateResponse) => void;
}

function DocumentTemplatesGrid(props: IProps) {
  function editDocumentTemplate(documentTemplate: IDocumentTemplateResponse) {
    props.editDocumentTemplate(documentTemplate);
  }

  return (
    props.documentTemplates && (
      <MGrid
        actions={[
          {
            icon: () => <Edit color="action" />,
            tooltip: "Edit Document Template",
            onClick: (event, rowData) => editDocumentTemplate(rowData as IDocumentTemplateResponse)
          }
        ]}
        columns={[
          { title: "Template ID", field: "templateId" },
          { title: "Specific To Binder", field: "specificToBinder" },
          { title: "Applicable Risk(s)", field: "riskListName" },
          { title: "Class", field: "documentUiClass" },
          { title: "Title", field: "title" },
          { title: "S3 Path", field: "s3Path" },
          { title: "Type", field: "type" },
          { title: "Created", field: "created" }
        ]}
        rows={props.documentTemplates}
      />
    )
  );
}

export default React.memo(withRouter(DocumentTemplatesGrid));
