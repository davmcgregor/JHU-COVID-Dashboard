import {getDashboardFromURL} from "./urlParameters";
import {adjustName} from "../capi/dashboard";

export function getInitialState(initialState) {
    const stateJSON = window.localStorage.getItem("state");
    let state = initialState;
    if ((new URLSearchParams(document.location.search).get("init")) === 'all') {
        console.log("state cleared by init paramater");
        window.localStorage.setItem("state", JSON.stringify(initialState));

    } else if (!stateJSON) {
        console.log("no state found in local storage")
    } else {
        console.log("state found in local storage");
        console.log("restored state = " + stateJSON);
        state = JSON.parse(stateJSON);
    }
    if ((new URLSearchParams(document.location.search).get("init")) === 'location')
        state.locationStatus = "init";

    updateStockDashboards(state, initialState);

    const newDashboard = getDashboardFromURL();
    if (newDashboard) {
        const sameNameIx = state.dashboards.findIndex(d => d.name === newDashboard.name);
        if (typeof sameNameIx === "number" && JSON.stringify(state.dashboards[sameNameIx]) === JSON.stringify(newDashboard)) {
            state.currentDashboardIx = sameNameIx;
            console.log(`identical dashboard found ${state.currentDashboardIx} ${newDashboard.name}`);
        } else {
            let name = newDashboard.name;
            while (state.dashboards.find(d => d.name === name)) {
                name = adjustName(name);
            }
            state.currentDashboardIx = state.dashboards.length;
            newDashboard.name = name;
            state.dashboards.push(newDashboard);
            console.log(`Added dashboard ${state.currentDashboardIx} ${newDashboard.name}`);
        }
        save(state);
    }
    state.editMode = "none";
    return state;
}
function updateStockDashboards(state, initialState) {
    initialState.dashboards
        .filter(d => d.dashboardType === "stock")
        .map( initialDashboard => {
            let existingIx = state.dashboards.findIndex(d => d.name = initialDashboard.name);
            const existingDashboard = state.dashboards[existingIx];
            if (existingDashboard && existingDashboard.dashboardType !== 'stock'){
                existingDashboard.name += " 1";
                existingIx = -1
            }
            if (existingIx >= 0)
                state.dashboards[existingIx] = initialDashboard;
            else
                state.dashboards.push(initialDashboard);
        })
        state.currentDashboardIx = state.dashboards.findIndex(d => d.name === state.currentDashboardName);
        if (state.currentDashboardIx < 0)
            state.currentDashboardIx = 0;
        state.currentDashboardName = state.dashboards[state.currentDashboardIx];
}
export function save (state) {
    window.localStorage.setItem("state", JSON.stringify(state));
}
