import express from 'express';
import Shopify, {ApiVersion, AuthQuery} from '@shopify/shopify-api';
require('dotenv').config();

const app = express();

const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST } = process.env;

Shopify.Context.initialize({
  API_KEY,
  API_SECRET_KEY,
  SCOPES: [SCOPES],
  HOST_NAME: HOST,
  IS_EMBEDDED_APP: false,
  API_VERSION: ApiVersion.July21
});
app.get('/', (req, res) => {
  res.send('Express');
})

app.get('/login', async (req, res) => {
  const authRoute = await Shopify.Auth.beginAuth(
    req, res, SHOP, 'generate', true,
  );
  return res.redirect(authRoute);
})

app.get('/generate', async (req, res) => {
  try {
    await Shopify.Auth.validateAuthCallback(req, res, req.query as unknown as AuthQuery,);
  } catch (err) {
    console.log(err)
  }
  return res.redirect('/');
});

/**
 * Name: Bogus Gateway
 * Card number: 1 (successful trans) 2 (failed) 3 (exception)
 * CVV: 111 
 * Expiry: 11/2099
 */

app.listen(9876, () => {
  console.log('your app is now listening on port 9876');
});
