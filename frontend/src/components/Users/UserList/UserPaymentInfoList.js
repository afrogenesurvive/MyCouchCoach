import React from 'react';

import UserPaymentInfoItem from './UserItem/UserPaymentInfoItem';
import './UserList.css';

const paymentInfoList = props => {

  const paymentInfo = props.userPaymentInfo.map(paymentInfoItem => {
    const paymentInfoItemDate = new Date (paymentInfoItem.date.substr(0,10)*1000).toISOString().slice(0,10);
    // console.log(paymentInfoItemDate);
    return (
      <UserPaymentInfoItem
        key={paymentInfoItem.description}
        paymentInfoItem={paymentInfoItem}
        date={paymentInfoItemDate}
        type={paymentInfoItem.type}
        description={paymentInfoItem.description}
        body={paymentInfoItem.body}
        valid={paymentInfoItem.valid}
        primary={paymentInfoItem.primary}
        authId={props.authId}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="user__list1_master">{paymentInfo}</ul>;
};

export default paymentInfoList;
