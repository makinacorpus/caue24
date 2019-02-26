describe('Dummy test', () => {
  it('should be true', () => {
    expect(true).toBe(true);
  })
});

describe('Main app', () => {
  beforeAll(async () => {
    await page.goto('http://127.0.0.1:5555/')
  })

  it('should contain "Dordogne"', async () => {
    await expect(page).toMatch('dordogne')
  })
});
