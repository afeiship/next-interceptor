# next-interceptor
> Interceptor for next.

[![version][version-image]][version-url]
[![license][license-image]][license-url]
[![size][size-image]][size-url]
[![download][download-image]][download-url]

## installation
```bash
npm install -S @jswork/next-interceptor
```

## usage
```js
import NxInterceptor from '@jswork/next-interceptor';

const intercetor = new NxInterceptor({
  async: false,
  items:[/* ... your intercetpros ... */]
});

// get response interceptor process data;
const reqData = intercetor.compose(data1, 'request');
const resData = intercetor.compose(data2, 'response');
```

## license
Code released under [the MIT license](https://github.com/afeiship/next-interceptor/blob/master/LICENSE.txt).

[version-image]: https://img.shields.io/npm/v/@jswork/next-interceptor
[version-url]: https://npmjs.org/package/@jswork/next-interceptor

[license-image]: https://img.shields.io/npm/l/@jswork/next-interceptor
[license-url]: https://github.com/afeiship/next-interceptor/blob/master/LICENSE.txt

[size-image]: https://img.shields.io/bundlephobia/minzip/@jswork/next-interceptor
[size-url]: https://github.com/afeiship/next-interceptor/blob/master/dist/next-interceptor.min.js

[download-image]: https://img.shields.io/npm/dm/@jswork/next-interceptor
[download-url]: https://www.npmjs.com/package/@jswork/next-interceptor