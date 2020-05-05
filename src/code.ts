async function main() {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
}

main().then(() => {

  let entirePage = figma.currentPage
  let pageFrames = figma.currentPage.children
  let nodes = figma.currentPage.selection
  let selectedLayers = nodes

  let getCommentator
  let getColor
  let getName

  function errorMsg() {
    figma.closePlugin('⚠️ Please select a frame to comment on ⚠️');
  }

  function setStorage(storageName,storageValue) {
    figma.clientStorage.setAsync(storageName, JSON.stringify(storageValue)).catch(err => { console.log('error setting data') })
  }

  function getSavedCommentator() {
    return new Promise((success, error) => {
      figma.clientStorage.getAsync('commentator').then(commentator => {
        let data = (commentator) ? JSON.parse(commentator) : [] ;
        success(data)
        getCommentator = data
        figma.ui.postMessage({
          'commentator': data
        })
        // console.log("commentator: " + data)
      }).catch(err => {
        error(err)
      })
    })
  }

  function getSavedColor() {
    return new Promise((success, error) => {
      figma.clientStorage.getAsync('color').then(color => {
        let data = (color) ? JSON.parse(color) : [] ;
        success(data)
        getColor = data
        figma.ui.postMessage({
          'color': data
        })
        // console.log("color: " + data)
      }).catch(err => {
        error(err)
      })
    })
  }

  function getSavedName() {
    return new Promise((success, error) => {
      figma.clientStorage.getAsync('name').then(name => {
        let data = (name) ? JSON.parse(name) : [] ;
        success(data)
        getName = data
        figma.ui.postMessage({
          'name': data
        })
        // console.log("name: " + data)
      }).catch(err => {
        error(err)
      })
    })
  }

  // if chat exists, append newly create chat bubble to it

  function appendToExisting(newchild,uiMessageHolder,uiBubble,uiName,uiText){

    newchild.appendChild(uiMessageHolder)
    uiMessageHolder.appendChild(uiBubble)
    uiMessageHolder.appendChild(uiName)
    uiBubble.appendChild(uiText)

    let updateUiText = uiText
    let updateUiBubble = uiBubble
    let uiTextHeight = uiText.height

    // console.log(uiTextHeight)

    if (updateUiText.width > 315){
      updateUiBubble.layoutAlign = 'STRETCH'
      updateUiBubble.layoutMode = 'VERTICAL'
      updateUiBubble.horizontalPadding = 16
      updateUiBubble.verticalPadding = 16
      updateUiText.textAutoResize = "NONE"
      updateUiText.resize(315,updateUiText.height)
      updateUiText.textAutoResize = "HEIGHT"
    }
  }

    // if chat doesnt exist, create it

  function appendToNew(uiFrame,uiAutoLayout,uiMessageHolder,uiBubble,uiName,uiText,uiTitle,uiFooter){

    entirePage.appendChild(uiFrame)
    uiFrame.appendChild(uiTitle)
    uiFrame.appendChild(uiAutoLayout)
    uiFrame.appendChild(uiFooter)
    uiAutoLayout.appendChild(uiMessageHolder)
    uiMessageHolder.appendChild(uiBubble)
    uiMessageHolder.appendChild(uiName)
    uiBubble.appendChild(uiText)

    let updateUiText = uiText
    let updateUiBubble = uiBubble

    if (updateUiText.width > 315){
      updateUiBubble.layoutAlign = 'STRETCH'
      updateUiBubble.layoutMode = 'VERTICAL'
      updateUiBubble.horizontalPadding = 16
      updateUiBubble.verticalPadding = 16
      updateUiText.textAutoResize = "NONE"
      updateUiText.resize(315,updateUiText.height)
      updateUiText.textAutoResize = "HEIGHT"
    } else {
      updateUiText.resize(updateUiText.width + 2,updateUiText.height)
    }
  }

  // create the chat bubble

  function makeBubble(newFrame,chatback,msgMesssage,uiMessageHolder,
    uiBubble,uiText,uiName,msgName,msgColor,newchild,
    msgSwitch,frameExist,frameName,frameY,frameX,msgDark){
    
    const uiMessage = msgMesssage
    let uiFrame
    let uiAutoLayout
    let uiTitle
    let uiFooter
    let mainSize = 375

    if(newFrame === true) {
      uiFrame = figma.createFrame()
      uiAutoLayout = figma.createFrame()
      uiTitle = figma.createText()
      uiFooter = figma.createText()

      let uiWidth = mainSize
      let uiHeight = mainSize 
      uiFrame.name = chatback
      uiFrame.resize(uiWidth,uiHeight)
      uiFrame.layoutMode = "VERTICAL"
      uiFrame.topRightRadius = 16
      uiFrame.topLeftRadius = 16
      uiFrame.bottomLeftRadius = 16
      uiFrame.bottomRightRadius = 16

      uiFrame.setRelaunchData({edit: "Press to launch Figchat and add your comments"})

      uiFrame.y = frameY
      uiFrame.x = frameX

      uiAutoLayout.layoutMode = "VERTICAL"
      uiAutoLayout.resize(uiWidth, uiHeight)
      uiAutoLayout.name = 'holder'
      uiAutoLayout.horizontalPadding = 16
      uiAutoLayout.verticalPadding = 16
      uiAutoLayout.itemSpacing = 10
      uiAutoLayout.fills = []

      uiTitle.name = 'Title'
      uiTitle.characters = "Chat for # " + frameName
      uiTitle.textAlignHorizontal = 'CENTER'
      uiTitle.textAlignVertical = 'CENTER'
      uiTitle.resize(mainSize,100)
      uiTitle.fontSize = 16

      uiFooter.name = 'Footer'
      uiFooter.characters = "Chat by selecting this frame and running Figchat"
      uiFooter.textAlignHorizontal = 'CENTER'
      uiFooter.textAlignVertical = 'CENTER'
      uiFooter.resize(mainSize,100)
      uiFooter.fontSize = 11
      uiFooter.fills = [{type: 'SOLID', color: {r: 85/255, g: 101/255, b: 117/255}}]

      if(msgDark === true) {
        uiFrame.fills = [{type: 'SOLID', color: {r: 29/255, g: 43/255, b: 54/255}}]
        uiFooter.fills = [{type: 'SOLID', color: {r: 165/255, g: 178/255, b: 189/255}}]
        uiTitle.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}]
      }

    }
    
    uiMessageHolder = figma.createFrame()
    uiBubble = figma.createFrame()
    uiText = figma.createText()
    uiName = figma.createText()

    uiMessageHolder.layoutMode = 'VERTICAL'
    uiMessageHolder.layoutAlign = 'STRETCH'
    uiMessageHolder.name = 'line item'
    uiMessageHolder.itemSpacing = 4
    uiMessageHolder.fills = []

    uiBubble.topRightRadius = 24
    uiBubble.topLeftRadius = 24
    uiBubble.bottomLeftRadius = 24
    uiBubble.bottomRightRadius = 10
    uiBubble.name = 'bubble'
    uiBubble.layoutAlign = 'MAX'

    uiText.characters = uiMessage
    uiText.x = 16
    uiText.y = 16
    uiText.fontSize = 13
    uiText.lineHeight = {unit: 'PIXELS', value: 18}
    uiText.name = 'Text'
    uiText.constraints = { horizontal: "STRETCH", vertical: "STRETCH" };
    uiText.resize(uiText.width + 2, uiText.height)
    uiText.textAutoResize = "HEIGHT"
    

    uiName.characters = msgName
    uiName.fills = [{type: 'SOLID', color: {r:  147/255, g: 161/255, b: 176/255}}]
    uiName.layoutAlign = 'MAX'

    let uiMessageHeight = uiText.height + 32
    let uiMessageWidth = uiText.width + 32

    uiBubble.resize(uiMessageWidth,uiMessageHeight)

    if(msgSwitch === false) {

      if (msgColor === "blue") {
        uiBubble.fills = [{type: 'SOLID', color: {r: 18/255, g: 146/255, b: 238/255}}]
        uiText.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}]
      }
      if (msgColor === "yellow") {
        uiBubble.fills = [{type: 'SOLID', color: {r : 255/255, g: 197/255, b: 85/255}}]
        uiText.fills = [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
      if (msgColor === "orange") {
        uiBubble.fills = [{type: 'SOLID', color: {r: 255/255, g: 145/255, b: 57/255}}]
        uiText.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}]
      }
      if (msgColor === "red") {
        uiBubble.fills = [{type: 'SOLID', color: {r: 242/255, g: 52/255, b: 89/255}}]
        uiText.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}]
      }
      if (msgColor === "indigo") {
        uiBubble.fills = [{type: 'SOLID', color: {r: 59/255, g: 100/255, b: 210/255}}]
        uiText.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}]
      }
      if (msgColor === "green") {
        uiBubble.fills = [{type: 'SOLID', color: {r: 57/255, g: 172/255, b: 110/255}}]
        uiText.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}]
      }
      if (msgColor === "purple") {
        uiBubble.fills = [{type: 'SOLID', color: {r: 98/255, g: 105/255, b: 197/255}}]
        uiText.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}]
      }
      if (msgColor === "lavender") {
        uiBubble.fills = [{type: 'SOLID', color: {r: 217/255, g: 220/255, b: 253/255}}]
        uiText.fills = [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
      if (msgColor === "whaletail") {
        uiBubble.fills = [{type: 'SOLID', color: {r: 114/255, g: 150/255, b: 225/255}}]
        uiText.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}]
      }
      if (msgColor === "lime") {
        uiBubble.fills = [{type: 'SOLID', color: {r: 194/255, g: 240/255, b: 215/255}}]
        uiText.fills = [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
      }
    }

    if(msgSwitch === true) {
      uiBubble.fills = [{type: 'SOLID', color: {r: 41/255, g: 67/255, b: 81/255}}]
      uiText.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}]
      uiBubble.topRightRadius = 24
      uiBubble.topLeftRadius = 24
      uiBubble.bottomLeftRadius = 10
      uiBubble.bottomRightRadius = 24
      uiBubble.layoutAlign = 'MIN'
      uiName.layoutAlign = 'MIN'
      uiName.characters = msgName + " 👑"
    }

    if (frameExist === true) {
      appendToExisting(newchild,uiMessageHolder,uiBubble,uiName,uiText)
    }

    if (frameExist === false) {
      appendToNew(uiFrame,uiAutoLayout,uiMessageHolder,uiBubble,uiName,uiText,uiTitle,uiFooter)
    }

    figma.notify("chat added!")
    
  }

  if (selectedLayers.length === 0) {
    errorMsg()
  } else {

    figma.showUI(__html__, {width: 380, height: 255 })

    getSavedCommentator()
    getSavedColor()
    getSavedName()
    let frameName
    let frameX = 0
    let frameY = 0
    let frameWidth
    let arrayTextFound = []
    let arrayTextFoundString = 0

    selectedLayers.forEach(node => {
      if(node.type === 'FRAME') {
        frameX = node.x
        frameY = node.y
        frameWidth = node.width
        frameName = node.name
        figma.ui.postMessage({
          'getfile': frameName
        })
      }

      let arrayName = []
      let arrayNameText = "figchat__"
      if (node.type === 'FRAME'){
        arrayName.push(node.name)
        JSON.stringify(arrayName)
        let joined = arrayName.join()
        if (joined.indexOf(arrayNameText) !== -1){
          arrayTextFound.push("ischat")
          arrayTextFoundString = 1
          
          figma.ui.postMessage({
            'newframe': false
          })
        }
      }
    })

    let newFrameX = frameX + frameWidth + 50
    let chatback = "figchat__" + frameName
    let exisitingChatback = frameName

    let make

    pageFrames.forEach(child => {
      if(child.name === chatback) {
        make = 'found'
        figma.ui.postMessage({
          'newframe': false
        })
      }
    })

    figma.ui.onmessage = msg => {

      if (msg.type === 'add-vote') {
        console.log(msg.name + ": voted " + msg.vote)
      }

      if (msg.type === 'add-message') {

        console.log(msg.dark)

        if (make === 'found') {
          
          pageFrames.forEach(child => {
            if(child.type=== 'FRAME' && child.name === chatback){
              child.children.forEach(newchild => {
                if(newchild.type === 'FRAME' && newchild.name === 'holder'){
                  let uiMessageHolder
                  let uiBubble
                  let uiText
                  let uiName
                  makeBubble(false,chatback,msg.message,uiMessageHolder,
                    uiBubble,uiText,uiName,msg.name,msg.color,newchild,
                    msg.switch,true,frameName,frameY,newFrameX,msg.dark)
                }
              })
            }
          })
        }

        // console.log(make)
        
        if (arrayTextFoundString >= 1) {

          selectedLayers.forEach(child => {
            if(child.type=== 'FRAME'){
              child.children.forEach(newchild => {
                if(newchild.type === 'FRAME' && newchild.name === 'holder'){
                  let uiMessageHolder
                  let uiBubble
                  let uiText
                  let uiName
                  makeBubble(false,chatback,msg.message,uiMessageHolder,
                    uiBubble,uiText,uiName,msg.name,msg.color,newchild,
                    msg.switch,true,frameName,frameY,newFrameX,msg.dark)
                }
              })
            }
          })
        }

        if(make === undefined && arrayTextFoundString === 0) {
          let uiMessageHolder
          let uiBubble
          let uiText
          let uiName
          let newchild
          makeBubble(true,chatback,msg.message,uiMessageHolder,uiBubble,
            uiText,uiName,msg.name,msg.color,newchild,msg.switch,false,frameName,frameY,newFrameX,msg.dark)
          figma.closePlugin();
        }

        setStorage('color', msg.color)
        setStorage('name', msg.name)
        setStorage('commentator', msg.switch)
        
      }
    }
  }
})