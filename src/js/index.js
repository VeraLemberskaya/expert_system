const reader = require('./reader');
const { ExpertSystem } = require('./expertSystem');

//***HARDCODED DATA***

// const data = [
//   [1, 1, 1, 1],
//   [1, 0, 0, 0],
//   [0, 1, 0, 0],
//   [1, 0, 0, 1],
//   [0, 1, 0, 0],
// ];

// const features = ['крылья', 'клюв', 'двигатель', 'лапки', 'шасси'];

// const objects = ['птица', 'самолет', 'планер', 'муха'];

async function main() {
  const { data, features, objects } = await reader.readData();

  const expertSystem = new ExpertSystem({ data, features, objects });

  let result;

  while (true) {
    const feature = expertSystem.getLowSumFeature();

    const hasFeature = await reader.readFeatureAvailability(feature);

    const possibleObjects = expertSystem.processFeatureAvailability(feature, hasFeature);

    if (possibleObjects.length === 0) {
      result = 'UNKNOWN OBJECT';
      break;
    }

    if (possibleObjects.length === 1) {
      result = `Searched object - ${possibleObjects[0]}`;
      break;
    }
  }

  console.log(result);
}

main();
