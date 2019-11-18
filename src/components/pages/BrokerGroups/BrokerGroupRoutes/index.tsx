import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useObservable } from 'react-use-observable';

import { IBrokerGroupRoutesResponse, IBrokerGroupsResponse } from '../../../../interfaces/models/broker-groups';
import brokerGroupRoutesService from '../../../../services/broker-groups/broker-group-routes';
import ConfirmDiscardDialog from '../../../shared/ConfirmDiscardDialog';
import Feedback from '../../../shared/Feedback';
import MGridActions from '../../../shared/MGridActions';
import BrokerGroupRoutesForm from './BrokerGroupRoutesForm';
import BrokerGroupRoutesGrid from './BrokerGroupRoutesGrid';

interface IProps extends RouteComponentProps {}

function BrokerGroupRoutes(props: IProps) {
  const brokerGroup: IBrokerGroupsResponse = props.location.state.brokerGroup;

  const [brokerGroupRoutesState] = useObservable(() => {
    getBgRoutes();
    return brokerGroupRoutesService.listenState();
  }, []);

  const [bgRoute, setBgRoute] = useState<IBrokerGroupRoutesResponse>();
  const [deleteHandler, setDeleteHandler] = useState<
    { showConfirmModal: boolean; commission: IBrokerGroupRoutesResponse } | undefined
  >();

  function setBgRouteFn(data?: IBrokerGroupRoutesResponse) {
    setBgRoute(({ ...data } || {}) as IBrokerGroupRoutesResponse);
  }

  function clearBgRouteFn() {
    setBgRoute(undefined);
  }

  function confirmDeleteBgRoute(data: IBrokerGroupRoutesResponse) {
    setDeleteHandler({ showConfirmModal: true, commission: data });
  }

  function deleteBgRoute(confirm: boolean) {
    if (confirm && deleteHandler && deleteHandler.commission) {
      brokerGroupRoutesService.deleteBrokerGroupRoute(
        brokerGroup.brokerGroupId,
        deleteHandler.commission as any
      );
    }

    setDeleteHandler(undefined);
  }

  function getBgRoutes() {
    brokerGroupRoutesService.getBrokerGroupRoutes(brokerGroup.brokerGroupId);
  }

  return (
    <>
      {deleteHandler && deleteHandler.showConfirmModal && (
        <ConfirmDiscardDialog
          open={true}
          onClose={deleteBgRoute}
          content={
            "Are you sure you want to delete this route. This will prevent the user from submitting requests for the risk(s)"
          }
        />
      )}

      {brokerGroupRoutesState && (
        <Feedback loading={brokerGroupRoutesState.loading} error={brokerGroupRoutesState.error}>
          <MGridActions
            openDrawer={!!bgRoute}
            onCloseDrawer={clearBgRouteFn}
            add={setBgRouteFn}
            refresh={getBgRoutes}
            formListener={brokerGroupRoutesService.listenBrokerGroupRoutes}
            form={<BrokerGroupRoutesForm brokerGroup={brokerGroup} info={bgRoute} />}
          />

          {brokerGroupRoutesState.payload && (
            <BrokerGroupRoutesGrid
              title={`#${brokerGroup.brokerGroupId} - ${brokerGroup.name}`}
              brokerGroupRoutes={brokerGroupRoutesState.payload.brokerGroupRoutes}
              deleteBgRoute={confirmDeleteBgRoute}
            />
          )}
        </Feedback>
      )}
    </>
  );
}

export default React.memo(BrokerGroupRoutes);
