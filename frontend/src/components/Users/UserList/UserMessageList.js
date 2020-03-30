import React from 'react';

import UserMessageItem from './UserItem/UserMessageItem';
import './UserList.css';

const userMessageList = props => {

  // function compare( a, b ) {
  //   if ( a.sender.username < b.sender.username ){
  //     return -1;
  //   }
  //   if ( a.sender.username > b.sender.username ){
  //     return 1;
  //   }
  //   return 0;
  // }
  // const test = props.userMessages.sort( compare );
  let test1 = [];
  const test2 = props.userMessages.map(e=> e = e.sender.ref);
  const test3 = props.userMessages.map(e=> e = e.receiver.ref);
  const test4 = [...test2,...test3];
  const test4_1 = [...new Set(test4)];
  // const test4_2 = test4_1.filter(y=> y !== props.authId);

  // console.log("total messages..",props.userMessages.length,"list of senders/receivers:"+test4_1);
  test4_1.forEach(function (element, index){
    let test5 = props.userMessages.filter(x=> x.sender.ref === element || x.receiver.ref === element);
    // console.log(`
    //   sender/receiver name:${element},
    //   index: ${index},
    //   messages to/from sender/receiver: ${JSON.stringify(test5)},
    //   no of msgs from sender/receiver: ${test5.length}
    //   `);
    test1.push(
      {username: element, messages: test5}
    )
  })
  // const test5 = props.userMessages.filter(x=> x.sender.username === test4[6] || x.receiver.username === test4[6]);
  // console.log(`
  //   test: ${test},
  //   test1: ${test1},
  //   test2: ${test2},
  //   test3: ${test3},
  //   test4: ${test4},
  //   `);

  // console.log("final nested array...",JSON.stringify(test1));
  const userMessages = props.userMessages.map(message => {

    return (
      <UserMessageItem
        key={message.path}
        authId={props.authId}
        _id={message._id}
        date={message.date}
        time={message.time}
        subject={message.subject}
        messageMessage={message.message}
        sender={message.sender}
        receiver={message.receiver}
        message={message}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="user__list1_detail">{userMessages}</ul>;
};

export default userMessageList;
