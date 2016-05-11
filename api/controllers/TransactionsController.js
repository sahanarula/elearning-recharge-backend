/**
 * TransactionsController
 *
 * @description :: Server-side logic for managing transactions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    list: function (req, res) {
        Transactions.find().exec(function(err, transactions){
           if(err){
               return res.json(404, {error: error});
           }
           return res.json(404, {transactions: transactions});
       });
      },
    detail: function (req, res) {
        var paymentId = req.param('paymentId');
        Transactions.find({paymentId: paymentId}).exec(function(err, transaction){
           if(!err && transaction.length){
               return res.json({transaction: transaction});
           }
           return res.json(404, {'error': 'Transaction not found'});
       });
      },
    create: function (req, res) {
        var paymentId = req.body.payment_id;
        var paymentRequestId = req.body.payment_request_id;
        var purpose = req.body.purpose;
        var longurl = req.body.longurl;
        var email = req.body.buyer;
        var credits = req.body.amount;

        User.find({email: email}).exec(function(err, user){
           if(!err && user.length){
                var old_credits = user[0].credits; 
                User.update({email: email}, {credits: old_credits - credits}).exec(function afterwards(err, updated){
                  if (err) {
                    return;
                  }
                  Transactions.create({email: email, paymentId: paymentId, paymentRequestId: paymentRequestId, purpose: purpose, longurl: longurl, credits, credits}).exec(
                    function createCB(err, created){
                        if(err){
                            return res.json({error: error});
                        }
                        else{
                            return res.json(201, {'user': {email: email, paymentId: paymentId, paymentRequestId: paymentRequestId, purpose: purpose, longurl: longurl, credits, credits}});
                        }
                  });
                  
                });
           }
        });
    },
};

