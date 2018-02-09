# Microtools

[![travis build](https://travis-ci.org/hallysonh/microtools.svg?branch=master)](https://travis-ci.org/hallysonh/microtools)
[![version](https://img.shields.io/npm/v/@hallysonh/microtools.svg)](http://npm.im/@hallysonh/microtools)
[![MIT License](https://img.shields.io/github/license/hallysonh/microtools.svg)](https://opensource.org/licenses/MIT)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A Node.js module that returns the plural or singular form of any noun

## Documentation

Access the documentation [here](https://hallysonh.github.io/microtools)

## Installation

```sh
npm i -S microtools
yarn add microtools
```

## Usage

### JavaScript

```javascript
var microtools = require('@hallysonh/microtools');
var cfg = require('./config');
microtools.consultRegister(ctx, cfg.appConfig, cfg.consulConfig);
```

### TypeScript

```typescript
import { consulRegister } from '@hallysonh/microtools';
import { appConfig, consulConfig } from './config';
consulRegister(ctx, appConfig, consulConfig);
```
