# SONM Wallet

## Developers part

#### Run:

```bash
npm i
npm run webpack # run app in dev mode
```

#### Build:
```bash
npm run webpack:prod # build app
```

Generates app in `dist` folder.

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