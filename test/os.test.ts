import { networkIp } from '../src/os';

describe('OS functions', () => {
  it('works if networkIp return a truthy value', async () => {
    expect(networkIp()).toBeTruthy();
  })
})
