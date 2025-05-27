import parse from 'html-react-parser';

export const convertToHTML = ({ content = "", class_p = "", class_ul = "", class_heading = "" }) => {
    if (typeof content === 'string') return content;
    let html = "";

    content.nodes.forEach(node => {
        if (node.type === 'PARAGRAPH') {
            if (node.nodes.length > 0) {
                html += `<p className="${class_p}">`;

                node.nodes.forEach(textNode => {
                    if (textNode.type === 'TEXT') {
                        let decorationsHTML = "";

                        if (textNode.textData.decorations) {
                            textNode.textData.decorations.forEach(decoration => {
                                if (decoration.type === 'BOLD') {
                                    decorationsHTML += '<strong>';
                                } else if (decoration.type === 'ITALIC') {
                                    decorationsHTML += '<em>';
                                }
                            });
                        }

                        html += decorationsHTML + textNode.textData.text;

                        if (decorationsHTML !== "") {
                            decorationsHTML.split('').reverse().forEach(char => {
                                if (char === '>') {
                                    html += '</' + decorationsHTML.substring(decorationsHTML.lastIndexOf('<') + 1);
                                    decorationsHTML = decorationsHTML.substring(0, decorationsHTML.lastIndexOf('<'));
                                }
                            });
                        }
                    }
                });

                html += '</p>';
            } else {
                html += '<br/>';
            }
        } else if (node.type === 'HEADING') {
            if (node.nodes.length > 0) {
                const headingLevel = node.headingData?.level || 1;
                html += `<h${headingLevel} className="${class_heading}">`;

                node.nodes.forEach(textNode => {
                    if (textNode.type === 'TEXT') {
                        let decorationsHTML = "";

                        if (textNode.textData.decorations) {
                            textNode.textData.decorations.forEach(decoration => {
                                if (decoration.type === 'BOLD') {
                                    decorationsHTML += '<strong>';
                                } else if (decoration.type === 'ITALIC') {
                                    decorationsHTML += '<em>';
                                }
                            });
                        }

                        html += decorationsHTML + textNode.textData.text;

                        if (decorationsHTML !== "") {
                            decorationsHTML.split('').reverse().forEach(char => {
                                if (char === '>') {
                                    html += '</' + decorationsHTML.substring(decorationsHTML.lastIndexOf('<') + 1);
                                    decorationsHTML = decorationsHTML.substring(0, decorationsHTML.lastIndexOf('<'));
                                }
                            });
                        }
                    }
                });

                html += `</h${headingLevel}>`;
            }
        } else if (node.type === 'BULLETED_LIST') {
            html += `<ul className="${class_ul}" >`;

            node.nodes.forEach(listItem => {
                html += '<li>';

                listItem.nodes.forEach(paragraph => {
                    paragraph.nodes.forEach(textNode => {
                        if (textNode.type === 'TEXT') {
                            let decorationsHTML = "";

                            if (textNode.textData.decorations) {
                                textNode.textData.decorations.forEach(decoration => {
                                    if (decoration.type === 'BOLD') {
                                        decorationsHTML += '<strong>';
                                    } else if (decoration.type === 'ITALIC') {
                                        decorationsHTML += '<em>';
                                    }
                                });
                            }

                            html += decorationsHTML + textNode.textData.text;

                            if (decorationsHTML !== "") {
                                decorationsHTML.split('').reverse().forEach(char => {
                                    if (char === '>') {
                                        html += '</' + decorationsHTML.substring(decorationsHTML.lastIndexOf('<') + 1);
                                        decorationsHTML = decorationsHTML.substring(0, decorationsHTML.lastIndexOf('<'));
                                    }
                                });
                            }
                        }
                    });
                });

                html += '</li>';
            });

            html += '</ul>';
        }
    });

    return parse(html);
}