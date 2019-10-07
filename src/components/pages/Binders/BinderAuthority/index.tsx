import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useObservable } from 'react-use-observable';

import { IBinderAuthorityResponse } from '../../../../interfaces/models/binder-authority';
import { IBinderResponse } from '../../../../interfaces/models/binders';
import binderAuthorityService from '../../../../services/binders/binder-authority';
import ConfirmDiscardDialog from '../../../shared/ConfirmDiscardDialog';
import Feedback from '../../../shared/Feedback';
import MGridActions from '../../../shared/MGridActions';
import BinderAuthorityForm from './BinderAuthorityForm';
import BinderAuthorityGrid from './BinderAuthorityGrid';

interface IProps extends RouteComponentProps {}

function BinderAuthority(props: IProps) {
  const binder: IBinderResponse = props.location.state.binder;

  const [brokerGroupRoutingState] = useObservable(() => {
    getBinderAuthorities();
    return binderAuthorityService.listenState();
  }, []);

  const [binderAuthority, setBinderAuthority] = useState<IBinderAuthorityResponse>();
  const [deleteHandler, setDeleteHandler] = useState<
    { showConfirmModal: boolean; binderAuthority: IBinderAuthorityResponse } | undefined
  >();

  function setBinderAuthorityFn(data?: IBinderAuthorityResponse) {
    setBinderAuthority(({ ...data } || {}) as IBinderAuthorityResponse);
  }

  function clearBinderAuthorityFn() {
    setBinderAuthority(undefined);
  }

  function confirmDeleteBinderAuthority(data: IBinderAuthorityResponse) {
    setDeleteHandler({ showConfirmModal: true, binderAuthority: data });
  }

  function deleteBinderAuthority(confirm: boolean) {
    if (confirm && deleteHandler && deleteHandler.binderAuthority) {
      binderAuthorityService.deleteBinderAuthority(binder.binderId, deleteHandler.binderAuthority);
    }

    setDeleteHandler(undefined);
  }

  function getBinderAuthorities() {
    binderAuthorityService.getBinderAuthorities(binder.binderId);
  }

  return (
    <>
      {deleteHandler && deleteHandler.showConfirmModal && (
        <ConfirmDiscardDialog
          open={true}
          onClose={deleteBinderAuthority}
          content={
            "Are you sure you want to delete this route. This will prevent the user from submitting requests for the risk(s)"
          }
        />
      )}

      {brokerGroupRoutingState && (
        <Feedback loading={brokerGroupRoutingState.loading} error={brokerGroupRoutingState.error}>
          <MGridActions
            openDrawer={!!binderAuthority}
            onCloseDrawer={clearBinderAuthorityFn}
            add={setBinderAuthorityFn}
            refresh={getBinderAuthorities}
            formListener={binderAuthorityService.listenBinderAuthorities}
            form={<BinderAuthorityForm binderId={binder.binderId} info={binderAuthority} />}
          />

          <BinderAuthorityGrid
            title={binder.binderUiName}
            binderAuthorities={brokerGroupRoutingState.payload}
            editBinderAuthority={setBinderAuthorityFn}
            deleteBinderAuthority={confirmDeleteBinderAuthority}
          />
        </Feedback>
      )}
    </>
  );
}

export default React.memo(BinderAuthority);
