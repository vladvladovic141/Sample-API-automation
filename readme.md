## Tech Stack

**Libraries:** chai, mocha, supertest, get-nested-value, mochawesome

**Requirements:** Node (min version 14)


## Installation

Install with npm

```bash
  npm install
```
    
## Running Tests

To run tests, you will need to provide access token in the **config.js** from https://gorest.co.in/

Afterwards run the following command

```bash
  npm run $testSetName $env
```
$testSetName - mandatory param, test set name. List of the supported test sets:
 - user
 - user-negative

$env - environment 

#### Execution report can be find at /mochawesome-report/mochawesome.html