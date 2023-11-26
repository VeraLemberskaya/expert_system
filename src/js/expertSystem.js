class ExpertSystem {
  _data;
  _features;
  _objects;

  constructor({ data, features, objects }) {
    const { filteredFeatures, filteredData } = this._filterFeaturesData(features, data);
    this._data = filteredData;
    this._features = filteredFeatures;
    this._objects = objects;
  }

  _filterFeaturesData(features, data) {
    const filteredFeatures = [];
    const filteredData = [];

    for (let i = 0; i < features.length; i++) {
      const hasObjects = data[i].some((el) => el);
      if (hasObjects) {
        filteredFeatures.push(features[i]);
        filteredData.push(data[i]);
      }
    }

    return {
      filteredFeatures,
      filteredData,
    };
  }

  getLowSumFeature() {
    const sumArr = [];

    function getSum(feature) {
      return feature.reduce((acc, curr) => (acc += curr), 0);
    }

    this._data.forEach((feature) => {
      const sum = getSum(feature);
      sumArr.push(sum);
    });

    const lowestSum = sumArr.sort()[0];

    const index = this._data.findIndex((feature) => getSum(feature) === lowestSum);
    const lowestSumFeature = this._features[index];

    return lowestSumFeature;
  }

  processFeatureAvailability(processedFeature, hasFeature) {
    const feature = this._features.find((feat) => feat === processedFeature);
    const featureIndex = this._features.indexOf(feature);

    const featureData = this._data[featureIndex];
    const filteredObjectsIndexes = [];

    for (let i = 0; i < featureData.length; i++) {
      const object = featureData[i];
      const condition = hasFeature ? !!object : !object;

      if (condition) {
        filteredObjectsIndexes.push(i);
      }
    }

    this._features.splice(featureIndex, 1);
    this._data.splice(featureIndex, 1);

    this._data = this._data.map((feature) => feature.filter((_, index) => filteredObjectsIndexes.includes(index)));
    this._objects = this._objects.filter((_, index) => filteredObjectsIndexes.includes(index));

    return this._objects;
  }
}

module.exports = {
  ExpertSystem,
};
