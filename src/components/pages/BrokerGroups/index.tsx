import React, { useState } from 'react';
import { useObservable } from 'react-use-observable';

import { IBrokerGroupsResponse } from '../../../interfaces/models/broker-groups';
import brokerGroupsService from '../../../services/broker-groups/broker-groups';
import Feedback from '../../shared/Feedback';
import MGridActions from '../../shared/MGridActions';
import BrokerGroupsForm from './BrokerGroupsForm';
import BrokerGroupsGrid from './BrokerGroupsGrid';

function BrokerGroups() {
  const [brokerGroupsState] = useObservable(() => {
    getBrokerGroups(false);
    return brokerGroupsService.listenState();
  }, []);

  const [brokerGroup, setBrokerGroup] = useState<IBrokerGroupsResponse>();

  function setBrokerGroupFn(data?: IBrokerGroupsResponse) {
    setBrokerGroup(({ ...data } || {}) as IBrokerGroupsResponse);
  }

  function clearBrokerGroupFn() {
    setBrokerGroup(undefined);
  }

  function getBrokerGroups(force: boolean = true) {
    brokerGroupsService.getBrokerGroups(force);
  }

  return (
    <>
      {brokerGroupsState && (
        <Feedback loading={brokerGroupsState.loading} error={brokerGroupsState.error}>
          <MGridActions
            openDrawer={!!brokerGroup}
            onCloseDrawer={clearBrokerGroupFn}
            add={setBrokerGroupFn}
            refresh={getBrokerGroups}
            formListener={brokerGroupsService.listenBrokerGroups}
            form={<BrokerGroupsForm info={brokerGroup} />}
          />
          {brokerGroupsState.payload && (
            <BrokerGroupsGrid
              brokerGroups={brokerGroupsState.payload.brokerGroups}
              editBrokerGroup={setBrokerGroupFn}
            />
          )}
        </Feedback>
      )}
    </>
  );
}

export default React.memo(BrokerGroups);
