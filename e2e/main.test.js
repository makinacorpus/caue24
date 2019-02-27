describe('Main app', () => {
  describe('Homepage', () => {
    beforeAll(async () => {
      await page.goto('http://127.0.0.1:5555/')
    });

    it('should contain intro text', async () => {
      await expect(page).toMatch('Nous vous invitons à naviguer dans ces albums du territoire');
    });

    it('should have "home" state', async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const bodyState = await page.evaluate(() => document.body.dataset.state);
      await expect(bodyState).toEqual('home');
    });

    it('should have a valid Leaflet map', async () => {
      const leafletRender = await page.evaluate(() => !!document.querySelectorAll('.leaflet-map-pane').length);
      await expect(leafletRender).toBe(true);
    });

    it('should have as many quicklinks as EPCI count', async () => {
      const home = await page.evaluate(async () => {
        const response = await fetch('http://127.0.0.1:5555/data/geojson/home.geojson');
        return await response.json();
      });
      const epciCount = home.features.length;
      const menuItemCount = await page.evaluate(() => document.querySelectorAll('#header .dropdown-menu > li').length);

      await expect(menuItemCount).toEqual(epciCount);
    });

    it('should have clickable button', async () => {
      await expect(page).toClick('#teasing .btn');
    });

    it('should have "menu" state', async () => {
      const bodyState = await page.evaluate(() => document.body.dataset.state);
      await expect(bodyState).toEqual('menu');
    });
  });

  describe('Internal page', () => {
    it('should have some text', async () => {
      await page.goto('http://127.0.0.1:5555/#4/architecture')
      await expect(page).toMatch('DE LA CONSTRUCTION TRADITIONNELLE A L’ARCHITECTURE CONTEMPORAINE');
    });

    it('should have "map" state', async () => {
      const bodyState = await page.evaluate(() => document.body.dataset.state);
      await expect(bodyState).toEqual('map');
    });
  });
});
