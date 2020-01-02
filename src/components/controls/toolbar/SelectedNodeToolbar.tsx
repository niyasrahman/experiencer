﻿import { EditingBarProps } from "../TopEditingBar";
import toolbarOptions from "src/components/schema/ToolbarOptions";
import ComponentTypes, { NodeInformation } from "src/components/schema/ComponentTypes";
import { DescriptionListItem } from "src/components/List";
import React from "react";
import { AddChild, IdType } from "src/components/utility/Types";
import Column from "src/components/Column";
import HtmlIdAdder from "../HtmlIdAdder";
import { assignIds } from "src/components/Helpers";
import ResumeHotKeys from "../ResumeHotkeys";
import { ToolbarSection, ToolbarItemData } from "./ToolbarMaker";

interface AddOptionProps {
    options: string | Array<string>;
    addChild: AddChild;
    id: IdType;
}

/**
 * Return the button or menu for adding children to a node
 * @param options
 */
function AddOption(data: AddOptionProps): ToolbarItemData {
    const options = data.options;
    const nodeInfo = (type: string) => ComponentTypes.defaultValue(type);

    if (Array.isArray(options)) {
        if (options.length === 0) {
            return {};
        }

        return {
            text: "Insert",
            iconMenu: true,
            items: options.map((nodeType: string) => {
                const info = nodeInfo(nodeType);
                const node: NodeInformation = nodeInfo(nodeType);

                return {
                    icon: info.icon,
                    text: info.text,
                    action: () => data.addChild(data.id, assignIds(node.node))
                } as ToolbarItemData
            })
        }
    }

    const node: NodeInformation = nodeInfo(data.options as string);
    return {
        action: () => data.addChild(data.id, assignIds(node.node)),
        text: `Add ${node.text}`
    }
}

function ClipboardMenu(data: EditingBarProps): ToolbarSection {
    /**
     * Get the keyboard shortcut associated with key
     * @param key Resume hotkey key
     */
    const getShortcut = (key: string): string => {
        return ResumeHotKeys.keyMap[key]['sequence'];
    }

    return [
        {
            text: 'Cut',
            icon: "ui-cut",
            action: data.cutClipboard,
            shortcut: getShortcut('CUT_SELECTED')
        },
        {
            text: 'Copy',
            icon: "ui-copy",
            action: data.copyClipboard,
            shortcut: getShortcut('COPY_SELECTED')
        },
        {
            text: 'Paste',
            icon: "ui-clip-board",
            action: data.pasteClipboard,
            shortcut: getShortcut('PASTE_SELECTED')
        }
    ];
}

interface EditingBarSubProps extends EditingBarProps {
    isOverflowing: boolean;
}

export default function SelectedNodeToolbar(props: EditingBarSubProps) {
    const id = props.selectedNodeId;
    if (id && props.selectedNode) {
        const type = props.selectedNode.type;
        let moveUpText = "rounded-up";
        let moveDownText = "rounded-down";

        // If we are selecting a child of a container type,
        // give the option of adding another child to the parent
        const childTypes = ComponentTypes.childTypes(type);
        let parentOptions = <></>

        const htmlId = props.selectedNode.htmlId ? `#${props.selectedNode.htmlId}` : '';

        if (type === DescriptionListItem.type) {
            const parentId = id.slice(0, id.length - 1);
            parentOptions = <></>
        }

        if (type === Column.type) {
            moveUpText = "rounded-left";
            moveDownText = "rounded-right";
        }
        
        return new Map<string, ToolbarSection>([
            [`Current Node (${props.selectedNode.type})`, [
                AddOption({
                    id: id,
                    addChild: props.addChild,
                    options: childTypes
                }),
                {
                    action: props.delete,
                    icon: 'ui-delete'
                },
                {
                    action: props.unselect,
                    text: 'Unselect'
                },
                {
                    text: "Clipboard",
                    items: ClipboardMenu(props),
                },
                ...toolbarOptions(props.selectedNode, props.updateSelected)
            ]],
            ["Move", [
                {
                    action: props.moveUp,
                    icon: moveUpText
                },
                {
                    action: props.moveDown,
                    icon: moveDownText
                }
            ]],
            [htmlId, [
                {
                    content: <HtmlIdAdder
                        key={props.selectedNode.uuid}
                        htmlId={props.selectedNode.htmlId}
                        cssClasses={props.selectedNode.classNames}
                        addHtmlId={props.addHtmlId}
                        addCssClasses={props.addCssClasses} />
                }
            ]]
        ]);
    }

    return new Map<string, ToolbarSection>();
}