import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useObservable } from 'react-use-observable';

import { IBrokerGroupRoutingResponse } from '../../../interfaces/models/broker-group-routing';
import { IUserResponse } from '../../../interfaces/models/user';
import brokerGroupRoutingService from '../../../services/broker-group-routing/broker-group-routing';
import ConfirmDiscardDialog from '../../shared/ConfirmDiscardDialog';
import Feedback from '../../shared/Feedback';
import MGridActions from '../../shared/MGridActions';
import BrokerGroupRoutingForm from './BrokerGroupRoutingForm';
import BrokerGroupRoutingGrid from './BrokerGroupRoutingGrid';

interface IProps extends RouteComponentProps {}

function BrokerGroupRouting(props: IProps) {
  const user: IUserResponse = props.location.state.user;

  const [brokerGroupRoutingState] = useObservable(() => {
    getRoutes();
    return brokerGroupRoutingService.listenState();
  }, []);

  const [route, setRoute] = useState<IBrokerGroupRoutingResponse>();
  const [deleteHandler, setDeleteHandler] = useState<
    { showConfirmModal: boolean; route: IBrokerGroupRoutingResponse } | undefined
  >();

  function setRouteFn(data?: IBrokerGroupRoutingResponse) {
    setRoute(({ ...data } || {}) as IBrokerGroupRoutingResponse);
  }

  function clearRouteFn() {
    setRoute(undefined);
  }

  function confirmDeleteRoute(data: IBrokerGroupRoutingResponse) {
    setDeleteHandler({ showConfirmModal: true, route: data });
  }

  function deleteRoute(confirm: boolean) {
    if (confirm && deleteHandler && deleteHandler.route) {
      brokerGroupRoutingService.deleteRoute(user.appUserId, deleteHandler.route);
    }

    setDeleteHandler(undefined);
  }

  function getRoutes() {
    brokerGroupRoutingService.getRoutes(user.appUserId);
  }

  return (
    <>
      {deleteHandler && deleteHandler.showConfirmModal && (
        <ConfirmDiscardDialog
          open={true}
          onClose={deleteRoute}
          content={
            "Are you sure you want to delete this route. This will prevent the user from submitting requests for the risk(s)"
          }
        />
      )}

      {brokerGroupRoutingState && (
        <Feedback loading={brokerGroupRoutingState.loading} error={brokerGroupRoutingState.error}>
          <MGridActions
            openDrawer={!!route}
            onCloseDrawer={clearRouteFn}
            newUser={setRouteFn}
            refresh={getRoutes}
            formListener={brokerGroupRoutingService.listenRoute}
            form={<BrokerGroupRoutingForm appUserId={user.appUserId} info={route} />}
          />

          <BrokerGroupRoutingGrid
            title={user.fullName}
            routes={brokerGroupRoutingState.payload}
            editRoute={setRouteFn}
            deleteRoute={confirmDeleteRoute}
          />
        </Feedback>
      )}
    </>
  );
}

export default React.memo(BrokerGroupRouting);
