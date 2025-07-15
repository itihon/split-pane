# split-pane
[![License][]](https://opensource.org/licenses/ISC)
[![Build Status]](https://github.com/itihon/split-pane/actions/workflows/ci.yml)
[![NPM Package]](https://npmjs.org/package/split-pane)
[![Code Coverage]](https://codecov.io/gh/itihon/split-pane)
[![semantic-release]](https://github.com/semantic-release/semantic-release)

[License]: https://img.shields.io/badge/License-ISC-blue.svg
[Build Status]: https://github.com/itihon/split-pane/actions/workflows/ci.yml/badge.svg
[NPM Package]: https://img.shields.io/npm/v/split-pane.svg
[Code Coverage]: https://codecov.io/gh/itihon/split-pane/branch/master/graph/badge.svg
[semantic-release]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg

> Split pane web component.

## 🕑 Developing...

## Install

``` shell
npm install @itihon/split-pane
```

## Use

``` typescript
import splitPane from 'split-pane'
// TODO: describe usage
```

### In HTML

``` html
<script type="module" src="/path/to/split-pane.js"></script>

<split-pane type="horizontal">
  <div>pane 1</div>
  <div>pane 2</div>
  <div>pane 3</div>
</split-pane>

<split-pane type="vertical">
  <div>pane 1</div>
  <div>pane 2</div>
  <div>pane 3</div>
</split-pane>
```

### In JS or TS

#### Create an instance and add to DOM:

``` js
import SplitPane from "@itihon/split-pane";

const splitPane = new SplitPane();

document.body.append(splitPane);
```

#### or get a reference to an existing instance:

``` js
const splitPane = document.getElementById('split-pane-1');
```

## Related

TODO

## Acknowledgments

TODO
