/**
 * Transactions.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    user: {
        model: 'user'
    },
    paymentId: {
        type: 'string',
        required: true,
        unique: true
    },
    paymentRequestId: {
        type: 'string',
        required: true,
    },
    longurl: {
        type: 'string',
        required: true,
    },
    status: {
        type: 'string',
        required: true
    },
    amount: {
        type: 'string',
        required: true
    }
  }
};

