import React from 'react';

import UserCartItemItem from './UserItem/UserCartItemItem';
import './UserList.css';

const userCartItemList = props => {
  let key = null;
  const {...filter} = props.filter;
  let userCartItems2 = props.userCartItems;
  let propsUserCartItems = [];

  if (filter.field === 'cartLessons' && filter.key === 'dateAdded' && filter.value === 'Ascending') {
    propsUserCartItems = userCartItems2.sort((a, b) => (a.dateAdded > b.dateAdded) ? 1 : -1);
    // console.log('...no toTeachLesson filter...'+filter.key+'...'+filter.value);
    // console.log('userToTeachLessons2',userToTeachLessons2);
    // console.log('propsUserToTeachLessons',propsUserToTeachLessons);
    // console.log('props.userToTeachLessons',props.userToTeachLessons);
  }
  if (filter.field === 'cartLessons' && filter.key === 'dateAdded' && filter.value === 'Descending') {
    propsUserCartItems = userCartItems2.sort((a, b) => (a.dateAdded < b.dateAdded) ? 1 : -1);
    // console.log('...no toTeachLesson filter...'+filter.key+'...'+filter.value);
    // console.log('userToTeachLessons2',userToTeachLessons2);
    // console.log('propsUserToTeachLessons',propsUserToTeachLessons);
    // console.log('props.userToTeachLessons',props.userToTeachLessons);
  }
  if (filter.field === 'cartLessons' && filter.key === 'lessonPrice' && filter.value === 'Ascending') {
    propsUserCartItems = userCartItems2.sort((a, b) => (a.lesson.price > b.lesson.price) ? 1 : -1);
    // console.log('...no toTeachLesson filter...'+filter.key+'...'+filter.value);
    // console.log('userToTeachLessons2',userToTeachLessons2);
    // console.log('propsUserToTeachLessons',propsUserToTeachLessons);
    // console.log('props.userToTeachLessons',props.userToTeachLessons);
  }
  if (filter.field === 'cartLessons' && filter.key === 'lessonPrice' && filter.value === 'Descending') {
    propsUserCartItems = userCartItems2.sort((a, b) => (a.lesson.price < b.lesson.price) ? 1 : -1);
    // console.log('...no toTeachLesson filter...'+filter.key+'...'+filter.value);
    // console.log('userToTeachLessons2',userToTeachLessons2);
    // console.log('propsUserToTeachLessons',propsUserToTeachLessons);
    // console.log('props.userToTeachLessons',props.userToTeachLessons);
  }
  if (filter.field === 'cartLessons' && filter.key === 'lessonTitle' && filter.value === 'Ascending') {
    propsUserCartItems = userCartItems2.sort((a, b) => (a.lesson.price > b.lesson.price) ? 1 : -1);
    // console.log('...no toTeachLesson filter...'+filter.key+'...'+filter.value);
    // console.log('userToTeachLessons2',userToTeachLessons2);
    // console.log('propsUserToTeachLessons',propsUserToTeachLessons);
    // console.log('props.userToTeachLessons',props.userToTeachLessons);
  }
  if (filter.field === 'cartLessons' && filter.key === 'lessonTitle' && filter.value === 'Descending') {
    propsUserCartItems = userCartItems2.sort((a, b) => (a.lesson.title < b.lesson.title) ? 1 : -1);
    // console.log('...no toTeachLesson filter...'+filter.key+'...'+filter.value);
    // console.log('userToTeachLessons2',userToTeachLessons2);
    // console.log('propsUserToTeachLessons',propsUserToTeachLessons);
    // console.log('props.userToTeachLessons',props.userToTeachLessons);
  }
  if (filter.field === 'cartLessons' && filter.key === 'sessionDate' && filter.value === 'Ascending') {
    propsUserCartItems = userCartItems2.sort((a, b) => (a.sessionDate > b.sessionDate) ? 1 : -1);
    // console.log('...no toTeachLesson filter...'+filter.key+'...'+filter.value);
    // console.log('userToTeachLessons2',userToTeachLessons2);
    // console.log('propsUserToTeachLessons',propsUserToTeachLessons);
    // console.log('props.userToTeachLessons',props.userToTeachLessons);
  }
  if (filter.field === 'cartLessons' && filter.key === 'sessionDate' && filter.value === 'Descending') {
    propsUserCartItems = userCartItems2.sort((a, b) => (a.sessionDate < b.sessionDate) ? 1 : -1);
    // console.log('...no toTeachLesson filter...'+filter.key+'...'+filter.value);
    // console.log('userToTeachLessons2',userToTeachLessons2);
    // console.log('propsUserToTeachLessons',propsUserToTeachLessons);
    // console.log('props.userToTeachLessons',props.userToTeachLessons);
  }
  if (filter.field === 'cartLessons' && filter.key === 'sessionTitle' && filter.value === 'Ascending') {
    propsUserCartItems = userCartItems2.sort((a, b) => (a.sessionTitle > b.sessionTitle) ? 1 : -1);
    // console.log('...no toTeachLesson filter...'+filter.key+'...'+filter.value);
    // console.log('userToTeachLessons2',userToTeachLessons2);
    // console.log('propsUserToTeachLessons',propsUserToTeachLessons);
    // console.log('props.userToTeachLessons',props.userToTeachLessons);
  }
  if (filter.field === 'cartLessons' && filter.key === 'sessionTitle' && filter.value === 'Descending') {
    propsUserCartItems = userCartItems2.sort((a, b) => (a.sessionTitle < b.sessionTitle) ? 1 : -1);
    // console.log('...no toTeachLesson filter...'+filter.key+'...'+filter.value);
    // console.log('userToTeachLessons2',userToTeachLessons2);
    // console.log('propsUserToTeachLessons',propsUserToTeachLessons);
    // console.log('props.userToTeachLessons',props.userToTeachLessons);
  }

  if (filter.field !== 'cartLessons') {
    propsUserCartItems = userCartItems2;
    // console.log('...no toTeachLesson filter...'+filter.key+'...'+filter.value);
    // console.log('userToTeachLessons2',userToTeachLessons2);
    // console.log('propsUserCartItems',propsUserCartItems);
    // console.log('props.userToTeachLessons',props.userToTeachLessons);
  }

  const cart = propsUserCartItems.map(cartItem => {
    // console.log(propsUserCartItems.length);
    // console.log(cartItem);
    const cartItemDateAdded = new Date (cartItem.dateAdded.substr(0,10)*1000).toISOString().slice(0,10);
    const cartItemSessionDate = new Date (cartItem.sessionDate.substr(0,10)*1000).toISOString().slice(0,10);
    key = cartItem.lesson._id+cartItem.sessionTitle;

    return (
      <UserCartItemItem
        key={key}
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

export default userCartItemList;
