import React, { useState } from 'react';
import { useObservable } from 'react-use-observable';

import { IDocumentClauseResponse } from '../../../interfaces/models/document-clauses';
import documentClausesService from '../../../services/document-clauses/document-clauses';
import Feedback from '../../shared/Feedback';
import MGridActions from '../../shared/MGridActions';
import DocumentClausesForm from './DocumentClausesForm';
import DocumentClausesGrid from './DocumentClausesGrid';

function DocumentClauses() {
  const [documentClausesState] = useObservable(() => {
    getDocumentClauses(false);
    return documentClausesService.listenState();
  }, []);

  const [documentClause, setDocumentClause] = useState<IDocumentClauseResponse>();

  function setDocumentClauseFn(data?: IDocumentClauseResponse) {
    setDocumentClause(({ ...data } || {}) as IDocumentClauseResponse);
  }

  function clearDocumentClauseFn() {
    setDocumentClause(undefined);
  }

  function getDocumentClauses(force: boolean = true) {
    documentClausesService.getDocumentClauses(force);
  }

  return (
    <>
      {documentClausesState && (
        <Feedback loading={documentClausesState.loading} error={documentClausesState.error}>
          <MGridActions
            openDrawer={!!documentClause}
            onCloseDrawer={clearDocumentClauseFn}
            add={setDocumentClauseFn}
            refresh={getDocumentClauses}
            formListener={documentClausesService.listenDocumentClause}
            form={<DocumentClausesForm info={documentClause} />}
          />
          <DocumentClausesGrid
            DocumentClauses={documentClausesState.payload}
            editDocumentClause={setDocumentClauseFn}
          />
        </Feedback>
      )}
    </>
  );
}

export default React.memo(DocumentClauses);
