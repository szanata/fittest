# fittest (Fast InTegration TEST)
[![Build Status](https://travis-ci.org/szanata/fittest.svg?branch=master)](https://travis-ci.org/szanata/fit-integration-tests)

**fittest** (Fast InTegration TESTs) is a tool to create integration tests.

## Main features

- Create, organize and run complex multi step integration test scripts
- Use maximum parallelism and process isolation
- Use webhooks to test your services on a public url each test spin
- Use your favorite assertion library
- Get detailed breakdown of each step timing

## Setup

### 1. Download and install the project

```
npm install fittest
```

### 2. Create a startup .js file on your project to run the tests

```
project    
|-- test_index.js    
```

This is a start point, were the options are set and the whole thing starts.

```js
const fittest = require( 'fittest' );

fittest.run( { testsDir: './tests' } );
```

### 3. Create a folder for the actual tests

```
project    
|-- test_index.js
|-- tests
```

### 4. Create some tests

Each of your tests will look something like this
```
fittest( 'Your test name', test => {

  test.before( () => {
    'run me before';
  });

  test.step( 'Some step on your tes script', () => {
    'do something'
  }).undo( () => {
    'undo what you did'
  });
});
```

## Test anatomy

Every test consist of *n* steps (`step`), where each of those will run synchronously.

After all steps run, each `step.undo` will run in a reverse order.

The tests can have hooks: *before*, *beforeEach*, *after*, *afterEach*.

`before` and `after` will run before and after all the steps, respectively.

`beforeEach` and `afterEach` will run before and after each step, respectively.

### Arguments

All test methods will receive the same argument: `context`. It is used to share values between each test method.

It's a js `Map` like object, but unfortunately there are some restrictions using it: do not set any keys or values different than Number, String, Boolean, Arrays or Literal Objects. This limitations is due the way this object will be serialized to be shared across the test methods or between blocks.

### *fittest* Function

TBD;

### *test* Object

The test object, received in the callback function of the `fittest` global fn provides all the tools to run tests.

It provide the methods to create steps and hooks, and also the tools to use the webhooks:

Methods:
| Method | Args | Return | Description |
| ------ | ---- | ------ | ----------- |
| .step() | name, fn | stepObj | Create a new test step. Using the return value, a `undo` hook can be attached to the step. |
| .before() | fn | nil | Create a `before` hook. It will run once, before all steps. |
| .after() | fn | nil | Create a `after` hook. It will run once, after all the steps. |
| .beforeEach() | fn | nil | Create a `beforeEach` hook. It will run before each of the steps. |
| .afterEach() | fn | nil | Create a `afterEach` hook. It will run after each of the steps. |

`.env` property:
| Property | Type | Description |
| -------- | ---- | ----------- |
| serverUrl | string | The public accessible Url so the test can receive webhooks via GET or POST. |
| asyncEvent | function | An async function to await for a event to occur. See below. If the event don't happen in the time limit, it throws an error. |

#### *.step()* usage:


TDB;


##### *.env.asyncEvent()* usage:

.asyncEvent is used to await to a specific async event from *fittest* to happen. It always returns a promise.

.asyncEvent arguments:

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
