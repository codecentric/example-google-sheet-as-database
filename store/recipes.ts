import * as Loki from 'lokijs';
import { readSheet } from '../api/sheets';
import { Recipe } from './Recipe';

const sheetId = '1o0VAQ4f2QafBjLUd53yCWEtdwKonu5wPM33CttxBTXI';
const sheetRange = 'Recipes!A:E';

const db = new Loki('recipes.json');
const collection = db.addCollection<Recipe>('recipes', { indices: ['id'] });

export async function setup() {
  const data = await readSheet<Recipe>(sheetId, sheetRange);
  collection.insert(data);
}

export async function refresh() {
  const data = await readSheet<Recipe>(sheetId, sheetRange);
  const ids = data.map(d => d.id);
  collection.findAndUpdate(
    obj =>
      ids.includes(obj.id) &&
      new Date(data.find(d => d.id === obj.id).updatedAt).getTime() >
        new Date(obj.updatedAt).getTime(),
    obj => Object.assign(obj, data.find(d => d.id === obj.id)),
  );
  collection.findAndRemove({ id: { $not: { $in: ids } } });
  collection.insert(data.filter(d => !collection.findOne({ id: d.id })));
}

export { collection };
