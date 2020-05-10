'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield figma.loadFontAsync({ family: "Roboto", style: "Regular" });
    });
}
main().then(() => {
    let entirePage = figma.currentPage;
    let pageFrames = figma.currentPage.children;
    let nodes = figma.currentPage.selection;
    let selectedLayers = nodes;
    function errorMsg() {
        figma.closePlugin('⚠️ Please select a frame to comment on ⚠️');
    }
    function setStorage(storageName, storageValue) {
        figma.clientStorage.setAsync(storageName, JSON.stringify(storageValue)).catch(err => { console.log('error setting data'); });
    }
    function getSavedCommentator() {
        return new Promise((success, error) => {
            figma.clientStorage.getAsync('commentator').then(commentator => {
                let data = (commentator) ? JSON.parse(commentator) : [];
                success(data);
                figma.ui.postMessage({
                    'commentator': data
                });
                // console.log("commentator: " + data)
            }).catch(err => {
                error(err);
            });
        });
    }
    function getSavedColor() {
        return new Promise((success, error) => {
            figma.clientStorage.getAsync('color').then(color => {
                let data = (color) ? JSON.parse(color) : [];
                success(data);
                figma.ui.postMessage({
                    'color': data
                });
                // console.log("color: " + data)
            }).catch(err => {
                error(err);
            });
        });
    }
    function getSavedName() {
        return new Promise((success, error) => {
            figma.clientStorage.getAsync('name').then(name => {
                let data = (name) ? JSON.parse(name) : [];
                success(data);
                figma.ui.postMessage({
                    'name': data
                });
                // console.log("name: " + data)
            }).catch(err => {
                error(err);
            });
        });
    }
    // if chat exists, append newly create chat bubble to it
    function appendToExisting(newchild, uiMessageHolder, uiBubble, uiName, uiText) {
        newchild.appendChild(uiMessageHolder);
        uiMessageHolder.appendChild(uiBubble);
        uiMessageHolder.appendChild(uiName);
        uiBubble.appendChild(uiText);
        let updateUiText = uiText;
        let updateUiBubble = uiBubble;
        let uiTextHeight = uiText.height;
        // console.log(uiTextHeight)
        if (updateUiText.width > 315) {
            updateUiBubble.layoutAlign = 'STRETCH';
            updateUiBubble.layoutMode = 'VERTICAL';
            updateUiBubble.horizontalPadding = 16;
            updateUiBubble.verticalPadding = 16;
            updateUiText.textAutoResize = "NONE";
            updateUiText.resize(315, updateUiText.height);
            updateUiText.textAutoResize = "HEIGHT";
        }
    }
    // if chat doesnt exist, create it
    function appendToNew(uiFrame, uiAutoLayout, uiMessageHolder, uiBubble, uiName, uiText, uiTitle, uiVote, uiFooter) {
        entirePage.appendChild(uiFrame);
        uiFrame.appendChild(uiTitle);
        uiFrame.appendChild(uiAutoLayout);
        uiFrame.appendChild(uiVote);
        uiFrame.appendChild(uiFooter);
        uiAutoLayout.appendChild(uiMessageHolder);
        uiMessageHolder.appendChild(uiBubble);
        uiMessageHolder.appendChild(uiName);
        uiBubble.appendChild(uiText);
        let updateUiText = uiText;
        let updateUiBubble = uiBubble;
        if (updateUiText.width > 315) {
            updateUiBubble.layoutAlign = 'STRETCH';
            updateUiBubble.layoutMode = 'VERTICAL';
            updateUiBubble.horizontalPadding = 16;
            updateUiBubble.verticalPadding = 16;
            updateUiText.textAutoResize = "NONE";
            updateUiText.resize(315, updateUiText.height);
            updateUiText.textAutoResize = "HEIGHT";
        }
        else {
            updateUiText.resize(updateUiText.width + 2, updateUiText.height);
        }
    }
    // create the chat bubble
    function makeBubble(newFrame, chatback, msgMesssage, uiMessageHolder, uiBubble, uiText, uiName, msgName, msgColor, newchild, msgSwitch, frameExist, frameName, frameY, frameX, msgDark) {
        const uiMessage = msgMesssage;
        let uiFrame;
        let uiAutoLayout;
        let uiTitle;
        let uiFooter;
        let uiVote;
        let mainSize = 375;
        if (newFrame === true) {
            uiFrame = figma.createFrame();
            uiAutoLayout = figma.createFrame();
            uiTitle = figma.createText();
            uiFooter = figma.createText();
            let uiWidth = mainSize;
            let uiHeight = mainSize;
            uiFrame.name = chatback;
            uiFrame.resize(uiWidth, uiHeight);
            uiFrame.layoutMode = "VERTICAL";
            uiFrame.topRightRadius = 16;
            uiFrame.topLeftRadius = 16;
            uiFrame.bottomLeftRadius = 16;
            uiFrame.bottomRightRadius = 16;
            uiFrame.setRelaunchData({ edit: "Press to launch Figchat and add your comments" });
            uiFrame.y = frameY;
            uiFrame.x = frameX;
            uiAutoLayout.layoutMode = "VERTICAL";
            uiAutoLayout.resize(uiWidth, uiHeight);
            uiAutoLayout.name = 'holder';
            uiAutoLayout.horizontalPadding = 16;
            uiAutoLayout.verticalPadding = 16;
            uiAutoLayout.itemSpacing = 10;
            uiAutoLayout.fills = [];
            uiTitle.name = 'Title';
            uiTitle.characters = "Chat for # " + frameName;
            uiTitle.textAlignHorizontal = 'CENTER';
            uiTitle.textAlignVertical = 'CENTER';
            uiTitle.resize(mainSize, 100);
            uiTitle.fontSize = 16;
            uiFooter.name = 'Footer';
            uiFooter.characters = "Chat by selecting this frame and running Figchat";
            uiFooter.textAlignHorizontal = 'CENTER';
            uiFooter.textAlignVertical = 'CENTER';
            uiFooter.resize(mainSize, 100);
            uiFooter.fontSize = 11;
            uiFooter.fills = [{ type: 'SOLID', color: { r: 85 / 255, g: 101 / 255, b: 117 / 255 } }];
            if (msgDark === true) {
                uiFrame.fills = [{ type: 'SOLID', color: { r: 29 / 255, g: 43 / 255, b: 54 / 255 } }];
                uiFooter.fills = [{ type: 'SOLID', color: { r: 165 / 255, g: 178 / 255, b: 189 / 255 } }];
                uiTitle.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
            }
            // voting
            let uiPos;
            let uiNeg;
            let uiPosIcon;
            let uiNegIcon;
            let uiPosValue;
            let uiNegValue;
            uiVote = figma.createFrame();
            uiPos = figma.createFrame();
            uiNeg = figma.createFrame();
            uiPosIcon = figma.createText();
            uiNegIcon = figma.createText();
            uiPosValue = figma.createText();
            uiNegValue = figma.createText();
            uiVote.visible = false;
            uiVote.layoutMode = 'HORIZONTAL';
            uiVote.layoutAlign = 'STRETCH';
            uiVote.verticalPadding = 16;
            uiVote.itemSpacing = 10;
            uiVote.fills = [];
            uiVote.name = 'voter';
            uiVote.fills = [];
            uiPos.strokeWeight = 2;
            uiPos.strokes = [{ type: 'SOLID', color: { r: 197 / 255, g: 206 / 255, b: 214 / 255 } }];
            uiPos.topRightRadius = 50;
            uiPos.topLeftRadius = 50;
            uiPos.bottomLeftRadius = 50;
            uiPos.bottomRightRadius = 50;
            uiPos.name = 'positive';
            uiPos.layoutAlign = 'CENTER';
            uiPos.layoutMode = 'HORIZONTAL';
            uiPos.verticalPadding = 14;
            uiPos.horizontalPadding = 20;
            uiPos.itemSpacing = 6;
            uiPos.resizeWithoutConstraints(60, 52);
            uiPos.fills = [];
            uiNeg.strokes = [{ type: 'SOLID', color: { r: 197 / 255, g: 206 / 255, b: 214 / 255 } }];
            uiNeg.topRightRadius = 50;
            uiNeg.topLeftRadius = 50;
            uiNeg.bottomLeftRadius = 50;
            uiNeg.bottomRightRadius = 50;
            uiNeg.name = 'negative';
            uiNeg.layoutAlign = 'CENTER';
            uiNeg.layoutMode = 'HORIZONTAL';
            uiNeg.verticalPadding = 14;
            uiNeg.horizontalPadding = 20;
            uiNeg.itemSpacing = 6;
            uiNeg.strokeWeight = 2;
            uiNeg.resizeWithoutConstraints(60, 52);
            uiNeg.fills = [];
            uiPosIcon.characters = "👍";
            uiPosIcon.fontSize = 16;
            uiPosIcon.layoutAlign = 'CENTER';
            uiNegIcon.characters = "👎";
            uiNegIcon.fontSize = 16;
            uiNegIcon.layoutAlign = 'CENTER';
            uiPosValue.characters = "0";
            uiPosValue.fontSize = 16;
            uiPosValue.fills = [{ type: 'SOLID', color: { r: 147 / 255, g: 161 / 255, b: 176 / 255 } }];
            uiPosValue.name = 'count-pos';
            uiPosValue.layoutAlign = 'CENTER';
            uiNegValue.characters = "0";
            uiNegValue.fontSize = 16;
            uiNegValue.fills = [{ type: 'SOLID', color: { r: 147 / 255, g: 161 / 255, b: 176 / 255 } }];
            uiNegValue.name = 'count-neg';
            uiNegValue.layoutAlign = 'CENTER';
            uiNeg.appendChild(uiNegIcon);
            uiNeg.appendChild(uiNegValue);
            uiPos.appendChild(uiPosIcon);
            uiPos.appendChild(uiPosValue);
            uiVote.appendChild(uiPos);
            uiVote.appendChild(uiNeg);
        }
        uiMessageHolder = figma.createFrame();
        uiBubble = figma.createFrame();
        uiText = figma.createText();
        uiName = figma.createText();
        uiMessageHolder.layoutMode = 'VERTICAL';
        uiMessageHolder.layoutAlign = 'STRETCH';
        uiMessageHolder.name = 'line item';
        uiMessageHolder.itemSpacing = 4;
        uiMessageHolder.fills = [];
        uiBubble.topRightRadius = 24;
        uiBubble.topLeftRadius = 24;
        uiBubble.bottomLeftRadius = 24;
        uiBubble.bottomRightRadius = 10;
        uiBubble.name = 'bubble';
        uiBubble.layoutAlign = 'MAX';
        uiText.characters = uiMessage;
        uiText.x = 16;
        uiText.y = 16;
        uiText.fontSize = 13;
        uiText.lineHeight = { unit: 'PIXELS', value: 18 };
        uiText.name = 'Text';
        uiText.constraints = { horizontal: "STRETCH", vertical: "STRETCH" };
        uiText.resize(uiText.width + 2, uiText.height);
        uiText.textAutoResize = "HEIGHT";
        uiName.characters = msgName;
        uiName.fills = [{ type: 'SOLID', color: { r: 147 / 255, g: 161 / 255, b: 176 / 255 } }];
        uiName.layoutAlign = 'MAX';
        let uiMessageHeight = uiText.height + 32;
        let uiMessageWidth = uiText.width + 32;
        uiBubble.resize(uiMessageWidth, uiMessageHeight);
        if (msgSwitch === false) {
            if (msgColor === "blue") {
                uiBubble.fills = [{ type: 'SOLID', color: { r: 18 / 255, g: 146 / 255, b: 238 / 255 } }];
                uiText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
            }
            if (msgColor === "yellow") {
                uiBubble.fills = [{ type: 'SOLID', color: { r: 255 / 255, g: 197 / 255, b: 85 / 255 } }];
                uiText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
            }
            if (msgColor === "orange") {
                uiBubble.fills = [{ type: 'SOLID', color: { r: 255 / 255, g: 145 / 255, b: 57 / 255 } }];
                uiText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
            }
            if (msgColor === "red") {
                uiBubble.fills = [{ type: 'SOLID', color: { r: 242 / 255, g: 52 / 255, b: 89 / 255 } }];
                uiText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
            }
            if (msgColor === "indigo") {
                uiBubble.fills = [{ type: 'SOLID', color: { r: 59 / 255, g: 100 / 255, b: 210 / 255 } }];
                uiText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
            }
            if (msgColor === "green") {
                uiBubble.fills = [{ type: 'SOLID', color: { r: 57 / 255, g: 172 / 255, b: 110 / 255 } }];
                uiText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
            }
            if (msgColor === "purple") {
                uiBubble.fills = [{ type: 'SOLID', color: { r: 98 / 255, g: 105 / 255, b: 197 / 255 } }];
                uiText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
            }
            if (msgColor === "lavender") {
                uiBubble.fills = [{ type: 'SOLID', color: { r: 217 / 255, g: 220 / 255, b: 253 / 255 } }];
                uiText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
            }
            if (msgColor === "whaletail") {
                uiBubble.fills = [{ type: 'SOLID', color: { r: 114 / 255, g: 150 / 255, b: 225 / 255 } }];
                uiText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
            }
            if (msgColor === "lime") {
                uiBubble.fills = [{ type: 'SOLID', color: { r: 194 / 255, g: 240 / 255, b: 215 / 255 } }];
                uiText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
            }
        }
        if (msgSwitch === true) {
            uiBubble.fills = [{ type: 'SOLID', color: { r: 41 / 255, g: 67 / 255, b: 81 / 255 } }];
            uiText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
            uiBubble.topRightRadius = 24;
            uiBubble.topLeftRadius = 24;
            uiBubble.bottomLeftRadius = 10;
            uiBubble.bottomRightRadius = 24;
            uiBubble.layoutAlign = 'MIN';
            uiName.layoutAlign = 'MIN';
            uiName.characters = msgName + " 👑";
        }
        if (frameExist === true) {
            appendToExisting(newchild, uiMessageHolder, uiBubble, uiName, uiText);
        }
        if (frameExist === false) {
            appendToNew(uiFrame, uiAutoLayout, uiMessageHolder, uiBubble, uiName, uiText, uiTitle, uiVote, uiFooter);
        }
        figma.notify("chat added!");
    }
    if (selectedLayers.length === 0) {
        errorMsg();
    }
    else {
        figma.showUI(__html__, { width: 380, height: 255 });
        getSavedCommentator();
        getSavedColor();
        getSavedName();
        let frameName;
        let frameX = 0;
        let frameY = 0;
        let frameWidth;
        let arrayTextFoundString = 0;
        selectedLayers.forEach(node => {
            if (node.type === 'FRAME') {
                frameX = node.x;
                frameY = node.y;
                frameWidth = node.width;
                frameName = node.name;
                figma.ui.postMessage({
                    'getfile': frameName
                });
            }
            let arrayName = [];
            let arrayNameText = "figchat__";
            if (node.type === 'FRAME') {
                arrayName.push(node.name);
                JSON.stringify(arrayName);
                let joined = arrayName.join();
                if (joined.indexOf(arrayNameText) !== -1) {
                    arrayTextFoundString = 1;
                    figma.ui.postMessage({
                        'newframe': false
                    });
                }
            }
        });
        let newFrameX = frameX + frameWidth + 50;
        let chatback = "figchat__" + frameName;
        let make;
        pageFrames.forEach(child => {
            if (child.name === chatback) {
                make = 'found';
                figma.ui.postMessage({
                    'newframe': false
                });
            }
        });
        figma.ui.onmessage = msg => {
            if (msg.type === 'add-vote') {
                console.log(msg.name + ": voted " + msg.vote);
            }
            if (msg.type === 'add-message') {
                if (make === 'found') {
                    pageFrames.forEach(child => {
                        if (child.type === 'FRAME' && child.name === chatback) {
                            child.children.forEach(newchild => {
                                if (newchild.type === 'FRAME' && newchild.name === 'holder') {
                                    let uiMessageHolder;
                                    let uiBubble;
                                    let uiText;
                                    let uiName;
                                    makeBubble(false, chatback, msg.message, uiMessageHolder, uiBubble, uiText, uiName, msg.name, msg.color, newchild, msg.switch, true, frameName, frameY, newFrameX, msg.dark);
                                }
                            });
                        }
                    });
                }
                if (arrayTextFoundString >= 1) {
                    selectedLayers.forEach(child => {
                        if (child.type === 'FRAME') {
                            child.children.forEach(newchild => {
                                // find th holder frame for chats
                                if (newchild.type === 'FRAME' && newchild.name === 'holder') {
                                    let uiMessageHolder;
                                    let uiBubble;
                                    let uiText;
                                    let uiName;
                                    makeBubble(false, chatback, msg.message, uiMessageHolder, uiBubble, uiText, uiName, msg.name, msg.color, newchild, msg.switch, true, frameName, frameY, newFrameX, msg.dark);
                                }
                                // find a holder frame for votes
                                if (newchild.type === 'FRAME' && newchild.name === 'voter') {
                                    newchild.children.forEach(element => {
                                        if (element.name !== msg.name) ;
                                    });
                                }
                            });
                        }
                    });
                }
                if (make === undefined && arrayTextFoundString === 0) {
                    let uiMessageHolder;
                    let uiBubble;
                    let uiText;
                    let uiName;
                    let newchild;
                    makeBubble(true, chatback, msg.message, uiMessageHolder, uiBubble, uiText, uiName, msg.name, msg.color, newchild, msg.switch, false, frameName, frameY, newFrameX, msg.dark);
                    figma.closePlugin();
                }
                setStorage('color', msg.color);
                setStorage('name', msg.name);
                setStorage('commentator', msg.switch);
            }
        };
    }
});
