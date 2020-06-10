import React from 'react';

import UserAttendedLessonItem from './UserItem/UserAttendedLessonItem';
import './UserList.css';

const userAttendedLessonList = props => {

  const {...filter} = props.filter;
  let userAttendedLessons2 = props.userAttendedLessons;
  let propsUserAttendedLessons = [];

  if (filter.field === 'attendedLessons' && filter.key === 'title' && filter.key === 'Ascending') {
    propsUserAttendedLessons = userAttendedLessons2.sort((a, b) => (a.ref.title > b.ref.title) ? 1 : -1);
    // console.log('...filtering attended lessons by...'+filter.key+'...'+filter.value);
    // console.log('userAttendedLessons2',userAttendedLessons2);
    // console.log('propsUserAttendedLessons',propsUserAttendedLessons);
    // console.log('props.userAttendedLessons',props.userAttendedLessons);
  }
  if (filter.field === 'attendedLessons' && filter.key === 'title' && filter.key === 'Descending') {
    propsUserAttendedLessons = userAttendedLessons2.sort((a, b) => (a.ref.title < b.ref.title) ? 1 : -1);
    // console.log('...filtering attended lessons by...'+filter.key+'...'+filter.value);
    // console.log('userAttendedLessons2',userAttendedLessons2);
    // console.log('propsUserAttendedLessons',propsUserAttendedLessons);
    // console.log('props.userAttendedLessons',props.userAttendedLessons);
  }

  if (filter.field === 'attendedLessons' && filter.key === 'date' && filter.key === 'Ascending') {
    propsUserAttendedLessons = userAttendedLessons2.sort((a, b) => (a.date > b.date) ? 1 : -1);
    // console.log('...filtering attended lessons by...'+filter.key+'...'+filter.value);
    // console.log('userAttendedLessons2',userAttendedLessons2);
    // console.log('propsUserAttendedLessons',propsUserAttendedLessons);
    // console.log('props.userAttendedLessons',props.userAttendedLessons);
  }
  if (filter.field === 'attendedLessons' && filter.key === 'date' && filter.key === 'Descending') {
    propsUserAttendedLessons = userAttendedLessons2.sort((a, b) => (a.date < b.date) ? 1 : -1);
    // console.log('...filtering attended lessons by...'+filter.key+'...'+filter.value);
    // console.log('userAttendedLessons2',userAttendedLessons2);
    // console.log('propsUserAttendedLessons',propsUserAttendedLessons);
    // console.log('props.userAttendedLessons',props.userAttendedLessons);
  }

  if (filter.field === 'attendedLessons' && filter.key === 'public') {
    propsUserAttendedLessons = userAttendedLessons2.filter(x => x.ref.public === filter.value);
    // console.log('...filtering attended lessons by...'+filter.key+'...'+filter.value);
    // console.log('userAttendedLessons2',userAttendedLessons2);
    // console.log('propsUserAttendedLessons',propsUserAttendedLessons);
    // console.log('props.userAttendedLessons',props.userAttendedLessons);
  }
  if (filter.field === 'attendedLessons' && filter.key === 'type') {
    propsUserAttendedLessons = userAttendedLessons2.filter(x => x.ref.type === filter.value);
    // console.log('...filtering attended lessons by...'+filter.key+'...'+filter.value);
    // console.log('userAttendedLessons2',userAttendedLessons2);
    // console.log('propsUserAttendedLessons',propsUserAttendedLessons);
    // console.log('props.userAttendedLessons',props.userAttendedLessons);
  }
  if (filter.field === 'attendedLessons' && filter.key === 'subType') {
    propsUserAttendedLessons = userAttendedLessons2.filter(x => x.ref.subType === filter.value);
    // console.log('...filtering attended lessons by...'+filter.key+'...'+filter.value);
    // console.log('userAttendedLessons2',userAttendedLessons2);
    // console.log('propsUserAttendedLessons',propsUserAttendedLessons);
    // console.log('props.userAttendedLessons',props.userAttendedLessons);
  }

  if (filter.field !== 'attendedLessons') {
    propsUserAttendedLessons = userAttendedLessons2;
    // console.log('...no attendedLesson filter...'+filter.key+'...'+filter.value);
    // console.log('userAttendedLessons2',userAttendedLessons2);
    // console.log('propsUserAttendedLessons',propsUserAttendedLessons);
    // console.log('props.userAttendedLessons',props.userAttendedLessons);
  }

  const attendedLessons = propsUserAttendedLessons.map(attendedLesson => {
    // console.log(attendedLesson.ref._id);
    // console.log(props.reviewedLessonIds);
    // console.log(props.reviewedLessonIds.includes(attendedLesson.ref._id.toString()));
    const hasReviewed = props.reviewedLessonIds.includes(attendedLesson.ref._id.toString());
    const attendedLessonDate = new Date (attendedLesson.date.substr(0,10)*1000).toLocaleDateString().slice(0,10);;
    // console.log(`
    //     filter: ${JSON.stringify(filter)},
    //     count: ${propsUserAttendedLessons.indexOf(attendedLesson)+1},
    //     length: ${propsUserAttendedLessons.length}
    //     date: ${attendedLesson.date},
    //     title: ${attendedLesson.ref.title},
    //     public: ${attendedLesson.ref.public},
    //     type: ${attendedLesson.ref.type},
    //     subType: ${attendedLesson.ref.subType},
    //   `);

    return (
      <UserAttendedLessonItem
        key={attendedLesson.ref._id}
        attendedLesson={attendedLesson}
        date={attendedLessonDate}
        lesson={attendedLesson.ref}
        authId={props.authId}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
        hasReviewed={hasReviewed}
        viewLessonDetails={props.viewLessonDetails}
        startCreateReview={props.startCreateReview}
      />
    );
  });

  return <ul className="user__list1_master">{attendedLessons}</ul>;
};

export default userAttendedLessonList;
