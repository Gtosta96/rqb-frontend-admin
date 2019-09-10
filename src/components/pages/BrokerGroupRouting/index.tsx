import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useObservable } from 'react-use-observable';

import { IBrokerGroupRoutingResponse } from '../../../interfaces/models/broker-group-routing';
import { IUserResponse } from '../../../interfaces/models/user';
import brokerGroupRoutingService from '../../../services/broker-group-routing/broker-group-routing';
import ConfirmDiscardDialog from '../../shared/ConfirmDiscardDialog';
import Feedback from '../../shared/Feedback';
import DataGrid from './DataGrid';
import DataGridActions from './DataGridActions';

interface IProps extends RouteComponentProps {}

const BrokerGroupRouting: React.FC<IProps> = props => {
  const user: IUserResponse = props.location.state.user;

  const [brokerGroupRoutingState] = useObservable(() => {
    getRoutes();
    return brokerGroupRoutingService.listenState();
  }, []);

  const [routeInfo, setRoute] = useState<IBrokerGroupRoutingResponse>();
  const [deleteHandler, setDeleteHandler] = useState<
    { showConfirmModal: boolean; route: IBrokerGroupRoutingResponse } | undefined
  >();

  function setRouteFn(data?: IBrokerGroupRoutingResponse) {
    setRoute(({ ...data } || {}) as IBrokerGroupRoutingResponse);
  }

  function confirmDeleteRoute(data: IBrokerGroupRoutingResponse) {
    setDeleteHandler({ showConfirmModal: true, route: data });
  }

  function deleteRoute(discard: boolean) {
    if (!discard && deleteHandler && deleteHandler.route) {
      brokerGroupRoutingService.deleteRoute(user.appUserId, deleteHandler.route);
    }

    setDeleteHandler(undefined);
  }

  function getRoutes() {
    brokerGroupRoutingService.getRoutes(user.appUserId);
  }

  // ----- //

  function loadGrid() {
    return (
      brokerGroupRoutingState && (
        <Feedback loading={brokerGroupRoutingState.loading} error={brokerGroupRoutingState.error}>
          <DataGrid
            routes={brokerGroupRoutingState.payload}
            editRoute={setRouteFn}
            deleteRoute={confirmDeleteRoute}
          />
        </Feedback>
      )
    );
  }

  return (
    <>
      {deleteHandler && deleteHandler.showConfirmModal && (
        <ConfirmDiscardDialog open={true} onClose={deleteRoute} />
      )}

      <DataGridActions
        appUserId={user.appUserId}
        routeInfo={routeInfo}
        newRoute={setRouteFn}
        refresh={getRoutes}
      />
      {loadGrid()}
    </>
  );
};

export default React.memo(BrokerGroupRouting);
