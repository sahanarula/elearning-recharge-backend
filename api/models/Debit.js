/**
 * Debit.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    debitId: {
        type: 'integer',
        autoIncrement: true
    },
    user: {
        model: 'user'
    },
    amount: {
        type: 'float',
        required: true
    },
    rfid: {
      type: 'string',
      required: true
    },
  }
};

