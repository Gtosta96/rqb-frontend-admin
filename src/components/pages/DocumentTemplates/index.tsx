import React, { useState } from 'react';
import { useObservable } from 'react-use-observable';

import { IDocumentTemplateResponse } from '../../../interfaces/models/document-templates';
import documentTemplatesService from '../../../services/document-templates/document-templates';
import Feedback from '../../shared/Feedback';
import MGridActions from '../../shared/MGridActions';
import DocumentTemplatesForm from './DocumentTemplatesForm';
import DocumentTemplatesGrid from './DocumentTemplatesGrid';

function DocumentTemplates() {
  const [documentTemplatesState] = useObservable(() => {
    getDocumentTemplates(false);
    return documentTemplatesService.listenState();
  }, []);

  const [documentTemplate, setDocumentTemplate] = useState<IDocumentTemplateResponse>();

  function setDocumentTemplateFn(data?: IDocumentTemplateResponse) {
    setDocumentTemplate(({ ...data } || {}) as IDocumentTemplateResponse);
  }

  function clearDocumentTemplateFn() {
    setDocumentTemplate(undefined);
  }

  function getDocumentTemplates(force: boolean = true) {
    documentTemplatesService.getDocumentTemplates(force);
  }

  return (
    <>
      {documentTemplatesState && (
        <Feedback loading={documentTemplatesState.loading} error={documentTemplatesState.error}>
          <MGridActions
            openDrawer={!!documentTemplate}
            onCloseDrawer={clearDocumentTemplateFn}
            add={setDocumentTemplateFn}
            refresh={getDocumentTemplates}
            formListener={documentTemplatesService.listenDocumentTemplate}
            form={<DocumentTemplatesForm info={documentTemplate} />}
          />
          <DocumentTemplatesGrid
            documentTemplates={documentTemplatesState.payload}
            editDocumentTemplate={setDocumentTemplateFn}
          />
        </Feedback>
      )}
    </>
  );
}

export default React.memo(DocumentTemplates);
