import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useObservable } from 'react-use-observable';

import { IBrokerGroupsResponse, IBrokerGroupUsersResponse } from '../../../../interfaces/models/broker-groups';
import brokerGroupUsersService from '../../../../services/broker-groups/broker-group-users';
import ConfirmDiscardDialog from '../../../shared/ConfirmDiscardDialog';
import Feedback from '../../../shared/Feedback';
import MGridActions from '../../../shared/MGridActions';
import BrokerGroupUsersForm from './BrokerGroupUsersForm';
import BrokerGroupUsersGrid from './BrokerGroupUsersGrid';

interface IProps extends RouteComponentProps {}

function BrokerGroupUsers(props: IProps) {
  const brokerGroup: IBrokerGroupsResponse = props.location.state.brokerGroup;

  const [brokerGroupBindersState] = useObservable(() => {
    getBgUsers();
    return brokerGroupUsersService.listenState();
  }, []);

  const [bgUser, setBgUser] = useState<IBrokerGroupUsersResponse>();
  const [deleteHandler, setDeleteHandler] = useState<
    { showConfirmModal: boolean; bgUser: IBrokerGroupUsersResponse } | undefined
  >();

  function setBgUserFn(data?: IBrokerGroupUsersResponse) {
    setBgUser(({ ...data } || {}) as IBrokerGroupUsersResponse);
  }

  function clearBgUserFn() {
    setBgUser(undefined);
  }

  function confirmDeleteBgUser(data: IBrokerGroupUsersResponse) {
    setDeleteHandler({ showConfirmModal: true, bgUser: data });
  }

  function deleteBgUser(confirm: boolean) {
    if (confirm && deleteHandler && deleteHandler.bgUser) {
      brokerGroupUsersService.deleteBrokerGroupUser(
        brokerGroup.brokerGroupId,
        deleteHandler.bgUser
      );
    }

    setDeleteHandler(undefined);
  }

  function getBgUsers() {
    brokerGroupUsersService.getBrokerGroupUsers(brokerGroup.brokerGroupId);
  }

  return (
    <>
      {deleteHandler && deleteHandler.showConfirmModal && (
        <ConfirmDiscardDialog
          open={true}
          onClose={deleteBgUser}
          content={
            "Are you sure you want to delete this route. This will prevent the user from submitting requests for the risk(s)"
          }
        />
      )}

      {brokerGroupBindersState && (
        <Feedback loading={brokerGroupBindersState.loading} error={brokerGroupBindersState.error}>
          <MGridActions
            openDrawer={!!bgUser}
            onCloseDrawer={clearBgUserFn}
            add={setBgUserFn}
            refresh={getBgUsers}
            formListener={brokerGroupUsersService.listenBrokerGroupUsers}
            form={<BrokerGroupUsersForm brokerGroup={brokerGroup} info={bgUser} />}
          />

          {brokerGroupBindersState.payload && (
            <BrokerGroupUsersGrid
              title={`#${brokerGroup.brokerGroupId} - ${brokerGroup.name}`}
              brokerGroupUsers={brokerGroupBindersState.payload.brokerGroupUsers}
              editBgUser={setBgUserFn}
              deleteBgUser={confirmDeleteBgUser}
            />
          )}
        </Feedback>
      )}
    </>
  );
}

export default React.memo(BrokerGroupUsers);
