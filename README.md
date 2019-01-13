# fittest (Fast InTegration TEST)
[![Build Status](https://travis-ci.org/szanata/fittest.svg?branch=master)](https://travis-ci.org/szanata/fittest)

**fittest** (Fast InTegration TESTs) is a tool to create integration tests.

## Main features

- Create, organize and run complex multi step integration test scripts
- Use maximum parallelism and process isolation
- Use webhooks to test your services on a public url which every test creates
- Write tests your way, this is just a shell
- Use your favorite libraries to assert code, make http request, etc
- Get detailed breakdown of each step timing
- Coming soon: Get detailed timing on each http request

## Table of content

- [Setup](#setup)
- [Anatomy of a test](#anatomy-of-a-test)
- [Options](#options)
- [Tests path](#tests-path)
- [Blocks](#blocks)

## Setup

### 1. Download and install the project from NPM

```
npm install fittest
```

### 2. Create a config file

`.fittestconfig`

```js
{
  "path": "./tests"
}
```

### 3. Create your tests folder

```
project
|-- .fittestconfig
|-- tests/
```

### 4. Create some tests

You can have any amount of tests, and each of them will look something like this:

```js
fittest( 'Your test name', test => {

  test.before( () => {
    // run me before
  });

  test.step( 'Some step on your tes script', () => {
    // do something
  }).undo( () => {
    // undo what you did
  });
  
  test.after( () => {
    // run me after
  });
});
```

### 5. Run your tests

Simple execute a cmd
```bash
$ fittest
```

or add to your `package.json`:
```js
...
  "scripts": {
    "integration_tests": "fittest"
  }
...
```

## Anatomy of a test

Every test consist of *n* steps (`step`), which will run synchronously.

After all steps are executed, their rollbacks `step.undo` will run in a reverse order.

Also, tests can have hooks: *before*, *beforeEach*, *after*, *afterEach*.

`before` and `after` will run before and after all the steps, respectively.

`beforeEach` and `afterEach` will run before and after each step, respectively.

### Arguments

All test methods will receive the same argument: `context`. It is used to share values between each test method.

It's a js `Map` like object, but unfortunately there are some restrictions using it: do not set any keys or values different than Number, String, Boolean, Arrays or Literal Objects. This limitations is due the way this object will be serialized to be shared across the test methods or between blocks. Remember that each test run in a isolated node process.

### *fittest* Function

`fittest()` function is a global variable used to create a new test, it receive two arguments, the test name, and a function with the actual tests.

### *test* Object

The test object, received in the callback function of the `fittest` global fn provides all the tools to create a test.

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

This is the most basic tool to write a test. Conceptually a step is a atomic operation which should be accomplished as a part of a test itselft. Eg: On a test of a CRUD, a step is a POST, a PUT, a GET or a DELETE.

It receives two arguments, the name of the step, and a function with the actual code to be run. It will return `step Object` which have just one method `.undo()`, which receives a function with the code to undo this step (if needed). Wherever any step throws errors or not, each *undo* from previous steps will be invoked in the reverse order.

The steps and their rollbacks will resolve synchronously and in order of declaration, as the following examples:

##### Example with errors

Given a test which declared 6 steps:

```js
test.step('1', () => {} ).undo( () => {});
test.step('2', () => {} ).undo( () => {});
test.step('3', () => {} ).undo( () => {});
test.step('4', () => {} );
test.step('5', () => { throw new Error() } ).undo( () => {});
test.step('6', () => {} ).undo( () => {});
```

These will run as following:

1. Step 1
2. Step 2
3. Step 3
4. Step 4
5. Step 5: Error! (Stop here and never invoke the next step)
6. Skip "undo Step 4" as it does not have a `undo` hook
7. Undo Step 3
8. Undo Step 2
9. Undo Step 1

##### Example without errors

```js
test.step('1', () => {} ).undo( () => {});
test.step('2', () => {} ).undo( () => {});
test.step('3', () => {} ).undo( () => {});
```

These will run as following:

1. Step 1
2. Step 2
3. Step 3
4. Undo Step 3
5. Undo Step 2
6. Undo Step 1

#### *.env.asyncEvent()* usage:

.asyncEvent is used to await to a specific async event from *fittest* to happen. It always returns a promise.

.asyncEvent arguments:

| Name | Type | Description |
| -------- | ---- | ----------- |
| eventName | string | Event name to await. Possible events: `http-get`, `http-post` |
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

## Options

Configurations send to `.run()` method.

| Property | Type | Required | Default | Description |
| -------- | ---- | -------- | ------- | ---------- |
| afterAll | string | | *none* | Path to a script file to run after the tests |
| beforeAll | string | | *none* | Path to a script file to run before the tests |
| eventTimeoutTime | number | | 1 minute | The time in milliseconds to wait before a async event is killed due timeout |
| path | string | **yes** | *none* | The directory where the tests will be read from |
| timeoutTime | number | | 5 minutes | The time in milliseconds to wait before a test is killed due timeout |
| retries | number | | 0 | Number of retries to perform on each test that fails |


## Tests path

The tests path (`path` options) is where your tests are located, this can be either a folder or a single `.js` file. The configuration follow these rules:

- If a folder is provided, it will read it recursively searching for:
  - Any `index.js` file inside a directory that ends with `_test` in its name. Eg.: `foo_tests/index.js`
  - Any file which the name ends in `.test.js`. Eg.: `my_super_awesome.test.js`
- If a single file path is provided, it will read as a test (If it is a `.js` file)
- Otherwise it will throw a error

Examples:

Given that the `path` folder is `./tests`:
```
project    
|-- .fittestconfig
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
|-- .fittestconfig
|-- tests
    |-- anything_test // not called
        |-- index.js
        |-- helper.js
        |-- other_file.js
    |-- foo.js // this is called!
    |-- foo.test.js // not called
```

## Blocks

Blocks are script files that will run before or after the tests. They must be files that exports a function.

This functions have the same signature as any test phase, receiving the same arguments: *env*, *ctx*, *logger*.

Example of beforeAll block:
```js
module.exports = ( env, ctx, logger ) => {
  // run something you need before all the tests
}
```
