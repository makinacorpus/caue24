module.exports = {
  launch: {
    headless: process.env.HEADLESS !== 'false',
  },
  server: {
    command: 'serve -l 5555 -d _site',
  },
};
