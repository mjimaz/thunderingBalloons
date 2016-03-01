import EventListEntry from './EventListEntry'; 
import React from 'react';
 
var EventList = ({events}) => (

  <div className="col-md-12">
  {events.map((ev, index) => 
    <EventListEntry ev={ev} key={ev.id}/>
    )}
  </div>
);

export default EventList;