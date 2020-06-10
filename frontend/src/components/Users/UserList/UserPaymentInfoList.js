import React from 'react';

import UserPaymentInfoItem from './UserItem/UserPaymentInfoItem';
import './UserList.css';

const paymentInfoList = props => {
  const {...filter} = props.filter;
  let userPaymentInfo2 = props.userPaymentInfo;
  let propsUserPaymentInfo = [];

  if (filter.field === 'paymentInfo' && filter.key === 'date' && filter.value === 'Ascending') {
    propsUserPaymentInfo = userPaymentInfo2.sort((a, b) => (a.date > b.date) ? 1 : -1);
    // console.log('...no paymentInfo filter...'+filter.key+'...'+filter.value);
    // console.log('userPaymentInfo2',userPaymentInfo2);
    // console.log('propsUserPaymentInfo',propsUserPaymentInfo);
    // console.log('props.userPaymentInfo',props.userPaymentInfo);
  }
  if (filter.field === 'paymentInfo' && filter.key === 'date' && filter.value === 'Descending') {
    propsUserPaymentInfo = userPaymentInfo2.sort((a, b) => (a.date < b.date) ? 1 : -1);
    // console.log('...no paymentInfo filter...'+filter.key+'...'+filter.value);
    // console.log('userPaymentInfo2',userPaymentInfo2);
    // console.log('propsUserPaymentInfo',propsUserPaymentInfo);
    // console.log('props.userPaymentInfo',props.userPaymentInfo);
  }
  if (filter.field === 'paymentInfo' && filter.key === 'valid') {
    propsUserPaymentInfo = userPaymentInfo2.filter(x => x.valid === filter.value)
    // console.log('...no paymentInfo filter...'+filter.key+'...'+filter.value);
    // console.log('userPaymentInfo2',userPaymentInfo2);
    // console.log('propsUserPaymentInfo',propsUserPaymentInfo);
    // console.log('props.userPaymentInfo',props.userPaymentInfo);
  }
  if (filter.field === 'paymentInfo' && filter.key === 'primary') {
    propsUserPaymentInfo = userPaymentInfo2.filter(x => x.primary === filter.value)
    // console.log('...no paymentInfo filter...'+filter.key+'...'+filter.value);
    // console.log('userPaymentInfo2',userPaymentInfo2);
    // console.log('propsUserPaymentInfo',propsUserPaymentInfo);
    // console.log('props.userPaymentInfo',props.userPaymentInfo);
  }
  if (filter.field === 'paymentInfo' && filter.key === 'type' && filter.value === 'Ascending') {
    propsUserPaymentInfo = userPaymentInfo2.sort((a, b) => (a.type > b.type) ? 1 : -1);
    // console.log('...no paymentInfo filter...'+filter.key+'...'+filter.value);
    // console.log('userPaymentInfo2',userPaymentInfo2);
    // console.log('propsUserPaymentInfo',propsUserPaymentInfo);
    // console.log('props.userPaymentInfo',props.userPaymentInfo);
  }
  if (filter.field === 'paymentInfo' && filter.key === 'type' && filter.value === 'Descending') {
    propsUserPaymentInfo = userPaymentInfo2.sort((a, b) => (a.type < b.type) ? 1 : -1);
    // console.log('...no paymentInfo filter...'+filter.key+'...'+filter.value);
    // console.log('userPaymentInfo2',userPaymentInfo2);
    // console.log('propsUserPaymentInfo',propsUserPaymentInfo);
    // console.log('props.userPaymentInfo',props.userPaymentInfo);
  }

  if (filter.field !== 'paymentInfo') {
    propsUserPaymentInfo = userPaymentInfo2;
    // console.log('...no paymentInfo filter...'+filter.key+'...'+filter.value);
    // console.log('userPaymentInfo2',userPaymentInfo2);
    // console.log('propsUserPaymentInfo',propsUserPaymentInfo);
    // console.log('props.userPaymentInfo',props.userPaymentInfo);
  }

  const paymentInfo = propsUserPaymentInfo.map(paymentInfoItem => {
    const paymentInfoItemDate = new Date (paymentInfoItem.date.substr(0,10)*1000).toISOString().slice(0,10);
    // console.log(paymentInfoItem);
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
        makeUserPaymentInfoPrimary={props.makeUserPaymentInfoPrimary}
      />
    );
  });

  return <ul className="user__list1_master">{paymentInfo}</ul>;
};

export default paymentInfoList;
