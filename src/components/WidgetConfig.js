import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {scale, widgetConfig} from "../config/widgets";
import {Row, Col, Table} from 'react-bootstrap';
import {widgetsAPI} from "../capi";
import {CaretLeftFill, CaretRightFill, ChevronBarLeft, ChevronBarRight, ChevronBarDown, ChevronBarUp, CaretDownFill, CaretUpFill} from "react-bootstrap-icons";
const debug = true;

export default ({id, children}) => {
    const {widget, isConfiguringData, isConfiguringLayout,anyConfiguring} = widgetsAPI({id: id});
    const config = widgetConfig[widget.type];

    return (
        <div>
            {debug && anyConfiguring && <DebugInfo widget={widget} />}

            {isConfiguringData && config.config.map((config, ix) =>
                <WidgetConfigElement config={config} id={id} key={ix} ix={ix}/>
            )}
             {children}
            {isConfiguringLayout &&
                <WidgetConfigSize id={id}/>
            }
        </div>
    );
};

const WidgetConfigElement = ({id, config, ix}) => {
    const {widget} = widgetsAPI({id: id});
    return (
        <div style={{backgroundColor: "#f4f4f4", padding: 8, marginBottom: 4, borderRadius: 6}}>
            <config.component {...config.props} widgetConfig={widgetConfig[widget.type]} id={id} />
        </div>
    );
}

const WidgetConfigSize = ({id}) => {

    const {canContractWidgetHeight, canExpandWidgetHeight, canContractWidgetWidth, canExpandWidgetWidth,
           contractWidgetHeight, expandWidgetHeight, contractWidgetWidth, expandWidgetWidth,
             canMoveWidgetLeft, canMoveWidgetRight, moveWidgetLeft,  moveWidgetRight,
             canMoveWidgetDown, canMoveWidgetUp, moveWidgetDown, moveWidgetUp, widget} =  widgetsAPI({id: id});
    return (
    <Row style={{padding: 0, height: 16 * scale}}>
        <Col xs={2} className="d-flex justify-content-start">
            <MoveTool iconComponent={CaretLeftFill} enabled={canMoveWidgetLeft} click={moveWidgetLeft} />
            <MoveTool iconComponent={CaretUpFill} enabled={canMoveWidgetUp} click={moveWidgetUp} />
         </Col>
        <Col xs={4} className="d-flex justify-content-center">
            <MoveTool iconComponent={ChevronBarUp} enabled={canContractWidgetHeight} click={contractWidgetHeight} />
            <DataPoint description="rows" data={widget.rows} />
            <MoveTool iconComponent={ChevronBarDown} enabled={canExpandWidgetHeight} click={expandWidgetHeight} />
        </Col>
        <Col xs={4} className="d-flex justify-content-center">
             <MoveTool iconComponent={ChevronBarLeft} enabled={canContractWidgetWidth} click={contractWidgetWidth} />
            <DataPoint description="cols" data={widget.cols} />
            <MoveTool iconComponent={ChevronBarRight} enabled={canExpandWidgetWidth} click={expandWidgetWidth} />
        </Col>
        <Col xs={2} className="d-flex justify-content-end">
            <MoveTool iconComponent={CaretDownFill} enabled={canMoveWidgetDown} click={moveWidgetDown} />
            <MoveTool iconComponent={CaretRightFill} enabled={canMoveWidgetRight} click={moveWidgetRight} />

        </Col>
    </Row>
    )
}

const MoveTool = ({enabled, iconComponent, click}) => {
    const component = {iconComponent};
    return (
        <span>
            <component.iconComponent color={enabled ? "#000000" : "#e0e0e0"} onClick={() => enabled && click()} size={16 * scale} />
        </span>
    )
}
const DataPoint = ({description, data}) => (
    <div style={{marginLeft: 4, marginRight: 4, paddingTop: 5}}>
        <div style={{fontSize: 7 * scale, textAlign: 'center', color: "#000000", lineHeight: 0.8}} >
            {data}
        </div>
        <div style={{fontSize: 7 * scale, textAlign: 'center', color: "#404040"}} >
            {description}
        </div>
    </div>
)
const DebugInfo = ({widget}) => (
    <Row style={{padding: 4, fontSize: 12}}>
        <Col>id: {widget.id}</Col>
        <Col>row: {widget.row}</Col>
        <Col>col: {widget.col}</Col>
        <Col>rows: {widget.rows}</Col>
        <Col>cols: {widget.cols}</Col>
    </Row>
);
