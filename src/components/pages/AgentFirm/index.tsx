import React, { useState } from 'react';
import { useObservable } from 'react-use-observable';

import { IFirmResponse } from '../../../interfaces/models/agent-firms';
import firmsService from '../../../services/agent-firm/firms';
import Feedback from '../../shared/Feedback';
import MGridActions from '../../shared/MGridActions';
import AgentFirmForm from './AgentFirmForm';
import AgentFirmGrid from './AgentFirmGrid';

function AgentFirm() {
  const [firmsState] = useObservable(() => {
    getFirms(false);
    return firmsService.listenState();
  }, []);

  const [firm, setFirm] = useState<IFirmResponse>();

  function setFirmFn(data?: IFirmResponse) {
    setFirm(({ ...data } || {}) as IFirmResponse);
  }

  function clearFirmFn() {
    setFirm(undefined);
  }

  function getFirms(force: boolean = true) {
    firmsService.getFirms(force);
  }

  return (
    <>
      {firmsState && (
        <Feedback loading={firmsState.loading} error={firmsState.error}>
          <MGridActions
            openDrawer={!!firm}
            onCloseDrawer={clearFirmFn}
            add={setFirmFn}
            refresh={getFirms}
            formListener={firmsService.listenFirms}
            form={<AgentFirmForm info={firm} />}
          />
          {firmsState.payload && (
            <AgentFirmGrid firms={firmsState.payload.firms} editFirm={setFirmFn} />
          )}
        </Feedback>
      )}
    </>
  );
}

export default React.memo(AgentFirm);
