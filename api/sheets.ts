import { google } from 'googleapis';
import { auth } from './auth';

const sheetsApi = google.sheets({ version: 'v4' });

export async function readSheet<T>(
  spreadsheetId: string,
  range: string,
  firstRowAsKeys?: true,
): Promise<T[]>;
export async function readSheet<T>(
  spreadsheetId: string,
  range: string,
  firstRowAsKeys: boolean = true,
): Promise<T[] | string[][]> {
  const {
    data: {
      values: [keys, ...values],
    },
  } = await sheetsApi.spreadsheets.values.get({
    auth: await auth(),
    spreadsheetId,
    range,
    valueRenderOption: 'UNFORMATTED_VALUE',
  });
  return firstRowAsKeys
    ? values.map(columns =>
        keys.reduce(
          (acc, key, idx) => ({
            ...acc,
            [key]: columns[idx],
          }),
          {} as T,
        ),
      )
    : [keys, ...values];
}

export async function writeSheet(
  spreadsheetId: string,
  range: string,
  ...columns: string[][]
) {
  await sheetsApi.spreadsheets.values.update({
    auth: await auth(),
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [...columns] },
  });
}
