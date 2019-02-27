describe('Main app', () => {
  describe('Homepage', () => {
    beforeAll(async () => {
      await page.goto('http://127.0.0.1:5555/')
    });

    it('should contain intro text', async () => {
      await expect(page).toMatch('Nous vous invitons à naviguer dans ces albums du territoire');
    })

    it('should have clickable button', async () => {
      await expect(page).toClick('#teasing .btn');
    })
  });

  describe('Internal page', () => {
    it('should have some text', async () => {
      await page.goto('http://127.0.0.1:5555/#4/architecture')
      await expect(page).toMatch('DE LA CONSTRUCTION TRADITIONNELLE A L’ARCHITECTURE CONTEMPORAINE');
    });
  });
});
