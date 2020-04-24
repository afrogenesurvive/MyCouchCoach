import React from 'react';

import UserCartItemItem from './UserItem/UserCartItemItem';
import './UserList.css';

const UserCartItemList = props => {

  const cart = props.userCartItems.map(cartItem => {
    
    const cartItemDateAdded = new Date (cartItem.dateAdded.substr(0,10)*1000).toLocaleDateString().slice(0,10);;
    const cartItemSessionDate = new Date (cartItem.sessionDate.substr(0,10)*1000).toLocaleDateString().slice(0,10);;
    
    return (
      <UserCartItemItem
        key={cartItem.lesson}
        cartItem={cartItem}
        authId={props.authId}
        lesson={cartItem.lesson}
        dateAdded={cartItemDateAdded}
        sessionDate={cartItemSessionDate}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="user__list1_master">{cart}</ul>;
};

export default UserCartItemList;
