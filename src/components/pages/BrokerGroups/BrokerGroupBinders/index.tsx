import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useObservable } from 'react-use-observable';

import { IBrokerGroupBindersResponse, IBrokerGroupsResponse } from '../../../../interfaces/models/broker-groups';
import brokerGroupBindersService from '../../../../services/broker-groups/broker-group-binders';
import ConfirmDiscardDialog from '../../../shared/ConfirmDiscardDialog';
import Feedback from '../../../shared/Feedback';
import MGridActions from '../../../shared/MGridActions';
import BrokerGroupBindersForm from './BrokerGroupBindersForm';
import BrokerGroupBindersGrid from './BrokerGroupBindersGrid';

interface IProps extends RouteComponentProps {}

function BrokerGroupBinders(props: IProps) {
  const brokerGroup: IBrokerGroupsResponse = props.location.state.brokerGroup;

  const [brokerGroupBindersState] = useObservable(() => {
    getBgBinders();
    return brokerGroupBindersService.listenState();
  }, []);

  const [bgBinder, setBgBinder] = useState<IBrokerGroupBindersResponse>();
  const [deleteHandler, setDeleteHandler] = useState<
    { showConfirmModal: boolean; bgBinder: IBrokerGroupBindersResponse } | undefined
  >();

  function setBgBinderFn(data?: IBrokerGroupBindersResponse) {
    setBgBinder(({ ...data } || {}) as IBrokerGroupBindersResponse);
  }

  function clearBgBinderFn() {
    setBgBinder(undefined);
  }

  function confirmDeleteBgBinder(data: IBrokerGroupBindersResponse) {
    setDeleteHandler({ showConfirmModal: true, bgBinder: data });
  }

  function deleteBgBinder(confirm: boolean) {
    if (confirm && deleteHandler && deleteHandler.bgBinder) {
      brokerGroupBindersService.deleteBrokerGroupBinder(
        brokerGroup.brokerGroupId,
        deleteHandler.bgBinder
      );
    }

    setDeleteHandler(undefined);
  }

  function getBgBinders() {
    brokerGroupBindersService.getBrokerGroupBinders(brokerGroup.brokerGroupId);
  }

  return (
    <>
      {deleteHandler && deleteHandler.showConfirmModal && (
        <ConfirmDiscardDialog
          open={true}
          onClose={deleteBgBinder}
          content={
            "Are you sure you want to delete this route. This will prevent the user from submitting requests for the risk(s)"
          }
        />
      )}

      {brokerGroupBindersState && (
        <Feedback loading={brokerGroupBindersState.loading} error={brokerGroupBindersState.error}>
          <MGridActions
            openDrawer={!!bgBinder}
            onCloseDrawer={clearBgBinderFn}
            add={setBgBinderFn}
            refresh={getBgBinders}
            formListener={brokerGroupBindersService.listenBrokerGroupBinders}
            form={<BrokerGroupBindersForm brokerGroup={brokerGroup} info={bgBinder} />}
          />

          {brokerGroupBindersState.payload && (
            <BrokerGroupBindersGrid
              title={`#${brokerGroup.brokerGroupId} - ${brokerGroup.name}`}
              brokerGroupBinders={brokerGroupBindersState.payload.brokerGroupBinders}
              editBgBinder={setBgBinderFn}
              deleteBgBinder={confirmDeleteBgBinder}
            />
          )}
        </Feedback>
      )}
    </>
  );
}

export default React.memo(BrokerGroupBinders);
