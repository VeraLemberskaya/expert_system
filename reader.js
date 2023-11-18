const readline = require('readline');

const questions = {
  getFeaturesCount: () => 'Enter features count: ',
  getObjectsCount: () => 'Enter objects count: ',
  getFeatureName: (count) => `Enter the name of the ${count} feature: `,
  getObjectName: (count) => `Enter the name of the ${count} object: `,
  getFeaturePresence: (object, feature) => `Does the ${object} have the "${feature}" feature? (y/n) `,
  getFeatureQuestion: (feature) => `Does object has the "${feature}" feature? (y/n) `,
};

class Reader {
  _rl;

  constructor() {
    this._rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async read(question) {
    const result = await new Promise((resolve) => {
      this._rl.question(question, resolve);
    });

    return result;
  }

  stop() {
    this._rl.close();
  }
}

const reader = new Reader();

const readFeaturesNames = async (featuresCount) => {
  const features = [];

  for (let i = 0; i < featuresCount; i++) {
    const featureName = await reader.read(questions.getFeatureName(i + 1));

    features.push(featureName);
  }

  return features;
};

const readObjectsNames = async (objectsCount) => {
  const objects = [];

  for (let i = 0; i < objectsCount; i++) {
    const objectName = await reader.read(questions.getObjectName(i + 1));

    objects.push(objectName);
  }

  return objects;
};

const readFeaturesCount = async () => {
  const count = await reader.read(questions.getFeaturesCount());

  return count;
};

const readObjectsCount = async () => {
  const count = await reader.read(questions.getObjectsCount());

  return count;
};

function logTitle(name) {
  const title = name.toUpperCase();
  console.log(`${title}`);
}

const readObjects = async (features, objects) => {
  const data = Array(features.length).fill([]);

  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    logTitle(object);

    for (let j = 0; j < features.length; j++) {
      const feature = features[j];

      const value = await reader.read(questions.getFeaturePresence(object, feature));
      const result = value === 'y' ? 1 : 0;
      data[j] = [...data[j], result];
    }
  }

  return data;
};

const readData = async () => {
  const featuresCount = await readFeaturesCount();
  const features = await readFeaturesNames(featuresCount);

  const objectCount = await readObjectsCount();
  const objects = await readObjectsNames(objectCount);

  const data = await readObjects(features, objects);

  return { features, objects, data };
};

const readFeatureAvailability = async (feature) => {
  const result = await reader.read(questions.getFeatureQuestion(feature));

  const hasFeature = result === 'y' ? true : false;

  return hasFeature;
};

module.exports = {
  readData,
  readFeatureAvailability,
};
