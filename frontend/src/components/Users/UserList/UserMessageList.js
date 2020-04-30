import React from 'react';

import UserMessageItem from './UserItem/UserMessageItem';
import './UserList.css';

const userMessageList = props => {
  const userMessages = props.userMessages.map(message => {
      // console.log('msg',props.authId,message.sender._id,message.receiver._id);
    return (
      <UserMessageItem
        key={message.path}
        authId={props.authId}
        _id={message._id}
        date={message.date}
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
      />
    );
  });

  return <ul className="user__list1_detail">{userMessages}</ul>;
};

export default userMessageList;
