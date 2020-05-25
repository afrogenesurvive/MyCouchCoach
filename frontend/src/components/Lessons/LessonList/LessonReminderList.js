import React from 'react';

import LessonReminderItem from './LessonItem/LessonReminderItem';
import './UserList.css';

const lessonReminderList = props => {

  const reminders = props.lessonReminders.map(reminder => {
    // const reminderDate = new Date (reminder.date.substr(0,10)*1000).toLocaleDateString().slice(0,10);
    return (
      <LessonReminderItem
        key={reminder._id}
        authId={props.authId}
        _id={reminder._id}
        reminder={reminder}
      />
    );
  });

  return <ul className="user__list1_master">{reminders}</ul>;
};

export default lessonReminderList;
