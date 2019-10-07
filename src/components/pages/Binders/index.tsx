import React, { useState } from 'react';
import { useObservable } from 'react-use-observable';

import { IBinderResponse } from '../../../interfaces/models/binders';
import bindersService from '../../../services/binders/binders';
import Feedback from '../../shared/Feedback';
import MGridActions from '../../shared/MGridActions';
import BindersForm from './BindersForm';
import BindersGrid from './BindersGrid';

function Binders() {
  const [bindersState] = useObservable(() => {
    getBinders(false);
    return bindersService.listenState();
  }, []);

  const [binder, setBinder] = useState<IBinderResponse>();

  function setBinderFn(data?: IBinderResponse) {
    setBinder(({ ...data } || {}) as IBinderResponse);
  }

  function clearBinderFn() {
    setBinder(undefined);
  }

  function getBinders(force: boolean = true) {
    bindersService.getBinders(force);
  }

  return (
    <>
      {bindersState && (
        <Feedback loading={bindersState.loading} error={bindersState.error}>
          <MGridActions
            openDrawer={!!binder}
            onCloseDrawer={clearBinderFn}
            add={setBinderFn}
            refresh={getBinders}
            formListener={bindersService.listenBinders}
            form={<BindersForm info={binder} />}
          />
          {bindersState.payload && (
            <BindersGrid binders={bindersState.payload.binders} editBinder={setBinderFn} />
          )}
        </Feedback>
      )}
    </>
  );
}

export default React.memo(Binders);
