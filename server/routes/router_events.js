//////////////////
// event router //
//////////////////

// utility functions
var utils = require('../utils/utils');

// create express router 
var express = require('express');
var eventsRouter = express.Router();

// db helpers
var sequelize = require('../db/config/sequelize_connection');
var User = require('../db/models/user');
var Event = require('../db/models/event');
var Invitee = require('../db/models/invitee');


////////////////////
// route handling //
////////////////////

// main events route
eventsRouter.route('/')
  .get(utils.checkUser, function(req, res) {
    // query to get all events that current user is attending 
    var query = 'SELECT * FROM invitees, events ' + 
                'WHERE (events.id = invitees.eid AND invitees.uid =' + req.session.uid + ')';
    sequelize.query(query).spread(function(eventsList, metadata){
      eventsList.forEach(function(event, index){
        // query to get the name of all invitees for specific event
        query = 'SELECT users.username, invitees.current_status FROM invitees, users ' + 
                'WHERE (invitees.eid = '+ event.eid + ' AND users.id = invitees.uid)';
        sequelize.query(query).spread(function(attendees, metadata){
          eventsList[index].attendees = attendees;
          if (index === eventsList.length - 1) {
            res.send(200, eventsList);
          }
        }).catch(utils.handleError(req, res, 500, "Error while reading event invitees from database."));          
      });
    }).catch(utils.handleError(req, res, 500, "Error while reading events from database."));
  }) 
  .post(utils.checkUser, function(req, res) {
    //add user ID to the begining of the invitee array
    var invitees = req.body.invitees;
    invitees.unshift(req.session.uid);

    // write all event info into events table
    sequelize.sync().then(function(){
      return Event.create({
        event_name: req.body.event_info.event_name,
        org_id: req.session.uid,
        venue_name: req.body.event_info.venue_name,
        street: req.body.event_info.street,
        city: req.body.event_info.city,
        state: req.body.event_info.state,
        event_time: req.body.event_info.event_time,
        latitude: req.body.event_info.latitude,
        longitude: req.body.event_info.longitude,
        phone: req.body.event_info.phone,
        rating: req.body.event_info.rating,
        rating_img: req.body.event_info.rating_img,
        image: req.body.event_info.image,
        yelp_link: req.body.event_info.yelp_link,
        createdAt: Date.now()
      }).then(function(result) {
        // write all invitee info into invitee table
        invitees.forEach(function(invitee, index){
          Invitee.create({
            uid: invitee,
            eid: result.id,
            current_status: invitee === result.org_id ? "accepted" : "pending",
            createdAt: Date.now()
          })
          .then(function() {
            if (index === invitees.length-1) {
              res.send(200, "wrote all invitees to db");
            }
          }).catch(utils.handleError(req, res, 500, "Error writing invitee information to database"));
        });
      }).catch(utils.handleError(req, res, 500, "Error writing event information to database."));
    }).catch(utils.handleError(req, res, 500, "Error writing event to database."));
  });

module.exports = eventsRouter;