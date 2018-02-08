import '../src/modules/utils/stringTrimLine';

describe('String Util functions', () => {
  it('works if stringTrimLine trim spaces and remove lines from a string', async () => {
    const source = `
      Texto com multilhas linhas.
      Segunda linha.
      Terceira linha.
    `;
    const target = 'Texto com multilhas linhas. Segunda linha. Terceira linha.';
    expect(source.trimLine()).toBe(target);
  })
})
