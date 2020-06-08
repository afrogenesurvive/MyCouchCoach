import React from 'react';

import LessonReviewItem from './LessonItem/LessonReviewItem';
import './UserList.css';

const lessonReviewList = props => {

  const reviews = props.lessonReviews.map(review => {

    console.log('review',review);
    return (
      <LessonReviewItem
        key={review}
        review={review}
        _id={review._id}
        title={review.title}
        type={review.type}
        author={review.author}
        body={review.body}
        rating={review.rating}
        authId={props.authId}
      />
    );
  });

  return <ul className="user__list1_master">{reviews}</ul>;
};

export default lessonReviewList;
