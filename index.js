const { promises: fs } = require('fs');
const readme = require('./readme');
const quotes = require('./quotes');

const msInOneDay = 1000 * 60 * 60 * 24;

const today = new Date();

function generateNewREADME() {
  const readmeRow = readme.split('\n');

  function updateIdentifier(identifier, replaceText) {
    const identifierIndex = findIdentifierIndex(readmeRow, identifier);
    if (!readmeRow[identifierIndex]) return;
    readmeRow[identifierIndex] = readmeRow[identifierIndex].replace(
      `<#${identifier}>`,
      replaceText
    );
  }

  const identifierToUpdate = {
    variable_duree: getCodingDuration(),
    variable_age: getCurrentAge(),
    mood: getMood(),
    today_date: getTodayDate(),
    random_quote: getRandomQuote(),
  };

  Object.entries(identifierToUpdate).forEach(([key, value]) => {
    updateIdentifier(key, value);
  });

  return readmeRow.join('\n');
}

function getCodingDuration() {
  const startCodingDate = new Date('2022-01-01');
  const diffInMs = today - startCodingDate;
  const diffInDays = Math.floor(diffInMs / msInOneDay);
  return `${diffInDays} jours`;
}

function getCurrentAge() {
  const birthDate = new Date('1993-07-20');
  const ageInMs = today - birthDate;
  const ageDate = new Date(ageInMs);
  return `${Math.abs(ageDate.getUTCFullYear() - 1970)} ans`;
}

function getMood() {
  return "joviaaaaale";
}

function getTodayDate() {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return today.toLocaleDateString('fr-FR', options);
}

function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

const findIdentifierIndex = (rows, identifier) =>
  rows.findIndex((r) => Boolean(r.match(new RegExp(`<#${identifier}>`, 'i'))));

const updateREADMEFile = (text) => fs.writeFile('./README.md', text);

async function main() {
  const newREADME = generateNewREADME();
  await updateREADMEFile(newREADME);
  console.log('✅ README.md mis à jour avec succès !');
}

main().catch(err => {
  console.error('❌ Erreur:', err);
  process.exit(1);
});
