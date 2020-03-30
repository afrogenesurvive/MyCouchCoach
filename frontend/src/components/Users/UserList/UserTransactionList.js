import React from 'react';

import UserTransactionItem from './UserItem/UserTransactionItem';
import './UserList.css';

const userTransactionList = props => {
  const userTransactions = props.userTransactions.map(transaction => {
    
    return (
      <UserTransactionItem
        key={transaction.path}
        authId={props.authId}
        _id={transaction._id}
        date={transaction.date}
        time={transaction.time}
        description={transaction.description}
        amount={transaction.amount}
        sender={transaction.sender}
        receiver={transaction.receiver}
        transaction={transaction}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="user__list1_detail">{userTransactions}</ul>;
};

export default userTransactionList;
