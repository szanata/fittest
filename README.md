# fittest (Fast InTegration TEST)
[![Build Status](https://travis-ci.org/szanata/fit-integration-tests.svg?branch=master)](https://travis-ci.org/szanata/fit-integration-tests)

fittest (Fast InTegration TESTs) is a tool to create ingetration tests.

## Main features

- Run tests in parallel according to the available CPUs
- Each test runs on a new isolated node process
- Test can receive webhooks on a public Url created dynamically
- The code can use a "await" to stop until a webhook is received
- Don't rely on *mocha* or any other test framework
- Can be used with *chai* or others assertion tools
- Fast, I mean... really fast

## Setup

### 1. Download and install the project

```
npm install fittest
```

### 2. Create a startup js file on your project to run the tests

```
project    
|-- run_tests.js    
```

This is were the tests are configured, here can set the options and the tests folder.

```js
const IntegrationTestFw = require( 'mw-integration-test-fw' );

IntegrationTestFw.run( { path: './tests' } );
```

### 3. Create a folder for the actual tests

```
project    
|-- run_tests.js
|-- tests
```

### 4. Create some tests

Each of your tests must have a file with this interface:
```
module.exports = {

  before( env, ctx, logger ) { 

  },

  exec( env, ctx, logger ) { 

  },

  after( env, ctx, logger ) { 

  }
};
```

## Test anatomy

Every test have 3 distinct phases. The main phase `exec` is mandatory.

If any phase fails, the tests are considered failing.

Phases run in order and synchronously. Each phase is called by a method with the same name:

| Name | Description |
| ---- | ----------- |
| *before* | This will run before the `exec` method. If it fails, the test stops here, failing. |
| *exec* | This will have your test logic. If it fails, the next phase will run anyway. The tests failed. |
| *after* | This will run after the `exec` method. If if fails, the tests fail. |


### Arguments

All test methods (`before`, `exec` and `rollback`) receive the same arguments **env**, **ctx**, **logger**:
- [env](#env)
- [ctx](#ctx)
- [logger](#logger)

#### env

The test environment, this is a object containing any tools the framework provides.

| Property | Type | Description |
| -------- | ---- | ----------- |
| serverUrl | string | The public accessible Url so the test can receive webhooks via GET or POST. |
| asyncEvent | function | An async function to block the test and await for a event to occur. See events below. If the event don't happen in the time limit, it throws an error. |

##### .asyncEvent usage:

.asyncEvent is used to await to a specific async event from FIT to happen. It always returns a promise.

Arguments:

| Name | Type | Description |
| -------- | ---- | ----------- |
| eventName | string | Event name to await. Possible: `http-get`, `http-post` |
| threshold | number | Max time in milliseconds to await for this event to happen, throws an Error if the event doest no happen. Default: one minute |

Events results:

- `http-get`: resolves an object:
``` js
{
  url: 'url', // witch Url received the event
  headers: { }, // http headers received
  qs: { } // deserialized query string object received on the url
}
```

- `http-post`: resolves an object:
``` js
{
  url: 'url', // witch Url received the event
  headers: { }, // http headers received
  qs: { }, // deserialized query string object received on the url
  body: { } // deserialized post body
}
```

Example:

```js

// do some request
axios.get( env.serverUrl );


// get the response
const response = await env.asyncEvent( 'http-get' );
```

#### ctx

The test context. Used to shared values between each test phase.

It's a js Map object, but unfortunately there are some restrictions using it: do not set any keys or values different than Number, String, Boolean, Arrays or Literal Objects. This limitations is due the way this object will be serialized to be shared across the test phases or between the "beforeAll" and the tests and the "afterAll" block.

Each phase can change it at will.

#### logger

A handy tool to print test outputs.

*Important: As the tests run in parallel, any stdout like console.log will be mixed across all tests, use this logger instead.*

The logger have the following methods:

| Method | Description | Output color |
| ------ | ----------- | ------------ |
| log | Use this to print some basic logs | white |
| warn | Use this to print something important | yellow |
| ok | Use this to print something good | green |
| error | Use this to print an error | red |
| info | Use this to print an oddity | blue |

All logger methods can receive any number of arguments, which will be converted to string and concatenated using a space.

### Tests path

FIT reads the tests recursively, looking for:
- Any `index.js` file inside a folder that ends with `_test`;
- Any file that ends with `.test.js`;
- A single file, if the `path` option points to that file.

Examples:

Given that the `path` folder is `./tests`:
```
project    
|-- run_tests.js
|-- tests
    |-- anything_test
        |-- index.js // this is called!
        |-- helper.js // not called
        |-- other_file.js // not called
    |-- no_so_much_test
        |-- helper.js // not called
    |-- another_folder
        |-- index.js // not called
    |-- common.js // not called
    |-- common.test.js // this is called!
```

Given that the `path` folder is `./tests/foo.js`:
```
project    
|-- run_tests.js
|-- tests
    |-- anything_test // not called
        |-- index.js
        |-- helper.js
        |-- other_file.js
    |-- foo.js // this is called!
    |-- foo.test.js // not called
```

### Options

Configurations send to `.run()` method.

| Property | Type | Required | Default | Description |
| -------- | ---- | -------- | ------- | ---------- |
| testsDir | string | **yes** | *none* | The directory where the tests will be read from. |
| timeoutTime | string | | 5 minutes | The time in milliseconds to wait before a test is killed due timeout. |
| displaySuccessOutput | bool | | false | Print out logs from tests that passed. |
| retries | number | | 0 | Number of retries to perform on each test that fails. |
| beforeAll | string | | *none* | Path to a script file to run before the tests |
| afterAll | string | | *none* | Path to a script file to run after the tests |

### Blocks

Blocks are script files that will run before or after the tests. They must be files that exports a function.

This functions have the same signature as any test phase, receiving the same arguments: *env*, *ctx*, *logger*.

Example of beforeAll block:
```js
module.exports = ( env, ctx, logger ) => {
  // run something you need before all the tests
}
```
