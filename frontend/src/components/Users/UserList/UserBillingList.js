import React from 'react';

import UserBillingItem from './UserItem/UserBillingItem';
import './UserList.css';

const userBillingList = props => {
  const userBilling = props.userBilling.map(billing => {

    return (
      <UserBillingItem
        key={billing.path}
        authId={props.authId}
        date={billing.date}
        type={billing.type}
        description={billing.description}
        amount={billing.amount}
        paid={billing.paid}
        payment={billing.payment}
        billing={billing}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="user__list1_detail">{userBilling}</ul>;
};

export default userBillingList;
