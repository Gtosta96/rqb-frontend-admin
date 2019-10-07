import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useObservable } from 'react-use-observable';

import { IAgentCommissionsResponse } from '../../../../interfaces/models/agent-commissions';
import { IFirmResponse } from '../../../../interfaces/models/agent-firms';
import agentCommissionsService from '../../../../services/agent-firm/commissions';
import ConfirmDiscardDialog from '../../../shared/ConfirmDiscardDialog';
import Feedback from '../../../shared/Feedback';
import MGridActions from '../../../shared/MGridActions';
import AgentCommissionsForm from './AgentCommissionsForm';
import AgentCommissionsGrid from './AgentCommissionsGrid';

interface IProps extends RouteComponentProps {}

function AgentCommissions(props: IProps) {
  const firm: IFirmResponse = props.location.state.firm;

  const [agentCommissionsState] = useObservable(() => {
    getAgentCommissions();
    return agentCommissionsService.listenState();
  }, []);

  const [commission, setCommission] = useState<IAgentCommissionsResponse>();
  const [deleteHandler, setDeleteHandler] = useState<
    { showConfirmModal: boolean; commission: IAgentCommissionsResponse } | undefined
  >();

  function setCommissionFn(data?: IAgentCommissionsResponse) {
    setCommission(({ ...data } || {}) as IAgentCommissionsResponse);
  }

  function clearAgentCommissionFn() {
    setCommission(undefined);
  }

  function confirmDeleteAgentCommission(data: IAgentCommissionsResponse) {
    setDeleteHandler({ showConfirmModal: true, commission: data });
  }

  function deleteAgentCommission(confirm: boolean) {
    if (confirm && deleteHandler && deleteHandler.commission) {
      agentCommissionsService.deleteAgentCommission(firm.firmId, deleteHandler.commission);
    }

    setDeleteHandler(undefined);
  }

  function getAgentCommissions() {
    agentCommissionsService.getAgentCommissions(firm.firmId);
  }

  return (
    <>
      {deleteHandler && deleteHandler.showConfirmModal && (
        <ConfirmDiscardDialog
          open={true}
          onClose={deleteAgentCommission}
          content={
            "Are you sure you want to delete this route. This will prevent the user from submitting requests for the risk(s)"
          }
        />
      )}

      {agentCommissionsState && (
        <Feedback loading={agentCommissionsState.loading} error={agentCommissionsState.error}>
          <MGridActions
            openDrawer={!!commission}
            onCloseDrawer={clearAgentCommissionFn}
            add={setCommissionFn}
            refresh={getAgentCommissions}
            formListener={agentCommissionsService.listenAgentCommissions}
            form={<AgentCommissionsForm firm={firm} info={commission} />}
          />

          <AgentCommissionsGrid
            title={firm.firmName}
            commissions={agentCommissionsState.payload}
            editCommission={setCommissionFn}
            deleteCommission={confirmDeleteAgentCommission}
          />
        </Feedback>
      )}
    </>
  );
}

export default React.memo(AgentCommissions);
