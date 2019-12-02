import React, { useState } from 'react';
import { useObservable } from 'react-use-observable';

import { IDocumentScheduleResponse } from '../../../interfaces/models/document-schedules';
import documentSchedulesService from '../../../services/document-schedules/document-schedules';
import ConfirmDiscardDialog from '../../shared/ConfirmDiscardDialog';
import Feedback from '../../shared/Feedback';
import MGridActions from '../../shared/MGridActions';
import DocumentSchedulesForm from './DocumentSchedulesForm';
import DocumentSchedulesGrid from './DocumentSchedulesGrid';

function DocumentSchedules() {
  const [documentSchedulesState] = useObservable(() => {
    getDocumentSchedules(false);
    return documentSchedulesService.listenState();
  }, []);

  const [documentSchedule, setDocumentSchedule] = useState<IDocumentScheduleResponse>();
  const [deleteHandler, setDeleteHandler] = useState<
    { showConfirmModal: boolean; docSchedule: IDocumentScheduleResponse } | undefined
  >();

  function setDocumentScheduleFn(data?: IDocumentScheduleResponse) {
    setDocumentSchedule(({ ...data } || {}) as IDocumentScheduleResponse);
  }

  function clearDocumentScheduleFn() {
    setDocumentSchedule(undefined);
  }

  function confirmDeleteDocSchedule(data: IDocumentScheduleResponse) {
    setDeleteHandler({ showConfirmModal: true, docSchedule: data });
  }

  function deleteDocSchedule(confirm: boolean) {
    if (confirm && deleteHandler && deleteHandler.docSchedule) {
      documentSchedulesService.deleteDocumentSchedule(deleteHandler.docSchedule.documentScheduleId);
    }

    setDeleteHandler(undefined);
  }

  function getDocumentSchedules(force: boolean = true) {
    documentSchedulesService.getDocumentSchedules(force);
  }

  return (
    <>
      {deleteHandler && deleteHandler.showConfirmModal && (
        <ConfirmDiscardDialog
          open={true}
          onClose={deleteDocSchedule}
          content={
            "Are you sure you want to delete this. This will prevent the user from submitting requests for the risk(s)"
          }
        />
      )}

      {documentSchedulesState && (
        <Feedback loading={documentSchedulesState.loading} error={documentSchedulesState.error}>
          <MGridActions
            openDrawer={!!documentSchedule}
            onCloseDrawer={clearDocumentScheduleFn}
            add={setDocumentScheduleFn}
            refresh={getDocumentSchedules}
            formListener={documentSchedulesService.listenDocumentSchedule}
            form={<DocumentSchedulesForm info={documentSchedule} />}
          />
          <DocumentSchedulesGrid
            documentSchedules={documentSchedulesState.payload}
            editDocumentSchedule={setDocumentScheduleFn}
            deleteDocSchedule={confirmDeleteDocSchedule}
          />
        </Feedback>
      )}
    </>
  );
}

export default React.memo(DocumentSchedules);
