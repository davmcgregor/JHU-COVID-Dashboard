import React from 'react';
import {widgetsAPI} from "../capi";
import {Row, Col} from 'react-bootstrap';
import {dataSet} from "../data/timeseries";
import {dataPointsDisplay, dataPoints} from "../config/widgets";

export const DataPointsForCountry = ({id, scale}) => {
    const {widget, isConfiguring, getCountryData, widgetCountries} = widgetsAPI({id: id});

      const country = widgetCountries[0];

    return (
        <>
            {!isConfiguring &&
                <Row>
                    <Col style={{fontSize: 20 * scale, textAlign: "center"}}>
                        {country}
                    </Col>
                </Row>
            }
            <Row style={{paddingLeft: 5 * scale, paddingRight: 5 * scale}}>
                {country && widget.props.map((prop, ix) => (
                    <Col key={prop} style={{backgroundColor: "#f0f0f0", margin: 4, padding: 4}}>
                        <DataPoint
                            scale={1.4}
                            key={prop}
                            description={dataPointsDisplay[prop]}
                            data={numberWithCommas(Math.round(getCountryData(country)[prop]))}
                        />
                    </Col>
                ))}
            </Row>
        </>
    );
}
const DataPoint = ({description, data, scale}) => (
    <div >
        <div style={{fontSize: 9 * scale, textAlign: 'center', color: "#404040", textTransform: "uppercase", fontWeight: 'bold'}} >
            {description[0]}
        </div>
        <div style={{fontSize: 16 * scale, textAlign: 'center', color: "#000000"}} >
            {numberWithCommas(data)}
        </div>
        <div style={{fontSize: 8 * scale, textAlign: 'center', color: "#404040"}} >
            {description[1]}
        </div>
    </div>
)
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
