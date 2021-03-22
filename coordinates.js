//#region Canvas data
var canvasWidth = 400;
//#endregion

//#region Count data
var coordinates = [];
var axisXWas = false;
var axisYWas = false;
var aboveXcounter = 0;
var quartersPointsCounts = [];
var farAway = {x: 0, y: 0};
var biggestAxisDistance = {x: 0, y: 0};
var avgOrigoDistance = 0;
var avgPointsDistance = 0;
var farAwayPoints = {x1: 0, y2: 0, x2: 0, y2: 0, distance: 0}
var origoMirroredPoint = false;
var axisMirroredPoint = false;
var threePoints = {thereIsAThreePiontLine: false, x1: 0, y1: 0, x2: 0, y2: 0};
//#endregion

//#region Count for coordinates
function rand(min, max)
{
    return Math.floor( Math.random() * (max-min+1) ) + min;
}

function randomCoordinates()
{
    quartersPointsCounts = [{quarter: 1, count: 0},{quarter: 2, count: 0},{quarter: 3, count: 0},{quarter: 4, count: 0}];
    coordinates = [];
    axisXWas = false;
    axisYWas = false;
    aboveXcounter = 0;
    var farOrigo = 0;
    var far = 0;
    farAway = {x: 0, y: 0}
    biggestAxisDistance = {x: 0, y: 0}
    avgOrigoDistance = 0;
    avgPointsDistance = 0;
    farAwayPoints.distance = farAwayPoints.x1 = farAwayPoints.y1 = farAwayPoints.x2 = farAwayPoints.y2 = 0;
    origoMirroredPoint = false; 
    axisMirroredPoint = false;
    threePoints.thereIsAThreePiontLine = false;
    threePoints.x1 = threePoints.y1 = threePoints.x2 = threePoints.y2 = 0;

    for(let i = 0; i < 18; i++)
    {
        coordinates.push({x: rand(-9,9), y: rand(-9,9), distanceFromOrigo: 0});
        coordinates[i].distanceFromOrigo = Math.sqrt(Math.pow(coordinates[i].x,2) + Math.pow(coordinates[i].y,2));

        if(!axisXWas){PointOnAxis(coordinates[i].x,'x');}
        if(!axisYWas){PointOnAxis(coordinates[i].y,'y');}
        if(coordinates[i].y > 0){aboveXcounter++}
        QuarterCounts(i);
        if(coordinates[i].distanceFromOrigo > farOrigo){farOrigo = coordinates[i].distanceFromOrigo; farAway.x = coordinates[i].x; farAway.y = coordinates[i].y;}
        avgOrigoDistance += coordinates[i].distanceFromOrigo;
        if((Math.abs(coordinates[i].x) > Math.abs(coordinates[i].y) && (Math.abs(coordinates[i].y) > far)))
        {far = Math.abs(coordinates[i].y); biggestAxisDistance.x = coordinates[i].x; biggestAxisDistance.y = coordinates[i].y}
        else if((Math.abs(coordinates[i].y) > Math.abs(coordinates[i].x) && (Math.abs(coordinates[i].x) > far)))
        {far = Math.abs(coordinates[i].x); biggestAxisDistance.x = coordinates[i].x; biggestAxisDistance.y = coordinates[i].y}
    }
    FindSamePoint();
    ThreeLineChecker();
}

function TwoPointsDistance(x1,y1,x2,y2)
{
    return Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2))
}

function ThreePointOnALine(x1,y1,x2,y2,x3,y3)
{
    if(((y2-y1)*x3) + (((x2-x1)*-1)*y3) === ((y2-y1)*x1) + (((x2-x1)*-1)*y1))//nx = y2-y1;ny = (x2-x1)*-1;normálvektor
    {
        var dist12 = TwoPointsDistance(x1,y1,x2,y2);
        var dist13 = TwoPointsDistance(x1,y1,x3,y3);
        var dist23 = TwoPointsDistance(x2,y2,x3,y3);

        threePoints.thereIsAThreePiontLine = true;

        if(dist12 >= dist13 && dist12 >= dist23)
        {
            threePoints.x1 = x1;
            threePoints.y1 = y1;
            threePoints.x2 = x2;
            threePoints.y2 = y2;
        }
        else if(dist13 > dist12 && dist13 >= dist23)
        {
            threePoints.x1 = x1;
            threePoints.y1 = y1;
            threePoints.x2 = x3;
            threePoints.y2 = y3;
        }
        else if(dist23 > dist12 && dist23 > dist13)
        {
            threePoints.x1 = x2;
            threePoints.y1 = y2;
            threePoints.x2 = x3;
            threePoints.y2 = y3;
        }
    }
}

function ThreeLineChecker()
{
    for(let i = 0; i < coordinates.length-2;i++)
    {
        for(let j = i+2;j <coordinates.length-3;j++)
        {
            ThreePointOnALine(coordinates[i].x,coordinates[i].y,coordinates[i+1].x,coordinates[i+1].y,coordinates[j].x,coordinates[j].y);

            if(threePoints.thereIsAThreePiontLine)
            {
                j = i = coordinates.length;
            }
        }
    }
}

function FindSamePoint()
{
    var samePoint = false;
    var counter = 0;
    for(let i = 0; i< coordinates.length; i++)
    {
        let y = i+1;

        while(y < coordinates.length)
        {
            if(!samePoint){samePoint = coordinates[i].x === coordinates[y].x && coordinates[i].y === coordinates[y].y;}
            var actualPDIstance = TwoPointsDistance(coordinates[i].x,coordinates[i].y,coordinates[y].x,coordinates[y].y);
            avgPointsDistance += actualPDIstance;
            if(actualPDIstance > farAwayPoints.distance){
                farAwayPoints.x1 = coordinates[i].x;
                farAwayPoints.y1 = coordinates[i].y;
                farAwayPoints.x2 = coordinates[y].x;
                farAwayPoints.y2 = coordinates[y].y;
                farAwayPoints.distance = actualPDIstance;}
            if(!origoMirroredPoint){origoMirroredPoint = coordinates[i].x*-1 === coordinates[y].x && coordinates[i].y*-1 === coordinates[y].y}
            if(!axisMirroredPoint){axisMirroredPoint = (coordinates[i].x*-1 === coordinates[y].x && coordinates[i].y === coordinates[y].y) ||
                (coordinates[i].y*-1 === coordinates[y].y && coordinates[i].x === coordinates[y].x)}         
            y++
            counter++;
        }
    }
    avgPointsDistance = avgPointsDistance/counter;
    return samePoint;
}

function PointOnAxis(point, axis)
{
    if(point === 0){if(axis === 'x'){axisXWas = true}else{axisYWas = true}}
}

function QuarterCounts(index)
{    
    if(coordinates[index].x > 0 && coordinates[index].y > 0){quartersPointsCounts[0].count++}
    else if(coordinates[index].x < 0 && coordinates[index].y > 0){quartersPointsCounts[1].count++}
    else if(coordinates[index].x < 0 && coordinates[index].y < 0){quartersPointsCounts[2].count++}
    else{quartersPointsCounts[3].count++}   
}

function QuarterHasTheMostPoints()
{
    var theMostQ = -1;
    var quarter = -1;
    for(let i = 0;i < quartersPointsCounts.length;i++)
    {
        if(quartersPointsCounts[i].count > theMostQ){theMostQ = quartersPointsCounts[i].count; quarter = quartersPointsCounts[i].quarter}
    }
    return quarter;
}
//#endregion

//#region Visualize
function CLearFullDiv()
{
    var div = document.getElementById('fullDiv');
    div.remove();
}

function CreateFullDiv()
{
    let div = document.createElement('div');
    div.id = 'fullDiv'
    div.className = 'full';

    document.body.appendChild(div);
}

function CreateOneDivForFull(willBeLoop, givenArray, type, id, taskNumber, question, resultText)
{
    let divRow = document.createElement('div');
    divRow.id = `row${id}`;
    divRow.className = 'row';

    let divCardBody = document.createElement('div');
    divCardBody.id = `card${id}`;
    divCardBody.className = 'col-sm-4 mb-2';

    let h6 = document.createElement('h6');
    h6.className = `h6`;
    h6.id = `h6${id}`;
    h6.textContent = "Feladat " + String(taskNumber+1);
    
    let pQuestion = document.createElement('p');
    pQuestion.id = `question${id}`;
    pQuestion.className = 'question';
    if(taskNumber === 6){pQuestion.innerHTML = question + `<span style='color: #ff0000;'> &#8718;</span>`;}
    else if(taskNumber === 10){pQuestion.innerHTML = question + `<span style='color: #009933;'> &#8718;</span>`;}
    else if(taskNumber === 13){pQuestion.innerHTML = question + `<span style='color: #0033cc;'> &#8718;</span>`;}
    else{pQuestion.textContent = question;}

    let pAnswer = document.createElement('p');
    pAnswer.id = `answer${id}`;
    pAnswer.className = 'answer';

    let data = ``;

    if(willBeLoop)
    {
        if(givenArray.length > 0)
        {       
            for(let i = 0; i < givenArray.length;i++)
            {
                if(type === 1)
                {
                    data = `${givenArray[i][1]} ${givenArray[i][2]} ${givenArray[i][3]}`;
                }
                else if(type === 2)
                {
                    data = `${givenArray[i]}`;
                }

                if(i === 0)
                {
                    pAnswer.textContent = resultText;
                }
                pAnswer.textContent += " " + data + (i === givenArray.length -1 ? "" : " - ");
            }
        }
        else
        {
            pAnswer.textContent = `Nem volt a kérdésnek megfelelő adat.`;
        }
    }
    else
    {
        pAnswer.textContent = resultText;
    }

    if(taskNumber % 3 === 0)
    {
        actualDivRow = document.getElementById('fullDiv').appendChild(divRow);
    }

    document.getElementById(actualDivRow.id).appendChild(divCardBody);
    document.getElementById(divCardBody.id).appendChild(h6);
    document.getElementById(divCardBody.id).appendChild(pQuestion);
    document.getElementById(divCardBody.id).appendChild(pAnswer);
}

function CreateH1(id, text)
{
    let h1 = document.createElement('h1');
    h1.id = id;
    h1.innerText = text;
    document.getElementById('fullDiv').appendChild(h1);
}

function CreateButton(id)
{
    let div = document.createElement('div');
    div.className = 'center';
    div.innerHTML = `<button id=${id} onclick="NewTurn()" type="button" class="btn btn-primary btn-sm shadow-lg"
    style="margin-top: 10px;">Nyomja meg a gombot az új dobássorozathoz</button>`;
    document.getElementById('fullDiv').appendChild(div);
}

function CreateThemeParagraph(id, taskTheme)
{
    let paragraph = document.createElement('p');
    paragraph.id = id;
    paragraph.className = `p${id}`;
    paragraph.textContent = taskTheme;
    paragraph.style="margin-top: 20px; margin-bottom: 10px; font-weight: bold; color: rgb(50, 179, 63)";
    document.getElementById('fullDiv').appendChild(paragraph);
}

function CreateNavbar(id)
{
    var nav = document.createElement('NAV');
    nav.id = id;
    nav.className = 'nav navbar-light';
    nav.style = 'background-color:rgb(255, 255, 255); border-bottom: 2px solid rgb(5, 61, 196);';

    var a = document.createElement('a');
    a.id = `a${id}`;
    a.className = 'navbar-brand';
    a.href = "#";

    var img = document.createElement('IMG');
    img.id = `img${id}`;
    img.src = 'PatrikLogo.JPG';
    img.className = 'd-inline-block align-top';
    img.alt = 'logo';
    img.height = 60;
    img.width = 200;

    document.getElementById('fullDiv').appendChild(nav);
    document.getElementById(nav.id).appendChild(a);
    document.getElementById(a.id).appendChild(img);
}

function CreateCanvas()
{
    let div = document.createElement('div');
    div.className = 'center';
    div.id = 'centerCanvas';

    div.innerHTML = `<canvas width="400" height="400" id="axisAndCoordinates" class="AxisACoord"></canvas>`;
    document.getElementById('fullDiv').appendChild(div);
}

function DrawCanvas()
{
    let canvas = document.getElementById('axisAndCoordinates');
    var ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(canvasWidth/2, canvasWidth/20);
    ctx.lineTo(canvasWidth/2, (canvasWidth/20)*19);
    ctx.strokeStyle = '#000000';    
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasWidth/20, canvasWidth/2);
    ctx.lineTo((canvasWidth/20)*19, canvasWidth/2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasWidth/2, canvasWidth/2);
    ctx.lineTo((canvasWidth/2)+(farAway.x*20), (canvasWidth/2)+(farAway.y*-20));
    ctx.strokeStyle = '#ff0000';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo((canvasWidth/2) + (farAwayPoints.x1*20), (canvasWidth/2) + (farAwayPoints.y1*-20));
    ctx.lineTo((canvasWidth/2)+(farAwayPoints.x2*20), (canvasWidth/2)+(farAwayPoints.y2*-20));
    ctx.strokeStyle = '#009933';
    ctx.stroke();

    if(threePoints.thereIsAThreePiontLine)
    {
        ctx.beginPath();
        ctx.moveTo((canvasWidth/2) + (threePoints.x1*20), (canvasWidth/2) + (threePoints.y1*-20));
        ctx.lineTo((canvasWidth/2)+(threePoints.x2*20), (canvasWidth/2)+(threePoints.y2*-20));
        ctx.strokeStyle = '#0033cc';
        ctx.stroke();
    }
}

function PointPlace(x,y)
{
    let canvas = document.getElementById('axisAndCoordinates');
    var ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.arc((canvasWidth/2)+(x*20), (canvasWidth/2)+(y*-20), 2, 0, 2 * Math.PI);
    ctx.strokeStyle = '#000000';
    ctx.stroke();
}

function DrawPoints()
{
    for(let i = 0; i < coordinates.length;i++)
    {
        PointPlace(coordinates[i].x, coordinates[i].y);
    }
}

function CreateAnswerDivs()
{
    CreateOneDivForFull(false,null,0,'axisHasPoint',0,`Van-e pont valamelyik tengelyen?`,
    `${axisXWas ? "Van" : "Nincs"} olyan pont amelyik rajta van valamelyik tengelyen.`);

    CreateOneDivForFull(false,null,0,'bothAxisesHavePoints',1,`Van-e pont mindkét tengelyen?`,
    `${axisXWas && axisYWas ? "Van" : "Nincs"} mindkét tengelyen pont.`);

    CreateOneDivForFull(false,null,0,'aboveXCount',2,`A pontok hány százaléka van az x tengely fölött?`,
    `A pontok ${((aboveXcounter/18)*100).toFixed(2)} százaléka van az x tengely fölött.`);

    CreateOneDivForFull(false,null,0,'firstQuarterCount',3,`Hány pont van az első síknegyedben?`,
    `Az első síknegyedben ${quartersPointsCounts[0].count} pont található.`);

    CreateOneDivForFull(false,null,0,'quarterHasTheMostPCount',4,`Melyik síknegyedben van a legtöbb pont?`,
    `A ${QuarterHasTheMostPoints()} negyedben van a legtöbb pont. (Az első legnagyobb találat)`);

    CreateOneDivForFull(false,null,0,'avgOrigoDistance',5,`Mennyi a pontok origótól mért átlagos távolsága?`,
    `Az origótól mért átlagos távolság ${(avgOrigoDistance/18).toFixed(2)}`);

    CreateOneDivForFull(false,null,0,'farAwayFromOrigo',6,`Melyik pont van a legmesszebb az origótól?`,
    `A ${farAway.x}; ${farAway.y} koordinátákkal rendelkező pont van a legmesszebb az origótól.`);

    CreateOneDivForFull(false, null,0,'biggestAxisDistance',7,`Melyik pont van a legmesszebb a koordináta-rendszer tengelyeitől?`,
    `A tengelyektől a ${biggestAxisDistance.x}; ${biggestAxisDistance.y} pont van a legtávolabb.`);

    CreateOneDivForFull(false,null,0,'samePointFound',8,`Vannak-e egybeeső pontok?`,
    `${FindSamePoint() ? "Van": "Nincs"} olyan két pont aminek a koordinátája ugyan az.`);

    CreateOneDivForFull(false,null,0,'avgPointDistance',9,`Mekkora az átlagos távolság a pontok között?`,
    `A pontok átlagos távolsága: ${avgPointsDistance.toFixed(2)}`);

    CreateOneDivForFull(false,null,0,'farAwayPointDistance',10,`Melyik két pont van a legmesszebb egymástól? Mekkora a távolságuk?`,
    `A legnagyobb ${farAwayPoints.distance.toFixed(2)} távolság a ${farAwayPoints.x1}; ${farAwayPoints.y1} pont és a ${farAwayPoints.x2};${farAwayPoints.y2} pont között van.`);

    CreateOneDivForFull(false,null,0,'origoMirroredPiont',11,`Van-e olyan pontpár, melyek egymás tükörképei az origóból nézve?`,
    `${origoMirroredPoint ? "Van" : "Nincs"} olyan pontpár amelyek egymás tükörképei az origóból nézve.`);

    CreateOneDivForFull(false,null,0,'axisMirroredPint',12,`Van-e olyan pontpár, melyek egymás tükörképei valamely tengelyről nézve?`,
    `${axisMirroredPoint ? "Van" : "Nincs"} olyan pontpár amelyek egymás tükörképei valamelyik tengelyről nézve.`);

    CreateOneDivForFull(false,null,0,'threPointOnLine',13,`Van-e 3 olyan pont, amik egy egyenesre esnek?`,
    `${threePoints.thereIsAThreePiontLine ? "Van":"Nincs"} olyan egyenes amelyen 3 pont is rajta van. (Az első találat)`);
}
//#endregion

function NewTurn()
{
    CLearFullDiv();
    randomCoordinates();  
    CreateFullDiv();
    CreateNavbar('navbar');
    CreateThemeParagraph('mainText','Ez az oldal 18 koordinátával kapcsolatos számítás eredményeit mutatja');
    CreateCanvas();
    DrawCanvas();
    DrawPoints();
    CreateAnswerDivs();
    CreateButton('buttonNewTurn');
}

document.getElementById("buttonNewTurn").onclick = NewTurn;
