import React from 'react';

import UserCartItemItem from './UserItem/UserCartItemItem';
import './UserList.css';

const UserCartItemList = props => {

  const {...filter} = props.filter;
  let userCartItems2 = props.userCartItems;
  let propsUserCartItems = [];

  if (filter.field === 'cartLessons' && filter.key === 'dateAdded' && filter.value === 'Ascending') {
    propsUserCartItems = userCartItems2.sort((a, b) => (a.dateAdded > b.dateAdded) ? 1 : -1);
    console.log('...filtering cart lesson by...'+filter.key+'...'+filter.value);
    console.log('userCartItems2',userCartItems2);
    console.log('propsUserCartItems',propsUserCartItems);
    console.log('props.userCartItems',props.userCartItems);
  }
  if (filter.field === 'cartLessons' && filter.key === 'dateAdded' && filter.value === 'Descending') {
    propsUserCartItems = userCartItems2.sort((a, b) => (a.dateAdded < b.dateAdded) ? 1 : -1);
    console.log('...filtering cart lesson by...'+filter.key+'...'+filter.value);
    console.log('userCartItems2',userCartItems2);
    console.log('propsUserCartItems',propsUserCartItems);
    console.log('props.userCartItems',props.userCartItems);
  }
  if (filter.field !== 'cartLessons') {
    propsUserCartItems = userCartItems2;
    console.log('...no cart Lesson filter...'+filter.key+'...'+filter.value);
    console.log('userCartItems2',userCartItems2);
    console.log('propsUserCartItems',propsUserCartItems);
    console.log('props.userCartItems',props.userCartItems);
  }

  const cart = propsUserCartItems.map(cartItem => {
    // console.log(cartItem);
    const cartItemDateAdded = new Date (cartItem.dateAdded.substr(0,10)*1000).toISOString().slice(0,10);;
    const cartItemSessionDate = new Date (cartItem.sessionDate.substr(0,10)*1000).toISOString().slice(0,10);;

    return (
      <UserCartItemItem
        key={cartItem.lesson._id}
        cartItem={cartItem}
        authId={props.authId}
        lesson={cartItem.lesson}
        dateAdded={cartItemDateAdded}
        sessionDate={cartItemSessionDate}
        sessionTitle={cartItem.sessionTitle}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="user__list1_master">{cart}</ul>;
};

export default UserCartItemList;
