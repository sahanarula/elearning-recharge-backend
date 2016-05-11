/**
 * DebitController
 *
 * @description :: Server-side logic for managing debits
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    list: function (req, res) {
        Debit.find().exec(function(err, debits){
           if(err){
               return res.json(404, {error: err});
           }
           return res.json({debits: debits});
       });
      },
    detail: function (req, res) {
        var debitId = req.param('debitId');
        Debit.find({debitId: debitId}).exec(function(err, debits){
           if(!err && debits.length){
               return res.json({debit: debits[0]});
           }
           return res.json(404, {'error': 'Debit not found'});
       });
      },
    create: function (req, res) {
        var nodemailer = require('nodemailer');

        var smtpConfig = {
            host: 'smtp.gmail.com',
            port: 25,
            auth: {
                user: 'sahiln123@gmail.com',
                pass: 'helloworld123'
            }
        };

        // create reusable transporter object using the default SMTP transport
        var transporter = nodemailer.createTransport(smtpConfig);

        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: '"Sahil Narula 👥" <sahiln123@gmail.com>', // sender address
            to: 'sahiln123@gmail.com', // list of receivers
            subject: '₹10 received', // Subject line
            text: '', // plaintext body
            html: '<b>₹10 debited for the following resource:</b><br><a href="https://drive.google.com/file/d/0B1PMgetOSX-XMVJpay11ZmduRDg/view?usp=sharing">Elearning Resource</a>' // html body
        };

        // This is going to be the webhook POST request from Instamojo.
        var amount = parseFloat(req.body.amount);
        var rfid = req.body.rfid;
        var pin = req.body.pin;

        if(amount != 10.0){
            return res.json(400, {error: "Invalid amount passed."});
        }
        console.log(typeof rfid, rfid);
        User.find({pin: pin, rfid: rfid}).exec(function(err, users){
            console.log(users);
            if(!err && users.length){
                var credits = parseFloat(users[0].credits);
                 if(credits >= amount){
                     User.update({rfid: rfid, pin: pin}, {credits: credits - amount}).exec(function afterwards(err, updated){
                        if(err){
                           return res.json({error: err})
                        }

                        else{
                            Debit.create({rfid: rfid, amount: amount}).exec(
                                function createCB(err, created){
                                    if(err){
                                        var creation_err = err;
                                        User.update({rfid: rfid}, {credits: credits}).exec(function afterwards(err, updated){
                                            if (err) {
                                                return res.json({error: error});
                                            }
                                            else{
                                                return res.json({error: creation_err});
                                            }
                                        });

                                    }
                                    else{
                                        User.publishUpdate(123, updated[0])
                                        User.message(123, {status: 200});
                                        transporter.sendMail(mailOptions, function(error, info){
                                            if(error){
                                                return console.log(error);
                                            }
                                            console.log('Message sent: ' + info.response);
                                        });
                                        return res.json(201, {debit: {rfid: rfid, amount: amount}});
                                    }
                                }
                            );
                       }


                     })
                 }
                 else{
                     User.message(123, {status: 100})
                     return res.json({'error': 'Insufficient credits.'});
                 }

            }
            else{
                res.json({error: "Invalid request"})
            }
        });

    }
};
