import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import React from 'react';

import { booleanToString } from '../../../../helpers/functions';
import { IBinderAuthorityResponse } from '../../../../interfaces/models/binder-authority';
import MGrid from '../../../shared/MGrid';

interface IProps {
  title: string;
  binderAuthorities: IBinderAuthorityResponse[] | null;
  editBinderAuthority: (info: IBinderAuthorityResponse) => void;
  deleteBinderAuthority: (info: IBinderAuthorityResponse) => void;
}

function BinderAuthorityGrid(props: IProps) {
  function editBinderAuthority(binderAuthority: IBinderAuthorityResponse) {
    props.editBinderAuthority(binderAuthority);
  }

  function deleteBinderAuthority(binderAuthority: IBinderAuthorityResponse) {
    props.deleteBinderAuthority(binderAuthority);
  }

  return (
    props.binderAuthorities && (
      <MGrid
        title={props.title}
        actions={[
          {
            icon: () => <Edit color="action" />,
            tooltip: "Edit Binder Authority",
            onClick: (event, rowData) => editBinderAuthority(rowData as IBinderAuthorityResponse)
          },
          {
            icon: () => <Delete color="action" />,
            tooltip: "Delete Binder Authority",
            onClick: (event, rowData) => deleteBinderAuthority(rowData as IBinderAuthorityResponse)
          }
        ]}
        columns={[
          { title: "User", field: "fullName" },
          {
            title: "Authorised to Bind",
            field: "authorisedToBind",
            render: rowData => booleanToString(rowData, "authorisedToBind")
          },
          {
            title: "Authorised to Issue",
            field: "authorisedToIssue",
            render: rowData => booleanToString(rowData, "authorisedToBind")
          }
        ]}
        rows={props.binderAuthorities}
      />
    )
  );
}

export default React.memo(BinderAuthorityGrid);
