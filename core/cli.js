#!/usr/bin/env node

const { readFileSync } = require( 'fs' );
const { join } = require( 'path' );
const fittest = require( './index' );

const configFile = readFileSync( join( process.cwd(), '.fittestconfig' ) );

if ( !configFile ) {
  throw new Error( 'Invalid config file, using defaults' );
}

const config = JSON.parse( configFile );
Object.assign( config, { relativeDir: process.cwd() } );
fittest.run( config );
