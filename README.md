# FIT Integration Tssts
FIT (Fast Integration Tests) is a tool to run integration tests fast and in parallel.

## Main features

- Can execute any number of tests in parallel
- Each test can be isolated from the other, and have its own structure
- Each test can receive webhooks on a public url created dynamically
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

This is were the tests are configurated.
Supported config for now is just the folder where the tests are stored.

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

  createContext() {
    return { }
  },

  exec( env, ctx, logger ) {

  },

  rollback( env, ctx, logger ) {

  }
};
```
Methods:

**createContext**: Will create a object where you can share values between `exec` and `rollback`. Is optional.

**exec**: This will have your test logic.

**rollback**: This will have your rollback logic.

Every test will have the *createContext*, *exec* and *rollback* invoked in this order.

Important: Each test can be a folder with a index.js file inside, or a single .js file, so the tests can be something like this:

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

### Arguments

Both `exec` and `rollback` receive the same arguments **env**, **ctx**, **logger**:

#### **env**
The test environment, this is a object containing any tools the framework provides. For now there are:

| Property | Type | Description |
| -------- | ---- | ----------- |
| serverUrl | string | The public accessible url so the test can receive webhooks via GET or POST. |
| asyncEvent | function | A async func to block the test and await for a event to occur. See events below. If the event dont occur in one minute, it throws an error. |

Async Events:

| Event name | Params | Description |
| ---------- | ------ | ----------- |
| http-get | { req } | Invoked when serverUrl receives a GET. |
| http-post | { req, body } | Invoked when serverUrl receives a POST, body is parsed to JSON if possible. |

#### **ctx**
The test context, created using `createContext` method, or a empty object if the method is omitted.

#### **logger**
A handy tool to print test outputs.

*Important: As the tests run in parallel, any stdout like console.log will be mixed across all tests, use this logger instead.*

The logger have the following methods:

| Method | Description |
| ------- | ----------- |
| flow | Use this to print when some test starts |
| step | Use this to print when a step inside the test will start |
| ok | Use this to print when some step executed without errors |
| error | Use this to print an error |

### TODO

- Run tests using `spawn_child`, instead of `require`
- Make features, like the webserver, optional
- Add a email feature, to receive and assert emails
