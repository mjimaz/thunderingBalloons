import AttendeeListEntry from './AttendeeListEntry'; 
import React from 'react';

var EventListEntry = ({ev}) => (
  <div className="col-md-3">
    <div className="thumbnail">
      <img src={ev.image} />
      <img src={ev.rating_img} />
      <div className="caption">
        <h4>Event Name: {ev.event_name}</h4>
        {ev.attendees.map((attendee, index) => 
          <AttendeeListEntry attendee={attendee} key={index+'-'+attendee.id} />
        )}
      </div>
    </div>
  </div>
);

export default EventListEntry;