import React from 'react';

import UserMessageItem from './UserItem/UserMessageItem';
import './UserList.css';

const userMessageList = props => {

  const {...filter} = props.filter;
  let userMessages2 = props.userMessages;
  let propsUserMessages = [];

  if (filter.field === 'messages' && filter.key === 'date' && filter.value === 'Ascending') {
    propsUserMessages = userMessages2.sort((a, b) => (a.date > b.date) ? 1 : -1);
    // console.log('...filter messages by...'+filter.key+'...'+filter.value);
    // console.log('userMessages2',userMessages2);
    // console.log('propsUserMessages',propsUserMessages);
    // console.log('props.userMessages',props.userMessages);
  }
  if (filter.field === 'messages' && filter.key === 'date' && filter.value === 'Descending') {
    propsUserMessages = userMessages2.sort((a, b) => (a.date < b.date) ? 1 : -1);
    // console.log('...filter messages by...'+filter.key+'...'+filter.value);
    // console.log('userMessages2',userMessages2);
    // console.log('propsUserMessages',propsUserMessages);
    // console.log('props.userMessages',props.userMessages);
  }
  if (filter.field === 'messages' && filter.key === 'sender' && filter.value === 'Ascending') {
    propsUserMessages = userMessages2.sort((a, b) => (a.sender.username > b.sender.username) ? 1 : -1);
    // console.log('...filter messages by...'+filter.key+'...'+filter.value);
    // console.log('userMessages2',userMessages2);
    // console.log('propsUserMessages',propsUserMessages);
    // console.log('props.userMessages',props.userMessages);
  }
  if (filter.field === 'messages' && filter.key === 'sender' && filter.value === 'Descending') {
    propsUserMessages = userMessages2.sort((a, b) => (a.sender.username < b.sender.username) ? 1 : -1);
    // console.log('...filter messages by...'+filter.key+'...'+filter.value);
    // console.log('userMessages2',userMessages2);
    // console.log('propsUserMessages',propsUserMessages);
    // console.log('props.userMessages',props.userMessages);
  }
  if (filter.field === 'messages' && filter.key === 'receiver' && filter.value === 'Ascending') {
    propsUserMessages = userMessages2.sort((a, b) => (a.receiver.username > b.receiver.username) ? 1 : -1);
    // console.log('...filter messages by...'+filter.key+'...'+filter.value);
    // console.log('userMessages2',userMessages2);
    // console.log('propsUserMessages',propsUserMessages);
    // console.log('props.userMessages',props.userMessages);
  }
  if (filter.field === 'messages' && filter.key === 'receiver' && filter.value === 'Descending') {
    propsUserMessages = userMessages2.sort((a, b) => (a.receiver.username < b.receiver.username) ? 1 : -1);
    // console.log('...filter messages by...'+filter.key+'...'+filter.value);
    // console.log('userMessages2',userMessages2);
    // console.log('propsUserMessages',propsUserMessages);
    // console.log('props.userMessages',props.userMessages);
  }
  if (filter.field === 'messages' && filter.key === 'subject' && filter.value === 'Ascending') {
    propsUserMessages = userMessages2.sort((a, b) => (a.subject > b.subject) ? 1 : -1);
    // console.log('...filter messages by...'+filter.key+'...'+filter.value);
    // console.log('userMessages2',userMessages2);
    // console.log('propsUserMessages',propsUserMessages);
    // console.log('props.userMessages',props.userMessages);
  }
  if (filter.field === 'messages' && filter.key === 'subject' && filter.value === 'Descending') {
    propsUserMessages = userMessages2.sort((a, b) => (a.subject < b.subject) ? 1 : -1);
    // console.log('...filter messages by...'+filter.key+'...'+filter.value);
    // console.log('userMessages2',userMessages2);
    // console.log('propsUserMessages',propsUserMessages);
    // console.log('props.userMessages',props.userMessages);
  }
  if (filter.field !== 'messages') {
    propsUserMessages = userMessages2;
    // console.log('...no messages filter...'+filter.key+'...'+filter.value);
    // console.log('userMessages2',userMessages2);
    // console.log('propsUserMessages',propsUserMessages);
    // console.log('props.userMessages',props.userMessages);
  }

  const userMessages = propsUserMessages.map(message => {
    const messageDate = new Date (message.date.substr(0,10)*1000).toISOString().slice(0,10);;
      // console.log('msg',props.authId,message.sender._id,message.receiver._id);
    return (
      <UserMessageItem
        key={message.path}
        authId={props.authId}
        _id={message._id}
        date={messageDate}
        time={message.time}
        type={message.type}
        subject={message.subject}
        messageMessage={message.message}
        sender={message.sender}
        receiver={message.receiver}
        read={message.read}
        message={message}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
        received={props.received}
        onStartReply={props.onStartReply}
      />
    );
  });

  return <ul className="user__list1_detail">{userMessages}</ul>;
};

export default userMessageList;
