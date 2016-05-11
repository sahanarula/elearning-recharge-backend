/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    email: {
        type: 'string',
        required: true
    },
    pin: {
        type: 'integer',
        required: true,
    },
    rfid: {
        type: 'string',
        required: true,
        unique: true
    },
    firstName: {
        type: 'string'
    },
    lastName: {
        type: 'string'
    },
    credits: {
        type: 'string'
    },
    recharges: {
      collection: 'recharge',
      via: 'user'
    },
    debits: {
      collection: 'debit',
      via: 'user'
    }
  }
};

