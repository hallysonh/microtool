import { networkIp } from '../src/modules/utils/os';

describe('OS functions', () => {
  it('works if networkIp return a truthy value', async () => {
    expect(networkIp()).toBeTruthy();
  })
})
