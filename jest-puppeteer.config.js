module.exports = {
  launch: {
    headless: process.env.HEADLESS !== 'false',
    defaultViewport: { width: 1240, height: 850 },
  },
  server: {
    command: 'serve -l 5555 -d _site',
  },
};
