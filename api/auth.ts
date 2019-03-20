import { readFile } from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';
import { JWT } from 'google-auth-library';

const promisedFile = promisify(readFile);

export async function auth() {
  const credentials = JSON.parse(
    await promisedFile('./credentials.json', 'utf-8'),
  );
  const client = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  await client.authorize();
  return client;
}
