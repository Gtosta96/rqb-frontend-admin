import React, { useState } from 'react';
import { useObservable } from 'react-use-observable';

import { IDocumentAttributesResponse } from '../../../interfaces/models/document-attributes';
import documentAttributesService from '../../../services/document-attributes/document-attributes';
import ConfirmDiscardDialog from '../../shared/ConfirmDiscardDialog';
import Feedback from '../../shared/Feedback';
import MGridActions from '../../shared/MGridActions';
import DocumentAttributesForm from './DocumentAttributesForm';
import DocumentAttributesGrid from './DocumentAttributesGrid';

function DocumentAttributes() {
  const [documentAttributesState] = useObservable(() => {
    getDocumentAttributes(false);
    return documentAttributesService.listenState();
  }, []);

  const [documentAttribute, setDocumentAttribute] = useState<IDocumentAttributesResponse>();
  const [deleteHandler, setDeleteHandler] = useState<
    { showConfirmModal: boolean; clientDoc: IDocumentAttributesResponse } | undefined
  >();

  function setDocumentAttributeFn(data?: IDocumentAttributesResponse) {
    setDocumentAttribute(({ ...data } || {}) as IDocumentAttributesResponse);
  }

  function clearDocumentAttributeFn() {
    setDocumentAttribute(undefined);
  }

  function confirmDeleteDocSchedule(data: IDocumentAttributesResponse) {
    setDeleteHandler({ showConfirmModal: true, clientDoc: data });
  }

  function deleteDocSchedule(confirm: boolean) {
    if (confirm && deleteHandler && deleteHandler.clientDoc) {
      documentAttributesService.deleteDocumentAttribute(deleteHandler.clientDoc);
    }

    setDeleteHandler(undefined);
  }

  function getDocumentAttributes(force: boolean = true) {
    documentAttributesService.getDocumentAttributes(force);
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

      {documentAttributesState && (
        <Feedback loading={documentAttributesState.loading} error={documentAttributesState.error}>
          <MGridActions
            openDrawer={!!documentAttribute}
            onCloseDrawer={clearDocumentAttributeFn}
            add={setDocumentAttributeFn}
            refresh={getDocumentAttributes}
            formListener={documentAttributesService.listenDocumentAttribute}
            form={<DocumentAttributesForm info={documentAttribute} />}
          />
          <DocumentAttributesGrid
            documentAttributes={documentAttributesState.payload}
            editDocumentAttribute={setDocumentAttributeFn}
            deleteDocumentAttribute={confirmDeleteDocSchedule}
          />
        </Feedback>
      )}
    </>
  );
}

export default React.memo(DocumentAttributes);
