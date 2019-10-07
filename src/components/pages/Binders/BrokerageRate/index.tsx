import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useObservable } from 'react-use-observable';

import { IBinderResponse } from '../../../../interfaces/models/binders';
import { IBrokerageRateResponse } from '../../../../interfaces/models/brokerage-rate';
import brokerageRatesService from '../../../../services/binders/brokerage-rates';
import ConfirmDiscardDialog from '../../../shared/ConfirmDiscardDialog';
import Feedback from '../../../shared/Feedback';
import MGridActions from '../../../shared/MGridActions';
import BrokerageRateForm from './BrokerageRateForm';
import BrokerageRateGrid from './BrokerGroupRoutingGrid';

interface IProps extends RouteComponentProps {}

function BrokerageRate(props: IProps) {
  const binder: IBinderResponse = props.location.state.binder;

  const [brokerageRatesState] = useObservable(() => {
    getBrokerageRates();
    return brokerageRatesService.listenState();
  }, []);

  const [brokerageRate, setBrokerageRate] = useState<IBrokerageRateResponse>();
  const [deleteHandler, setDeleteHandler] = useState<
    { showConfirmModal: boolean; brokerageRate: IBrokerageRateResponse } | undefined
  >();

  function setBrokerageRateFn(data?: IBrokerageRateResponse) {
    setBrokerageRate(({ ...data } || {}) as IBrokerageRateResponse);
  }

  function clearBrokerageRateFn() {
    setBrokerageRate(undefined);
  }

  function confirmDeleteBrokerageRates(data: IBrokerageRateResponse) {
    setDeleteHandler({ showConfirmModal: true, brokerageRate: data });
  }

  function deleteBrokerageRates(confirm: boolean) {
    if (confirm && deleteHandler && deleteHandler.brokerageRate) {
      brokerageRatesService.deleteBrokerageRate(binder.binderId, deleteHandler.brokerageRate);
    }

    setDeleteHandler(undefined);
  }

  function getBrokerageRates() {
    brokerageRatesService.getBrokerageRates(binder.binderId);
  }

  return (
    <>
      {deleteHandler && deleteHandler.showConfirmModal && (
        <ConfirmDiscardDialog
          open={true}
          onClose={deleteBrokerageRates}
          content={
            "Are you sure you want to delete this route. This will prevent the user from submitting requests for the risk(s)"
          }
        />
      )}

      {brokerageRatesState && (
        <Feedback loading={brokerageRatesState.loading} error={brokerageRatesState.error}>
          <MGridActions
            openDrawer={!!brokerageRate}
            onCloseDrawer={clearBrokerageRateFn}
            add={setBrokerageRateFn}
            refresh={getBrokerageRates}
            formListener={brokerageRatesService.listenBrokerageRates}
            form={<BrokerageRateForm binderId={binder.binderId} info={brokerageRate} />}
          />

          <BrokerageRateGrid
            title={binder.binderUiName}
            brokerageRates={brokerageRatesState.payload}
            editRate={setBrokerageRateFn}
            deleteRate={confirmDeleteBrokerageRates}
          />
        </Feedback>
      )}
    </>
  );
}

export default React.memo(BrokerageRate);
