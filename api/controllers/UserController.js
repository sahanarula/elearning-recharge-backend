/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    create: function (req, res) {
        var email = req.body.email;
        var pin = req.body.pin;
        var rfid = req.body.rfid;
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var credits = 0.0;

        User.create({email: email, firstName: firstName, lastName, credits: credits, pin: pin, rfid: rfid}).exec(
            function createCB(err, created){
                if(err){
                    return res.json({error: err});
                }
                else{
                    return res.json(201, {'user': {email: email, firstName: firstName, lastName, credits: credits, pin: pin, rfid: rfid}});
                }
        });
    },
    list: function (req, res) {
       User.find().exec(function(err, users){
           if(err){
               return res.json(404, {error: error});
           }
           if (req.isSocket) {
               User.subscribe(req, 123);
           }
           return res.json({users: users});
       });
    },
    details: function (req, res) {
       var email = req.param('email');
       User.find({email: email}).exec(function(err, user){
           if(!err && user.length){
               return res.json({user: user[0]});
           }
           return res.json(404, {'error': 'User not found'});
       });
    }
};
