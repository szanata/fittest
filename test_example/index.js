const exec = require( './exec' );
const rollback = require( './rollback' );

/**
 * Anatomy of a test flow
 */
module.exports = {

  /**
   * Create the context, to share values between test and rollback
   */
  createContext() {
    return { };
  },

  /**
   * The test execution
   * @param {object} env All env variables
   * @param {object} ctx The context built from "createContext"
   * @param {object} logger The logger object to print out messages
   * @returns {Promise}
   */
  exec,

  /**
   * The test rollback
   * @param {object} env All env variables
   * @param {object} ctx The context built from "createContext"
   * @param {object} logger The logger object to print out messages
   * @returns {Promise}
   */
  rollback
};
