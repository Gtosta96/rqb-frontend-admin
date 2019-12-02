import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { booleanToString } from '../../../helpers/functions';
import { IDocumentScheduleResponse } from '../../../interfaces/models/document-schedules';
import MGrid from '../../shared/MGrid';

interface IProps extends RouteComponentProps {
  documentSchedules: IDocumentScheduleResponse[] | null;
  editDocumentSchedule: (DocumentScheduleInfo: IDocumentScheduleResponse) => void;
  deleteDocSchedule: (info: IDocumentScheduleResponse) => void;
}

function DocumentSchedulesGrid(props: IProps) {
  function editDocumentSchedule(documentSchedule: IDocumentScheduleResponse) {
    props.editDocumentSchedule(documentSchedule);
  }

  function deleteDocSchedule(info: IDocumentScheduleResponse) {
    props.deleteDocSchedule(info);
  }

  return (
    props.documentSchedules && (
      <MGrid
        actions={[
          {
            icon: () => <Edit color="action" />,
            tooltip: "Edit Document Schedule",
            onClick: (event, rowData) => editDocumentSchedule(rowData as IDocumentScheduleResponse)
          },
          {
            icon: () => <Delete color="action" />,
            tooltip: "Delete Document Schedule",
            onClick: (event, rowData) => deleteDocSchedule(rowData as IDocumentScheduleResponse)
          }
        ]}
        columns={[
          { title: "Binder", field: "binder" },
          { title: "Questionnaire", field: "questionnaire" },
          { title: "Applicable Risk(s)", field: "riskListName" },
          { title: "Class", field: "documentUiClass" },
          { title: "Template", field: "docTemplate" },
          { title: "Output Title", field: "outputTitle" },
          { title: "Generate On", field: "generatedOnAction" },
          { title: "Affects", field: "affects" },
          {
            title: "Combined Doc",
            field: "isCombined",
            render: rowData => booleanToString(rowData, "isCombined")
          },
          { title: "Output Format", field: "generateAs" },
          { title: "Specific  State", field: "specificStateName" },
          { title: "Specific Country", field: "specificCountryName" }
        ]}
        rows={props.documentSchedules}
      />
    )
  );
}

export default React.memo(withRouter(DocumentSchedulesGrid));
