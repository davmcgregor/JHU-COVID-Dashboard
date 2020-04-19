import populationByCountry from "./population";
import bent from 'bent';
import {widgetsAPI} from "../capi";
import {manageLocation} from "../config/locationData";
export let dataSet = {
    countries: ["My Country", "My State", "My County"],
    justCountries: ["My Country"],
    justCounties: [ "My County"],
    justStates: ["My State"],
}
let importState = 'none';
export const importJHUData = async (api) => {
    let file;

    switch (importState) {

        case "none":
            try {
                importState = "loading";
                file = await readJSFile("jhu");
            } catch (e) {
                console.log("error loading data" + e + e.stack);
                importState = "error";
                return importState
            };
            importState = processJHUFile(file);
            await manageLocation(api);
            return importState

        default:
            return importState;
    }

}

async function readJSFile(filePrefix) {
    const location = window.location;
    let url;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        url = location.protocol + location.host + "/" + filePrefix + "_test.js";
    } else {
        //url = process.env.PUBLIC_URL + "/" + filePrefix + ".csv";
        url = location.protocol + location.host + "/" + filePrefix + ".js";
    }
    console.log(url);
    const getBuffer = bent('string');
    return await getBuffer(url);
    //console.log(csvFiles[filePrefix]);
}

function processJHUFile(file) {
    const json = JSON.parse(file.substr(file.indexOf("{")));
    dataSet.country = json.data;
    dataSet.dates = json.dates;
    dataSet.dateRange = {
        first: dataSet.dates[0],
        last: dataSet.dates[dataSet.dates.length - 1]
    }
    processJHUCountries(dataSet);
    Object.getOwnPropertyNames(dataSet.country)
        .map(c => dataSet.countries.push(c));
    Object.getOwnPropertyNames(dataSet.country)
        .filter(c => c === "My Country" || dataSet.country[c].type === 'country')
        .map(c => dataSet.justCountries.push(c));
    Object.getOwnPropertyNames(dataSet.country)
        .filter(c=>c === "My County" || dataSet.country[c].type === 'county')
        .map(c => dataSet.justCounties.push(c));
    Object.getOwnPropertyNames(dataSet.country)
        .filter(c=>c === "My State" || dataSet.country[c].type === 'state' || dataSet.country[c].type === 'province')
        .map(c => dataSet.justStates.push(c));
    console.log(`${dataSet.justCountries.length} countries`);
    console.log(`${dataSet.justStates.length} states`);
    console.log(`${dataSet.justCounties.length} counties`);
    let status = "loaded";
    return status;
}
function processJHUCountries (dataSet) {
    dataSet.country["The Whole World"] = dataSet.country["Total"];
    delete dataSet.country["Total"];
    for (let countryName in  dataSet.country) {

        const country = dataSet.country[countryName];

        const cases = country.cases[country.cases.length - 1];
        const deaths = country.deaths[country.deaths.length - 1];

        const casePerPopulationSeries = country.cases.map( c => c * 1000000 / country.population);
        const deathPerPopulationSeries = country.deaths.map( c => c * 1000000 / country.population);

        const newCaseSeries = country.cases.map((c, ix) => ix === 0 ? 0 : c - country.cases[ix -1]);
        const newDeathSeries = country.deaths.map((c, ix) => ix === 0 ? 0 : c - country.deaths[ix -1]);

        const newCasePerPopulationSeries = newCaseSeries.map( c => c * 1000000 / country.population);
        const newDeathPerPopulationSeries = newDeathSeries.map( c => c * 1000000 / country.population);

        dataSet.country[countryName] = {
            name: countryName,
            type: country.type,
            deaths: deaths,
            deathsPerM: deaths * 1000000 / country.population,
            cases: cases,
            casesPerM: cases * 1000000 / country.population,
            caseMortality: deaths / country.cases,
            casesOverTime: country.cases,
            deathsOverTime: country.deaths,
            newCasesOverTime: newCaseSeries,
            newDeathsOverTime: newDeathSeries,
            newCasesPerPopulationOverTime: newCasePerPopulationSeries,
            newDeathsPerPopulationOverTime: newDeathPerPopulationSeries,
            casesPerPopulationOverTime: casePerPopulationSeries,
            deathsPerPopulationOverTime: deathPerPopulationSeries,
        };
    };
}


