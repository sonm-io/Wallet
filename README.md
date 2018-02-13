# SONM Wallet


### https://sonm-io.github.io/wallet-web/
### [Download the Latest Release](https://github.com/sonm-io/Wallet/releases/latest)

## User guide
https://docs.sonm.io/guides/sonm-wallet-guide

## What is SONM Wallet?

SONM Wallet is SONM GUI, a software program that stores private and public keys and provide SONM functions for users (Consumers and Suppliers).

SONM Wallet provides the following functions:

* Manage user Ethereum accounts, support multiaccounts, create new account, export/import keystore files (UTC/JSON)
* Send and receive Ether, SNM tokens and custom ERC20 tokens
* View local transaction history
* Manage user profile (SONM network profile), support multiprofiles (this and mentioned below bullet-list features are planned as part of MVP-livenet wallet release)
* View orders in SONM Marketplace
* Place Consumer's BID orders
* Manage Supplier's resource slots for ASK orders
* View deals
* Run and track tasks
* SONM Wallet is a desktop application that should be downloaded and installed on a PC or laptop. It is only accessible from the single computer in which they are downloaded. SONM Wallet is implemented in TypeScript. Wallet is one html file for all operation systems (view SONM Wallet Guide).

Hosted SONM wallet version will be provided as well.

### What currencies?

SONM Wallet support Ethereum, SNM token and all other Ethereum ERC-20 tokens. Default view includes Ether and SNM.

### Transaction fees

Additional fees is absent in SONM Wallet. You pay only Ethereum fees for transactions.

### Security assurance

SONM Wallet supports the use of multiple profiles (several wallets) within the application. For each wallet the user set up a wallet name and wallet password.

Switching between wallets are avaliable when the application starts or refreshes.

You may include any quantity of Ethereum accounts into one wallet. To include account or make a trensaction you shoul enter the account password.

Local settings for each wallet (account key files, list of accounts and tokens, transaction history) are stored in the local SONM Wallet storage on the user's PC. The settings file is encrypted with the wallet password.
## Developers part

#### Before start:

```bash
npm i
```

#### Run:

```bash
npm run webpack # run app in dev mode
```

#### Build:
```bash
npm run webpack:one # build app with index.html and app.bundled.js into ./dist 
npm run webpack:web # build app for web into ./docs
```

Generates app in `docs` folder.

#### Tests:

```bash
npm run karma # run tests with Karma
```

#### React components:

```bash
npm run sg # run Isolated React component development environment
```

## Folder structure:

```
│
├── front
│   ├── assets - logo, font, entry point
│   ├── config - webpack configuration
│   ├── src - app source code
│   ├── typings - TypeScript definitions
├── test - Karma tests
```