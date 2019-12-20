﻿import React from "react";
import { Button } from "./Buttons";
import { Action, ModifyChild, AddChild } from "../ResumeNodeBase";
import { IdType } from "../utility/HoverTracker";
import PureMenu, { PureDropdown, PureMenuItem, PureMenuLink } from "./PureMenu";
import ResumeHotKeys from "./ResumeHotkeys";
import { SelectedNodeActions } from "./SelectedNodeActions";
import { ComponentTypes, NodeInformation } from "../ResumeComponent";
import { DescriptionListItem, DescriptionList } from "../List";
import HtmlIdAdder from "./HtmlIdAdder";
import { assignIds } from "../Helpers";
import { ResumeNode } from "../utility/NodeTree";
import toolbarOptions, { CustomToolbarOptions } from "./ToolbarOptions";
import Column from "../Column";

type AddOptions = Array<NodeInformation>;

interface AddOptionProps {
    options: string | Array<string>;
    addChild: AddChild;
    id: IdType;
}

/**
 * Return the button or menu for adding children to a node
 * @param options
 */
function AddOption(props: AddOptionProps) {
    const options = props.options;
    const nodeInfo = (type: string) => ComponentTypes.defaultValue(type);

    if (Array.isArray(options)) {
        let optionsDetail: AddOptions = options.map((nodeType: string) => nodeInfo(nodeType));
        return <PureDropdown content={<Button>Insert</Button>}>
            {optionsDetail.map((opt) =>
                <PureMenuItem key={opt.text} onClick={() => props.addChild(props.id, assignIds(opt.node))}>
                    <PureMenuLink>
                        {opt.text}
                    </PureMenuLink>
                </PureMenuItem>
            )}
        </PureDropdown>
    }

    const node: NodeInformation = nodeInfo(options as string);
    return (
            <Button onClick={() => props.addChild(props.id, assignIds(node.node))}>
                Add {node.text}
            </Button>
    );
}

export interface EditingBarProps extends SelectedNodeActions {
    id: IdType;
    node: ResumeNode,
    addHtmlId: (htmlId: string) => void;
    updateNode: (key: string, value: string | string[] | boolean) => void;

    addChild: AddChild;
    toggleEdit: ModifyChild;
    moveUpEnabled: boolean;
    moveDownEnabled: boolean;
    updateSelected: (key: string, data: any) => void;
}

function ClipboardMenu(props: EditingBarProps) {
    const DropdownItem = (props: any) => <PureMenuItem onClick={props.onClick}>
        <PureMenuLink>{props.children}</PureMenuLink>
    </PureMenuItem>

    /**
     * Get the keyboard shortcut associated with key
     * @param key Resume hotkey key
     */
    const getShortcut = (key: string) : string => {
        return ResumeHotKeys.keyMap[key]['sequence'];
    }

    const copySc = getShortcut('COPY_SELECTED');
    const pasteSc = getShortcut('PASTE_SELECTED');
    const cutSc = getShortcut('CUT_SELECTED');

    return (
        <PureMenu horizontal>
            <PureDropdown content={<Button>Clipboard</Button>}>
                <DropdownItem onClick={props.cutClipboard}>Cut ({cutSc})</DropdownItem>
                <DropdownItem onClick={props.copyClipboard}>
                    Copy ({copySc})
                </DropdownItem>
                <DropdownItem onClick={props.pasteClipboard}>Paste ({pasteSc})</DropdownItem>
            </PureDropdown>
        </PureMenu>
    );
}

/**
 * Subcomponent of TopEditingBar which returns the custom editing options for a node
 * @param props
 */
export function CustomOptions(props: { options: CustomToolbarOptions }) {
    const DropdownItem = (props: any) => <PureMenuItem onClick={props.onClick}>
        <PureMenuLink>{props.children}</PureMenuLink>
    </PureMenuItem>

    return <>
        {props.options.map((item) => {
            if (item.action) {
                return <Button key={item.text} onClick={item.action}>{item.text}</Button>
            }
            else if (item.actions) {
                return <PureDropdown key={item.text} content={<Button>{item.text}</Button>}>
                    {item.actions.map((item) =>
                        <DropdownItem key={item.text} onClick={item.action}>{item.text}</DropdownItem>
                    )}
                </PureDropdown>
            }

            return <></>
        })}
    </>
}

export default function TopEditingBar(props: EditingBarProps) {
    const Item = (props: any) => <PureMenuItem onClick={props.onClick}>
        <Button disabled={props.disabled}>{props.children}</Button>
    </PureMenuItem>

    const id = props.id;
    const type = props.node.type;
    const customOptions = toolbarOptions(props.node, props.updateNode);
    let moveUpText = "Up";
    let moveDownText = "Down";
    
    // If we are selecting a child of a container type,
    // give the option of adding another child to the parent
    const childTypes = ComponentTypes.childTypes(type);
    let parentAddOption = <></>

    if (type === DescriptionListItem.name) {
        const parentId = id.slice(0, id.length - 1);
        parentAddOption = <AddOption id={parentId} addChild={
            props.addChild as AddChild
        } options={ComponentTypes.childTypes(DescriptionList.name)} />
    }

    if (type === Column.name) {
        moveUpText = "Left";
        moveDownText = "Right";
    }

    return <div id="toolbar">
        <div className="toolbar-section">
            <PureMenu horizontal>
                {parentAddOption}
                <AddOption id={id} addChild={props.addChild as AddChild} options={childTypes} />
                <Item onClick={props.delete}>Delete</Item>
                <Item onClick={() => (props.toggleEdit as ModifyChild)(id)}>Edit</Item>
            </PureMenu>
        </div>
        <div className="toolbar-section">
            <PureMenu horizontal>
                <Item onClick={() => props.moveUp()} disabled={!props.moveUpEnabled}>{moveUpText}</Item>
                <Item onClick={() => props.moveDown()} disabled={!props.moveDownEnabled}>{moveDownText}</Item>
            </PureMenu>
            <span className="label">Move</span>
        </div>
        <div className="toolbar-section">
            <PureMenu horizontal>
                <HtmlIdAdder
                    key={props.node.uuid}
                    htmlId={props.node.htmlId}
                    addHtmlId={props.addHtmlId}
                />
                <CustomOptions options={customOptions} />
            </PureMenu>
        </div>
        <div className="toolbar-section">
            <ClipboardMenu {...props} />
        </div>
    </div>
}