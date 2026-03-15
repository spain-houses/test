const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.raw({ type: '*/*' }));

app.all('*', async (req, res) => {
  try {
    const url = `https://api.telegram.org${req.url}`;
    const response = await axios({
      method: req.method,
      url: url,
      data: req.body,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json'
      },
      responseType: 'arraybuffer'
    });
    
    res.status(response.status);
    Object.keys(response.headers).forEach(key => {
      res.setHeader(key, response.headers[key]);
    });
    res.send(response.data);
  } catch (error) {
    res.status(500).send(`Proxy error: ${error.message}`);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy running on port ${port}`));