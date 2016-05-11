/**
 * RechargeController
 *
 * @description :: Server-side logic for managing recharges
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    list: function (req, res) {
        Recharge.find().exec(function(err, recharges){
           if(err){
               return res.json(404, {error: error});
           }
           return res.json(404, {recharges: recharges});
       });
      },
    detail: function (req, res) {
        var rechargeId = req.param('rechargeId');
        Recharge.find({rechargeId: rechargeId}).exec(function(err, recharges){
           if(!err && recharges.length){
               return res.json({recharge: recharges[0]});
           }
           return res.json(404, {'error': 'Recharges not found'});
       });
      },
    create: function (req, res) {
        // This is going to be the webhook POST request from Instamojo.
        var rechargeId = req.body.payment_id;
        var paymentRequestId = req.body.payment_request_id;
        var status = req.body.status;
        var purpose = req.body.purpose;
        var longurl = req.body.longurl;
        var email = req.body.buyer;
        var amount = parseFloat(req.body.amount);

        if(status != "Credit"){
            return res.json(400, {error: "Failed transaction."})
        }

        User.find({email: email}).exec(function(err, users){
           if(!err && users.length){
                var old_credits = parseFloat(users[0].credits);
                User.update({email: email}, {credits: old_credits + amount}).exec(function afterwards(err, updated){
                  if (err) {
                    res.json({error: err});
                  }
                  Recharge.create({email: email, rechargeId: rechargeId, paymentRequestId: paymentRequestId, purpose: purpose, longurl: longurl, amount: amount, status: status}).exec(
                    function createCB(err, created){
                        if(err){
                            var creation_err = err;
                            User.update({email: email}, {credits: old_credits}).exec(function afterwards(err, updated){
                                if(err){
                                    return res.json({error: err});
                                }
                                else{
                                    return res.json({error: creation_err});
                                }
                            });
                        }
                        else{
                            User.publishUpdate(123, updated[0])
                            return res.json(201, {recharge: {email: email, rechargeId: rechargeId, paymentRequestId: paymentRequestId, purpose: purpose, longurl: longurl, amount: amount, status: status}});
                        }
                  });

                });
           }
        else{
            res.json({error: "Invalid request"});
        }
        });
    },
};
