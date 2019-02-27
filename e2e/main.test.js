const fs = require('fs');

const appRoot = 'http://127.0.0.1:5555';
const homeData = JSON.parse(fs.readFileSync('_site/data/geojson/home.geojson'));
const pageIds = homeData.features.reduce((acc, { properties: { id } = {} }) => (id ? [...acc, id] : acc), []);

describe('Main app', () => {
  beforeAll(async () => await page.goto(appRoot));

  describe('Homepage', () => {
    beforeAll(async () => await page.goto(appRoot));

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
      const epciCount = homeData.features.length;
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
      await page.goto(`${appRoot}/#4/architecture`);
      await expect(page).toMatch('DE LA CONSTRUCTION TRADITIONNELLE A L’ARCHITECTURE CONTEMPORAINE');
    });

    it('should have "map" state', async () => {
      const bodyState = await page.evaluate(() => document.body.dataset.state);
      await expect(bodyState).toEqual('map');
    });
  });

  describe('Internal page', () => {
    for (const pageId of pageIds) {
      describe(`with id ${pageId}`, () => {
        it('should load from scratch', async () => {
          let loaded = false;
          try {
            await page.goto('about:blank');
            await page.goto(`${appRoot}/#${pageId}/portait`, { waitUntil: 'networkidle2' });
            loaded = true;
          } catch (e) {}

          expect(loaded).toBe(true);
        });

        it('should have right title in quicknav', async () => {
          const quicknavValue = await page.evaluate(() => document.querySelector('#header button.text').textContent);
          const realValue = homeData.features.find(feature => feature.properties.id === pageId).properties.label;

          await expect(quicknavValue).toEqual(realValue);
        });

      });
    }
  });
});
