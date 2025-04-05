let prompt = "geography";
let sublinks = [];

// Wikipedia stuff
async function getPageHtml(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    return html;
  } catch (error) {
    console.error("Error fetching the HTML:", error);
    return null;
  }
}

function extractSublinks(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Select all anchor tags that link to internal Wikipedia sections
  const links = doc.querySelectorAll('a[rel="mw:WikiLink"]'); // Only internal links (anchor links)

  const sublinks = [];
  links.forEach((link) => {
    // Extract the title/anchor text
    const title = link.textContent.trim();
    if (title) {
      sublinks.push(title);
    }
  });

  // Return sublinks from 5 to 10 (index 5 is the 6th item)

  return sublinks.slice(5, 8);
}

// AI Stuff
let AISummary = "";
let AIQuestions = "";

// AI Summary Prompt
async function getAISummary() {
  let summaryData = {
    model: "llama3.2",
    prompt: `Summarize ${prompt}. Make it short (~300 words)`,
    stream: true,
  };

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(summaryData),
    });

    const reader = response.body.getReader();
    // no fucking clue what this does
    const decoder = new TextDecoder("utf-8");

    AISummary = ""; // Reset the response

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter(Boolean);

      for (let line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.response) {
            AISummary += json.response; // Append to our response variable
          }
        } catch (err) {
          console.error("JSON parse error:", err, "Line:", line);
        }
      }
    }
  } catch (error) {
    AISummary = "Error fetching response: " + error.message;
  }
}

// AI Questions Prompt
async function getAIQuestions() {
  let questionsData = {
    model: "llama3.2",
    prompt: `Generate 10 questions about ${prompt}. Make them short. Don't provide the answer`,
    stream: true,
  };

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questionsData),
    });

    const reader = response.body.getReader();
    // no fucking clue what this does
    const decoder = new TextDecoder("utf-8");

    AIQuestions = ""; // Reset the response

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter(Boolean);

      for (let line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.response) {
            AIQuestions += json.response; // Append to our response variable
          }
        } catch (err) {
          console.error("JSON parse error:", err, "Line:", line);
        }
      }
    }
  } catch (error) {
    AIQuestions = "Error fetching response: " + error.message;
  }
}

new p5();

let regularFont;
let headingFont;
let titleFont;
let width;
let height;
let skillInfo;
let picIcon;

function preload(){
  regularFont = loadFont('fonts/Raleway-Medium.ttf');
  headingFont = loadFont('fonts/Raleway-Regular.ttf');
  titleFont = loadFont('fonts/Raleway-SemiBold.ttf');
  skillInfo = loadJSON('skill_info.json');
  picIcon = loadImage('picicon.png');
}

class SkillNode {
  constructor(x, y, name) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.r = 50;
    this.locked = true;
  }

  drawNode() {
    push();
    if (this.locked) {
      fill('#808080');
    }
    else {
      fill('#0484DC');
    }
    stroke('FFFFFF');
    strokeWeight(3*min(width/1991, height/1122));
    ellipse(this.x, this.y, this.r*2, this.r*2);
    pop();

    push();
    fill('FFFFFF');
    textAlign(CENTER, CENTER);
    textSize(20*min(width/1991, height/1122));
    textFont(regularFont);
    noStroke();
    text(this.name, this.x-this.r, this.y-this.r, 2*this.r, 2*this.r);
    pop();
  }
}

let selectedNode = -1;
let selectedDropdown = "What is EvoSkillTree?";
let branch = [];
let linkBoxIdx = 0;
let linkBoxes = [];
let linkList = [];
let connectionDist = 150;
let leftSidebar = 510;
let sidebarWidth = 495;
let topSidebar = 25;
let sidebarHeight = 1072;
let sidebarR = 25;
let titleFontSize = 50;
let titleTop = 40;
let infoFontSize = 40;
let infoCoord = 20;
let leftHeading = 485;
let headingWidth = 445;
let headingTop = 120;
let headingHeight = 50;
let headingMargin = 10;
let headingFontSize = 30;
let headingR = 10;
let rightTriangleLeft = 470;
let rightTriangleTop = 140;
let triangleLength = 10;
let bodyLeft = 450;
let bodyTop = 170;
let bodyWidth = 400;
let bodyFontSize = 18;
let nodeOutline = 15;
let completeButtonTop = 140;
let completeButtonHeight = 90;
let completeButtonX = 262.5;
let completeButtonY = completeButtonTop-completeButtonHeight/2;
let lead = 5;
let nodeName;
let imgMargin = 30;
let activateTree = false;
let photoButtonWidth = 500;
let photoButtonHeight = 500;
let searchBoxHeight = 50;
let searchText = "";
let idx = 0;
let activate = false;

let skillNameList = [];
let skillNameTree = {};
let skillList = [];
let usedList = [];
let skillTree = {};

function addItem(item, parent){
  if((sublinks.length == 3 || skillList.length == 0) && !(item in skillNameList)){
    append(skillNameList, item);
    if(parent == ""){
      skillNameTree[item] = [];
    }
    else{
      skillNameTree[item] = [parent];
      append(skillNameTree[parent], item);
    }
    if(selectedNode != -1){
      append(skillList, new SkillNode(skillList[selectedNode].x, skillList[selectedNode].y, item));
    }
    else{
      append(skillList, new SkillNode(width/2, height/2, item));
    }
    for(let key in skillNameTree){
      let ind = -1;
      for(let i = 0; i < skillNameList.length; i++){
        if(skillNameList[i] == key){
          ind = i;
        }
      }
      skillTree[ind] = [];
      for(let i = 0; i < skillNameTree[key].length; i++){
        let ind2 = -1;
        for(let j = 0; j < skillNameList.length; j++){
          if(skillNameList[j] == skillNameTree[key][i]){ 
            ind2 = j;
          }
        }
        append(skillTree[ind], ind2);
      }
    }
  }
}

function setup() {
  width = windowWidth;
  height = windowHeight;

  createCanvas(windowWidth, windowHeight);
  frameRate(60);
}

function drawConnection(node1, node2){
  push();
  stroke('FFFFFF');
  strokeWeight(3*width/1991);
  line(node1.x, node1.y, node2.x, node2.y);
  pop();
}

function dfs(node, prev){
  append(branch, node);
  for(let i = 0; i < skillTree[node].length; i++){
    let next = skillTree[node][i];
    if(next != prev && (skillList[next].locked == false || skillList[skillTree[next][0]].locked == false)){
      dfs(next, node);
    }
  }
}

function calcForce(nodeIdx, dx, dy){
  let x = skillList[nodeIdx].x + dx;
  let y = skillList[nodeIdx].y + dy;

  let amt = 1/(x-skillList[nodeIdx].r) + 1/(width-leftSidebar-x-skillList[nodeIdx].r) + 1/(y-infoFontSize-skillList[nodeIdx].r) + 1/(height-y-skillList[nodeIdx].r);
  // let amt = 0;
  for(let i = 0; i < skillList.length; i++){
    let ok = false;
    for(let j = 0; j < skillTree[nodeIdx].length; j++){
      if(skillTree[nodeIdx][j] == i){
        ok = true;
        break;
      }
    }
    if((skillList[i].locked == false || skillList[skillTree[i][0]].locked == false) && i != nodeIdx && !ok){
      if(dist(skillList[i].x, skillList[i].y, x, y) < 2*skillList[i].r){
        amt += sqrt(1/max(dist(skillList[i].x, skillList[i].y, x, y),1));
      }
      else{
        amt += 1/max(dist(skillList[i].x, skillList[i].y, x, y),1);
      }
    }
  }

  for(let i = 0; i < skillTree[nodeIdx].length; i++){
    let node = skillTree[nodeIdx][i];
    if(skillList[node].locked == false || skillList[skillTree[node][0]].locked == false){
      let diff = abs(dist(skillList[node].x, skillList[node].y, x, y) - connectionDist);
      diff = max(diff, 1);
      amt += 4*(1-(1/diff));
    }
  }
  // console.log(amt);
  return amt;
}

function inCircle(a, b, x, y, r){
  let distPoints = pow(a-x, 2) + pow(b-y,2);
  let r2 = pow(r, 2);
  if(distPoints < r2){
    return true; 
  }
  return false;
}

function mousePressed(){
  //     rect(width-490, height-135, 460, 90, 10,10,10,10);
  for(let i = 0; i < skillList.length; i++){
    if(inCircle(mouseX, mouseY, skillList[i].x, skillList[i].y, skillList[i].r)){
      if(selectedNode == i){
        selectedNode = -1;
        selectedDropdown = "What is EvoSkillTree?";
      }
      else{
        selectedNode = i;
      }
    }
  }

  if(width-leftHeading < mouseX && mouseX < width-leftHeading+headingWidth && height-completeButtonTop < mouseY && mouseY < height-completeButtonTop+completeButtonHeight){
    if(skillList[selectedNode].locked == true){
      if(!(selectedNode in usedList)){
        prompt = skillList[selectedNode].name;
        console.log(skillList[selectedNode].name);
        getPageHtml(`https://en.wikipedia.org/api/rest_v1/page/html/${prompt}`).then(
          (html) => {
            if (html) {
              // Extract and log the first 5 sublink titles
              sublinks = extractSublinks(html);
              console.log(sublinks);
            }
          }
        );
        getAIQuestions();
        getAISummary();
        append(usedList, selectedNode);
        activate = true;
      }
      console.log(usedList);
    
    
      skillList[selectedNode].locked = false;
      console.log(skillNameList);
      console.log(skillNameTree);
      console.log(skillList);
      console.log(skillTree);
      let ang = atan2(skillList[selectedNode].y - skillList[skillTree[selectedNode][0]].y, skillList[selectedNode].x - skillList[skillTree[selectedNode][0]].x);
      if (selectedNode == 0) {
        ang = 0;
      }
      for (let j = 0; j < skillTree[selectedNode].length; j++) {
        if (skillTree[selectedNode][j] > selectedNode) {
          skillList[skillTree[selectedNode][j]].x = connectionDist*cos(ang) + skillList[selectedNode].x;
          skillList[skillTree[selectedNode][j]].y = connectionDist*sin(ang) + skillList[selectedNode].y;
        }
      }
    }
  }

  if(width/2 - photoButtonWidth/2 - 500 < mouseX && mouseX < width/2   + photoButtonWidth/2 - 500 && height/2 - photoButtonHeight/2 < mouseY && mouseY < height/2 + photoButtonHeight/2){
    activateTree = true;
  }

  if(width/2+500-photoButtonWidth/2+510 < mouseX && mouseX < width/2+500-photoButtonWidth/2+510 + searchBoxHeight && height/2-searchBoxHeight/2+20 < mouseY && mouseY < height/2-searchBoxHeight/2+20+searchBoxHeight && skillList.length == 0){
    addItem(searchText, "");

    console.log(skillList);
    console.log(skillTree);

    activateTree = true;
  }
}

function isAlphanumeric(str) {
  return str.length == 1 && /^[a-zA-Z0-9]+$/.test(str);
}

function keyPressed(){
  if(isAlphanumeric(key)){
    searchText += key;
  }
  else if(key == "Backspace" && searchText.length != 0){
    searchText = searchText.substring(0, searchText.length-1);
  }
}

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function draw() {
  background('#222222');

  console.log(AIQuestions);
  console.log(AISummary);
  console.log(sublinks);

  console.log(activate);
  console.log(skillNameList);
  if(sublinks.length == 3 && activate){
    addItem(sublinks[0], skillList[selectedNode].name);
    addItem(sublinks[1], skillList[selectedNode].name);
    addItem(sublinks[2], skillList[selectedNode].name);
    sublinks = [];
    activate = false;
  }

  console.log(skillNameTree);

  try{
    if(activateTree == false){
      push();
      textFont(titleFont);
      textSize(titleFontSize);
      textAlign(CENTER, CENTER);
      fill('#FFFFFF');
      text("Welcome to WikiMap", width/2, height/5);
      pop();

      push();
      fill('#808080');
      rect(width/2-photoButtonWidth/2-500, height/2-photoButtonHeight/2, photoButtonWidth, photoButtonHeight, headingR, headingR, headingR, headingR);
      pop();

      push();
      textFont(headingFont);
      textSize(headingFontSize);
      textAlign(CENTER, CENTER);
      fill('#FFFFFF');
      text("Upload Photo of Notes:", width/2-500, height/3);
      pop();

      push();
      imageMode(CENTER);
      image(picIcon, width/2-500, height/2+30, 300, 300);
      pop();

      push();
      textFont(titleFont);
      textSize(titleFontSize);
      textAlign(CENTER, CENTER);
      fill('#FFFFFF');
      text("OR", width/2, height/2);
      pop();

      push();
      textFont(headingFont);
      textSize(headingFontSize);
      textAlign(LEFT);
      fill("#FFFFFF");
      text("What do you want to learn?", width/2+500-photoButtonWidth/2, height/2-20);
      pop();

      push();
      fill('#808080');
      rect(width/2+500-photoButtonWidth/2, height/2-searchBoxHeight/2+20, 500, searchBoxHeight, headingR, headingR, headingR, headingR);
      rect(width/2+500-photoButtonWidth/2+510, height/2-searchBoxHeight/2+20, searchBoxHeight, searchBoxHeight, headingR, headingR, headingR, headingR);
      pop();

      push();
      textFont(headingFont);
      textSize(headingFontSize);
      textAlign(LEFT);
      fill("#FFFFFF");
      text("Go", width/2+500-photoButtonWidth/2+510+5, height/2-searchBoxHeight/2+20+searchBoxHeight/2+10);
      text(searchText, width/2+500-photoButtonWidth/2+5, height/2-searchBoxHeight/2+20+searchBoxHeight/2+10);
      pop();
    }
    else{
      push();
      fill('#808080');
      rect(width-leftSidebar, topSidebar, sidebarWidth, sidebarHeight, sidebarR,sidebarR,sidebarR,sidebarR);
      pop();

      push();
      textFont(titleFont);
      textSize(titleFontSize);
      textAlign(LEFT, TOP);
      fill('#FFFFFF');
      if(selectedNode != -1){
        text(capitalizeFirstLetter(skillList[selectedNode].name), width-leftHeading, titleTop);
      }
      else{
        text("WikiMap", width-leftHeading, titleTop);
      }
      pop();

      push();
      textFont(headingFont);
      textSize(headingFontSize-10);
      textAlign(LEFT, TOP);
      fill("#FFFFFF");
      text(AISummary, width - leftHeading, topSidebar + 100, sidebarWidth - 40, sidebarHeight - 120);
      pop();

      if(selectedNode == -1){
        nodeName = "EvoSkillTree";
      }
      else{
        nodeName = skillList[selectedNode].name;
      }

      skillList[0].x = width/2;
      skillList[0].y = height/2;

      rect(width-leftHeading, height-completeButtonTop, headingWidth, completeButtonHeight, headingR,headingR,headingR,headingR);
      push();
      textFont(headingFont);
      textSize(headingFontSize);
      textAlign(CENTER, CENTER);
      fill('#000000');
      text("Expand", width-completeButtonX, height-completeButtonY);
      pop();

      // AISummary = "";

      for(let i = 1; i < skillList.length; i++){
        if(skillList[i].locked == false || skillList[skillTree[i][0]].locked == false){
          dfs(i, skillTree[i][0]);

          let mnf = 0;
          for(let k = 0; k < branch.length; k++){
            mnf += calcForce(branch[k], 0, 0);
          }
          let d = 0;
          let ang = atan2((skillList[i].y - skillList[skillTree[i][0]].y), (skillList[i].x - skillList[skillTree[i][0]].x));
          for(let j = -5; j <= 5; j += 10){
            let f = 0;

            for(let k = 0; k < branch.length; k++){
              let x2 = skillList[branch[k]].x + j*cos(ang);
              let y2 = skillList[branch[k]].y + j*sin(ang);
              f += calcForce(branch[k], x2 - skillList[branch[k]].x, y2 - skillList[branch[k]].y);
            }

            if(mnf - f > 0.000001){
              mnf = f;
              d = j;
            }
          } 

          for(let k = 0; k < branch.length; k++){
            skillList[branch[k]].x = skillList[branch[k]].x + d*cos(ang);
            skillList[branch[k]].y = skillList[branch[k]].y + d*sin(ang);
          }
          // console.log(mnf);
          branch = [];
        }
      }

      for(let i = 1; i < skillList.length; i++){
        if(skillList[i].locked == false || skillList[skillTree[i][0]].locked == false){
          dfs(i, skillTree[i][0]);
          // console.log(i, skillTree[i][0], branch);
          let mnf = 0;
          for(let k = 0; k < branch.length; k++){
            mnf += calcForce(branch[k], 0, 0);
          }
          let d = 0;
          for(let j = -5; j <= 5; j += 10){
            let f = 0;
            for(let k = 0; k < branch.length; k++){
              let ang = atan2((skillList[branch[k]].y - skillList[skillTree[i][0]].y), (skillList[branch[k]].x - skillList[skillTree[i][0]].x));
              let dist = sqrt(pow(skillList[branch[k]].x - skillList[skillTree[i][0]].x, 2) + pow(skillList[branch[k]].y - skillList[skillTree[i][0]].y, 2));
              let x2 = skillList[skillTree[i][0]].x + dist*cos(ang+j*Math.PI/180);
              let y2 = skillList[skillTree[i][0]].y + dist*sin(ang+j*Math.PI/180);
              f += calcForce(branch[k], x2 - skillList[branch[k]].x, y2 - skillList[branch[k]].y);
            }

            if(mnf - f > 0.000001){
              mnf = f;
              d = j;
            }
          } 

          for(let k = 0; k < branch.length; k++){
            let ang = atan2((skillList[branch[k]].y - skillList[skillTree[i][0]].y), (skillList[branch[k]].x - skillList[skillTree[i][0]].x));
            let dist = sqrt(pow(skillList[branch[k]].x - skillList[skillTree[i][0]].x, 2) + pow(skillList[branch[k]].y - skillList[skillTree[i][0]].y, 2));
            skillList[branch[k]].x = skillList[skillTree[i][0]].x + dist*cos(ang+d*Math.PI/180);
            skillList[branch[k]].y = skillList[skillTree[i][0]].y + dist*sin(ang+d*Math.PI/180);
          }
          // console.log(mnf);
          branch = [];
        }
      }

      for(let u in skillTree){
        if(skillList[u].locked == false){
          for(let i = 0; i < skillTree[u].length; i++){
            drawConnection(skillList[u], skillList[skillTree[u][i]]);
          }
        }
      }

      if (selectedNode != -1) {
        push();
        stroke('#3D8C40');
        strokeWeight(nodeOutline);
        noFill();
        ellipse(skillList[selectedNode].x, skillList[selectedNode].y, 2 * skillList[selectedNode].r);
        pop();
      }

      for(let i = 0; i < skillList.length; i++){
        if(i == 0 || skillList[i].locked == false || skillList[skillTree[i][0]].locked == false){
          skillList[i].drawNode();
        }
      }
    }
  }
  catch(err){
    console.log(err);
    push();
    fill("#FFFFFF");
    rect(0,0, width,height);
    pop();
  }
}