const assert = require('assert');
const dataSource = require('../lib/datasource.js');
const fs = require('fs');
const mkdirp = require('mkdirp');

describe('dataSource when data exists', () => {
  const authorization = 'test-auth';
  const financialId = 'test-financial-id';
  const path = 'accounts/123/transactions';
  const transactions = {
    some: 'transactions',
  };
  const version = 'v1.2';

  const request = {
    path: `/open-banking/${version}/${path}`,
    headers: {
      'authorization': authorization,
      'x-fapi-financial-id': financialId,
    },
  };

  beforeEach(() => {
    process.env.VERSION = version;
    mkdirp.sync(`./data/${financialId}/${authorization}/accounts/123`);
    const file = `./data/${financialId}/${authorization}/${path}.json`;
    fs.writeFileSync(file, JSON.stringify(transactions));
  });

  afterEach(() => {
    const file = `./data/${financialId}/${authorization}/${path}.json`;
    fs.unlinkSync(file);
    fs.rmdirSync(`./data/${financialId}/${authorization}/accounts/123`);
    fs.rmdirSync(`./data/${financialId}/${authorization}/accounts`);
    fs.rmdirSync(`./data/${financialId}/${authorization}`);
    fs.rmdirSync(`./data/${financialId}`);
  });

  it('returns data based on request headers and path', (done) => {
    dataSource.initResources(() => {
      dataSource.mockData(request, (data) => {
        assert(data, transactions);
        done();
      });
    });
  });
});
