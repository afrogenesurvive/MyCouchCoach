import React from 'react';

import UserOrderItem from './UserItem/UserOrderItem';
import './UserList.css';

const userOrderList = props => {

  let count = 0;

  const {...filter} = props.filter;
  let userOrders2 = props.userOrders;
  let propsUserOrders = [];

  if (filter.field === 'orders' && filter.key === 'date' && filter.value === 'Ascending') {
    propsUserOrders = userOrders2.sort((a, b) => (a.date > b.date) ? 1 : -1);
  }
  if (filter.field === 'orders' && filter.key === 'date' && filter.value === 'Descending') {
    propsUserOrders = userOrders2.sort((a, b) => (a.date < b.date) ? 1 : -1);
  }
  if (filter.field === 'orders' && filter.key === 'total' && filter.value === 'Ascending') {
    propsUserOrders = userOrders2.sort((a, b) => (a.totals.a > b.totals.a) ? 1 : -1);
  }
  if (filter.field === 'orders' && filter.key === 'total' && filter.value === 'Descending') {
    propsUserOrders = userOrders2.sort((a, b) => (a.totals.a < b.totals.a) ? 1 : -1);
  }
  if (filter.field !== 'orders') {
    propsUserOrders = userOrders2;
  }

  const userOrders = propsUserOrders.map(order => {

    count = props.userOrders.indexOf(order)+1;
    // console.log(`
    //     props.userOrders.length: ${props.userOrders.length},
    //     count: ${count},
    //   `);
    console.log('order',order);

    const orderDate = new Date (order.date.substr(0,10)*1000).toLocaleDateString().slice(0,10);
    // console.log('order.lessons',order.lessons);
    return (
      <UserOrderItem
        key={count}
        order={order}
        _id={order._id}
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
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="user__list1_master">{userOrders}</ul>;
};

export default userOrderList;
