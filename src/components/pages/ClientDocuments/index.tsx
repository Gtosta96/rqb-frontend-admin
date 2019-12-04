import React, { useState } from 'react';
import { useObservable } from 'react-use-observable';

import { IClientDocumentResponse } from '../../../interfaces/models/client-documents';
import clientDocumentsService from '../../../services/client-documents/client-documents';
import ConfirmDiscardDialog from '../../shared/ConfirmDiscardDialog';
import Feedback from '../../shared/Feedback';
import MGridActions from '../../shared/MGridActions';
import ClientDocumentsForm from './ClientDocumentsForm';
import ClientDocumentsGrid from './ClientDocumentsGrid';

function ClientDocuments() {
  const [clientDocumentsState] = useObservable(() => {
    getClientDocuments(false);
    return clientDocumentsService.listenState();
  }, []);

  const [clientDocument, setClientDocument] = useState<IClientDocumentResponse>();
  const [deleteHandler, setDeleteHandler] = useState<
    { showConfirmModal: boolean; clientDoc: IClientDocumentResponse } | undefined
  >();

  function setClientDocumentFn(data?: IClientDocumentResponse) {
    setClientDocument(({ ...data } || {}) as IClientDocumentResponse);
  }

  function clearClientDocumentFn() {
    setClientDocument(undefined);
  }

  function confirmDeleteDocSchedule(data: IClientDocumentResponse) {
    setDeleteHandler({ showConfirmModal: true, clientDoc: data });
  }

  function deleteDocSchedule(confirm: boolean) {
    if (confirm && deleteHandler && deleteHandler.clientDoc) {
      clientDocumentsService.deleteClientDocument(deleteHandler.clientDoc);
    }

    setDeleteHandler(undefined);
  }

  function getClientDocuments(force: boolean = true) {
    clientDocumentsService.getClientDocuments(force);
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

      {clientDocumentsState && (
        <Feedback loading={clientDocumentsState.loading} error={clientDocumentsState.error}>
          <MGridActions
            openDrawer={!!clientDocument}
            onCloseDrawer={clearClientDocumentFn}
            add={setClientDocumentFn}
            refresh={getClientDocuments}
            formListener={clientDocumentsService.listenClientDocument}
            form={<ClientDocumentsForm info={clientDocument} />}
          />
          <ClientDocumentsGrid
            clientDocuments={clientDocumentsState.payload}
            editClientDocument={setClientDocumentFn}
            deleteClientDocument={confirmDeleteDocSchedule}
          />
        </Feedback>
      )}
    </>
  );
}

export default React.memo(ClientDocuments);
