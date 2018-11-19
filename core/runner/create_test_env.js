const TestEnv = require( '../models/test_env' );
const valueValidator = require( '../utils/validators/value' );
const typeOrNilValidator = require( '../utils/validators/type_or_nil' );

const eventNameValidationMessage = 'First argument "eventName" must be a string. \
Supported values are "http-post", "http-get"';

const timeoutValidationMessage = 'Optional second argument "timeoutTime" must be a number.';

module.exports = ( fwEnv, id, emitter ) =>
  TestEnv.init( `${fwEnv.features.serverUrl}/${id}`, ( eventName, timeout = fwEnv.eventTimeoutTime ) => {
    valueValidator( eventName, [ 'http-post', 'http-get' ], 'string', eventNameValidationMessage );
    typeOrNilValidator( timeout, 'number', timeoutValidationMessage );

    return emitter.once( eventName, timeout );
  } );
