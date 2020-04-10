import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {widgetsAPI} from "../capi";
import {widgetConfig, widgetNames} from "../config/widgets";
import {Dropdown, DropdownButton, Row, Col, Container, Button, ButtonGroup} from "react-bootstrap";

import {writeStateToURL} from "../config/urlParameters";

export default ({id, scale}) => {
    const {doneEditing, deleteWidget, setLayoutMode} = widgetsAPI({id: id});
        return (
            <div>
                <SelectType id={id} scale={scale}/>
            </div>
    )
};
const SelectType = ({id, scale}) => {
    const {widget, setWidgetData} = widgetsAPI({id: id});
    return (
        <Dropdown size="lg">
            <Dropdown.Toggle
                style={{border: 0, backgroundColor: "#e8e8e8", color: "#202020", fontSize: 12 * scale, padding: 4}}

            >
                {widgetConfig[widget.type].name}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {widgetNames.map(w =>
                    <Dropdown.Item
                        onSelect={() => {setWidgetData({type:w})}}
                        key={w}
                        active={w == widget.type}
                        eventKey={w} >{widgetConfig[w].name}
                    </Dropdown.Item>)}
            </Dropdown.Menu>
        </Dropdown>
    )
}
