import React from 'react';

import UserOrderItem from './UserItem/UserOrderItem';
import './UserList.css';

const userOrderList = props => {

  const userOrders = props.orders.map(order => {
    const orderDate = new Date (order.date.substr(0,10)*1000).toISOString().slice(0,10);
    return (
      <UserOrderItem
        key={order._id}
        order={order}
        date={orderDate}
        time={order.time}
        type={order.type}
        buyer={order.buyer}
        receiver={order.receiver}
        lessons={order.lessons}
        totals={order.totals}
        tax={order.tax}
        description={order.description}
        notes={order.notes}
        payment={order.payment}
        shipping={order.shipping}
        billingAddress={order.billingAddress}
        shippingAddress={order.shippingAddress}
        status={order.status}
        feedback={order.feedback}
        authId={props.authId}
      />
    );
  });

  return <ul className="user__list1_master">{userOrders}</ul>;
};

export default userOrderList;
