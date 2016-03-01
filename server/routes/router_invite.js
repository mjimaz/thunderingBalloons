///////////////////
// invite router //
///////////////////

// utility functions
var utils = require('../utils/utils');

// create express router 
var express = require('express');
var inviteRouter = express.Router(); 

// db helpers
var sequelize = require('../db/config/sequelize_connection');
var Invitee = require('../db/models/invitee');


////////////////////
// route handling //
////////////////////

// main invite route
inviteRouter.route('/')
  .put(utils.checkUser, function(req, res) {
    var uid = req.session.uid;
    var eid = req.body.eid;
    var status = req.body.status;

    var query = "UPDATE invitees SET current_status = '" + status + "' WHERE (uid = " + uid + " and eid = " + eid + ")";
    sequelize.query(query).spread(function(updated, metadata){
      if (updated) {
        res.send(200, "Invite updated")
      }
    }).catch(utils.handleError(req, res, 500, "Error while updating invitee information in database."));
  })
  .get(utils.checkUser, function(req, res) {
    var uid = req.session.uid;
    var eid = req.body.eid;
    Invitee.findAll({
       attributes: ["uid", "current_status"],
       where: {
         uid: { $eq: uid },
         eid:  { $eq: eid }
       },
     }).then(function(allInvitees){
       res.send(200, allInvitees);
     }).catch(utils.handleError(req, res, 500, "Unable to retrieve invitees from database"));
  });


module.exports = inviteRouter;