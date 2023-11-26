const { ExpertSystem } = require('./expertSystem');

const initialForm = document.getElementById('initial-form');
const dataForm = document.getElementById('data-form');

let features;
let objects;
let data;
let expertSystem;

const createRow = (labelText, name) => {
  const row = document.createElement('div');
  row.classList.add('mb-3');

  const label = document.createElement('label');
  label.classList.add('form-label');
  label.innerHTML = labelText;

  const input = document.createElement('input');
  input.name = name;
  input.classList.add('form-control');

  row.appendChild(label);
  row.appendChild(input);

  return row;
};

const createText = (object) => {
  const node = document.createElement('p');
  node.innerHTML = `${object.toUpperCase()}`;

  return node;
};

const createButton = () => {
  const button = document.createElement('button');
  button.type = 'submit';
  button.classList.add('btn', 'btn-primary');
  button.innerHTML = 'Further';

  return button;
};

const createDataForm = () => {
  const question = (object, feature) => `Does the ${object} have the "${feature}" feature? (y/n) `;

  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];

    const text = createText(object);
    dataForm.appendChild(text);

    for (let j = 0; j < features.length; j++) {
      const feature = features[j];
      const label = question(object, feature);
      const name = `${j},${i}`;

      const row = createRow(label, name);
      dataForm.appendChild(row);
    }
  }

  const button = createButton();
  dataForm.appendChild(button);
  dataForm.style.display = 'block';
};

const readFeatureAvailability = (feature) => {
  return new Promise((resolve) => {
    const form = document.createElement('form');

    const handleSubmitFeatureAvailability = (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const hasFeature = !!(data.get('availability') === 'y');

      form.style.display = 'none';
      resolve(hasFeature);
    };

    const row = document.createElement('div');
    row.classList.add('mb-3');

    const label = document.createElement('label');
    const labelText = `Does object has the "${feature}" feature? (y/n) `;
    label.classList.add('form-label');
    label.innerHTML = labelText;

    const input = document.createElement('input');
    input.name = 'availability';
    input.classList.add('form-control');

    row.appendChild(label);
    row.appendChild(input);

    const button = createButton();

    form.appendChild(row);
    form.appendChild(button);
    form.addEventListener('submit', handleSubmitFeatureAvailability);

    document.body.appendChild(form);
  });
};

const startSurvey = async () => {
  let result;

  while (true) {
    const feature = expertSystem.getLowSumFeature();

    const hasFeature = await readFeatureAvailability(feature);

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

  const text = document.createElement('h3');
  text.innerHTML = result;

  document.body.appendChild(text);
};

const handleInitialFormSubmit = (e) => {
  e.preventDefault();
  const data = new FormData(initialForm);

  const featuresData = data.get('features');
  const objectsData = data.get('objects');

  features = featuresData.split(',').map((str) => str.trim());
  objects = objectsData.split(',').map((str) => str.trim());

  initialForm.style.display = 'none';

  createDataForm();
};

const handleDataFormSubmit = (e) => {
  e.preventDefault();
  const resultData = Array(features.length).fill([]);
  const formData = new FormData(dataForm);

  for (let i = 0; i < objects.length; i++) {
    for (let j = 0; j < features.length; j++) {
      const name = `${j},${i}`;

      const value = formData.get(name);
      const result = value === 'y' ? 1 : 0;

      resultData[j] = [...resultData[j], result];
    }
  }

  data = resultData;
  expertSystem = new ExpertSystem({ data, objects, features });
  dataForm.style.display = 'none';
  startSurvey();
};

initialForm.addEventListener('submit', handleInitialFormSubmit);
dataForm.addEventListener('submit', handleDataFormSubmit);
