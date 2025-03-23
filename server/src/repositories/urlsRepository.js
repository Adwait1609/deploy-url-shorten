const Url = require('../models/Url');

async function create(params) {
  console.log(`Creating URL with params: ${JSON.stringify(params)}`);
  const result = await Url.create(params);
  console.log(`Created URL: ${JSON.stringify(result)}`);
  return result;
}

async function findAll() {
  console.log('Finding all URLs');
  const result = await Url.find();
  console.log(`Found URLs: ${result?.length || 0}`);
  return result;
}

async function findOne(params) {
  console.log(`Finding one URL with params: ${JSON.stringify(params)}`);
  const result = await Url.findOne(params);
  console.log(`Found URL: ${JSON.stringify(result)}`);
  return result;
}

async function updateOne(query, update) {
  console.log(`Updating URL with query: ${JSON.stringify(query)}`);
  const result = await Url.findOneAndUpdate(query, update, { new: true });
  console.log(`Updated URL: ${JSON.stringify(result)}`);
  return result;
}

async function deleteOne(query) {
  return await Url.deleteOne(query);
}

module.exports = { create, findAll, findOne, updateOne, deleteOne };