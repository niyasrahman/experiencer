﻿import Section, { SectionHeaderPosition, BasicSectionProps } from "../Section";
import { assignIds } from "../Helpers";
import Header, { BasicHeaderProps } from "../Header";
import Entry, { BasicEntryProps } from "../Entry";
import RichText from "../Paragraph";
import { BasicResumeNode } from "../utility/NodeTree";
import Column from "../Column";
import Row, { BasicRowProps } from "../Row";
import { randyMarshCss, randyMarsh } from "./RandyMarsh";
import getDefaultCss from "./CssTemplates";

export default class ResumeTemplateProvider {
    static defaultCss = `#resume * {
    /* Set all margins to zero, and then re-set them later */
    margin: 0;
}

/** Sections with Header on Left **/
section.header-left h2 {
    width: 20%;
    flex-shrink: 0;
    flex-grow: 0;
}`;

    static get header() {
        return {
            type: Header.name,
            value: 'Your Name Here',
            children: [
                {
                    type: RichText.name,
                    value: '<p>Email: spamMePlz@spicymail.com</p><p>Phone: 123-456-7890</p>'
                }
            ]
        };
    }

    static get objective() {
        return {
            type: Section.name,
            title: 'Objective',
            children: [
                {
                    type: RichText.name,
                    value: 'To conquer the world.'
                }
            ]
        } as BasicSectionProps;
    }

    static get experience() {
        return {
            type: Section.name,
            title: 'Experience',
            children: [
                {
                    type: Entry.name,
                    title: ['Another Company', '2019 -- Present'],
                    subtitle: ['Senior Software Engineer', 'Sometown, USA'],
                    children: [
                        this.makeList([
                            'Increased productivity by conducting telepathic SCRUM meetings'
                        ])
                    ]
                } as BasicEntryProps,
                {
                    type: Entry.name,
                    title: [ 'Some Company', '2014 -- 2016'],
                    subtitle: ['Software Engineer', 'Big City, USA'],
                    children: [
                        this.makeList([
                            'Did things with code while looking at a computer monitor'
                        ])
                    ]
                } as BasicEntryProps
            ]
        } as BasicSectionProps
    };

    static get techSkills() {
        return {
            type: Section.name,
            title: 'Technical Skills',
            children: [
                this.makeList([ 'C++', 'Web Development', 'Agile/SCRUM' ])
            ]
        } as BasicSectionProps
    };

    static get education() {
        return {
            type: Section.name,
            title: 'Education',
            children: [
                {
                    type: Entry.name,
                    title: ['Some College', '2010 -- 2014'],
                    subtitle: ['BS in Some Major']
                } as BasicEntryProps
            ]
        } as BasicSectionProps;
    }

    /**
     * Construct a bulleted list
     * @param items A list of items
     */
    static makeList(items: Array<string>): BasicResumeNode {
        let value = "";
        items.forEach((i) => {
            value += `<li>${i}</li>`
        });

        return {
            type: RichText.name,
            value: `<ul>${value}</ul>`
        };
    }

    static templates = {
        "Traditional 1": () => {
            let header = ResumeTemplateProvider.header;
            header.children[0]['disableLineBreaks'] = true;

            let data = {
                builtinCss: getDefaultCss(),
                children: assignIds([
                    header,
                    ResumeTemplateProvider.objective,
                    ResumeTemplateProvider.experience,
                    ResumeTemplateProvider.techSkills,
                    ResumeTemplateProvider.education
                ]),
                css: ResumeTemplateProvider.defaultCss,
                sectionTitlePosition: "top" as SectionHeaderPosition
            };

            for (let k in data.children) {
                const node = data.children[k];
                if (node['type'] === 'Section') {
                    node['headerPosition'] = 'top';
                }
            }

            return data;
        },

        "Traditional 2": () => {
            let header = ResumeTemplateProvider.header;
            header.children[0]['disableLineBreaks'] = true;

            let data = {
                builtinCss: getDefaultCss(),
                children: assignIds([
                    header,
                    ResumeTemplateProvider.objective,
                    ResumeTemplateProvider.experience,
                    ResumeTemplateProvider.techSkills,
                    ResumeTemplateProvider.education
                ]),
                css: ResumeTemplateProvider.defaultCss,
                sectionTitlePosition: "left" as SectionHeaderPosition
            };

            data.children.forEach((node) => {
                if (node['type'] === 'Section') {
                    node['headerPosition'] = 'left';
            }});
            
            return data;
        },

        "Multi-Column 1": () => {
            let header = ResumeTemplateProvider.header;
            header['orientation'] = 'row';

            let data = {
                builtinCss: getDefaultCss(),
                children: assignIds([
                    header,
                    ResumeTemplateProvider.objective,
                    {
                        type: Row.name,
                        children: [
                            {
                                type: Column.name,
                                children: [
                                    ResumeTemplateProvider.education,
                                    ResumeTemplateProvider.techSkills
                                ]
                            },
                            {
                                type: Column.name,
                                children: [
                                    ResumeTemplateProvider.experience
                                ]
                            }
                        ]
                    }
                ]),
                css: ResumeTemplateProvider.defaultCss,
            };

            return data;
        },

        "Randy Marsh": () => {
            let data = {
                builtinCss: randyMarshCss(),
                children: assignIds([ randyMarsh() ]),
                css: "#resume * {\n    /* Set all margins to zero, and then re-set them later */\n    margin: 0;\n}\n\n#resume #awards {\n    flex-grow: 0;\n    height: auto;\n}\n\n#resume #awards .column {\n    width: auto;\n    flex-grow: 1;\n    flex-shrink: 1;\n    padding: 0\n}\n\n#resume #awards .column-last {\n    background: none;\n}\n\n#resume .column-last, #resume .column-last h2 {\n    color: #43353f;\n}\n\n#resume #tegridy {\n    margin-top: auto;\n    text-align: right;\n}\n\n/** Sections with Header on Left **/\nsection.header-left h2 {\n    width: 20%;\n    flex-shrink: 0;\n    flex-grow: 0;\n    \n}"
            };

            return data;
        }
    }
}