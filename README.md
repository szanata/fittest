# FIT Integration Tests
[![Build Status](https://travis-ci.org/szanata/fit-integration-tests.svg?branch=master)](https://travis-ci.org/szanata/fit-integration-tests)

FIT (Fast Integration Tests) is a tool to run integration tests fast and in parallel.

## Main features

- Can execute tests in parallel (one per CPU plus one)
- Each test runs on a new isolated node process
- Test can receive webhooks on a public url created dynamically
- The code can use a "await" to stop until a webhook be received
- Don't rely on *mocha* or any other test framework
- Can be used with *chai* or others assertion tools
- Fast, I mean... really fast

## Setup

### 1. Download and install the project

```
npm install fit-integration-tests
```

### 2. Create a folder for your integration tests

```
project    
|-- integration_tests
```

### 3. Inside the folder, create a index.js, to start the tests

```
project    
|-- integration_tests
    |-- index.js    
```

This is were the tests are configured, or the path for a single test.
You must specific the tests directory.

The content will be something in these lines:
```js
const IntegrationTestFw = require( 'mw-integration-test-fw' );
const { join } = require( 'path' );

const testsDir = join( __dirname, './tests' );

IntegrationTestFw.run( { testsDir } );
```

### 4. Create another folder inside the first one for the actual tests

```
project    
|-- integration_tests
    |-- index.js    
    |-- tests
```

### 5. Create some tests

Your tests must have this interface:
```
module.exports = {

  before( env, ctx, logger ) { },

  exec( env, ctx, logger ) { },

  after( env, ctx, logger ) { }
};
```
**Test Phases:**

Every test have 3 distinct phases. The main phase `exec` is mandatory.

If any phase fails, the tests are considered failing.

Phases run in order and synchronously.

| Name | Description |
| ---- | ----------- |
| *before* | This will run before the `exec` method. If it fails, the test stops here, failing. |
| *exec* | This will have your test logic. If it fails, the next phase will run anyway. The tests failed. |
| *after* | This will run after the `exec` method. If if fails, the tests fail. |

**Tests folders:**

Each test can be a folder with a index.js file inside, or a single .js file, so the tests can be something like this:

```
project    
|-- integration_tests
    |-- index.js    
    |-- tests
        |-- test_1
            |-- index.js
            |-- helper.js
            |-- other_file.js
        |-- test_2
            |-- index.js
        |-- test_3.js
```

## Test options

Configurations send to `.run()` method.

| Property | Type | Required | Default | Description |
| -------- | ---- | -------- | ------- | ---------- |
| testsDir | string | **yes** | *none* | The directory where the tests will be read from. |
| timeoutTime | string | | 5 minutes | The time in milliseconds to wait before a test is killed due timeout. |
| displaySuccessOutput | bool | | false | Print out logs from tests that passed. |

## Test arguments

All test methods (`before`, `exec` and `rollback`) receive the same arguments **env**, **ctx**, **logger**:

### **env**
The test environment, this is a object containing any tools the framework provides.

| Property | Type | Description |
| -------- | ---- | ----------- |
| serverUrl | string | The public accessible url so the test can receive webhooks via GET or POST. |
| asyncEvent | function | A async func to block the test and await for a event to occur. See events below. If the event dont occur in one minute, it throws an error. |

Async Events:

| Event name | Params | Description |
| ---------- | ------ | ----------- |
| http-get | { req } | Invoked when serverUrl receives a GET. |
| http-post | { req, body } | Invoked when serverUrl receives a POST, body is parsed to JSON if possible. |

### **ctx**
The test context. It starts out as a `{ }` (empty object). Every method have access to it and can add or remove properties to it in order to share values between the test phases.

### **logger**
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

All logger methods can receive any number of arguments, which will be converted to string and concatened using a space.

### TODO

- Make features, like the webserver, optional
- Add a email feature, to receive and assert emails
