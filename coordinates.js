//#region Canvas data
var canvasWidth = 400;
//#endregion

//#region Count data
var coordinates = [];
var axisWas = 0;
var aboveXcounter = 0;
var quartersPointCounts = [];
var farAwai = {x: 0, y: 0};
var biggestAxisDistance = {x: 0, y: 0};
var avgOrigoDistance = 0;
var avgPiontsDistance = 0;
var farAwaiPoints = {x1: 0, y2: 0, x2: 0, y2: 0, distance: 0}
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
    quartersPointCounts = [{quarter: 1, count: 0},{quarter: 2, count: 0},{quarter: 3, count: 0},{quarter: 4, count: 0}];
    coordinates = [];
    axisWas = false;
    axisWasTwo = false;
    aboveXcounter = 0;
    var farOrigo = 0;
    var far = 0;
    farAwai = {x: 0, y: 0}
    biggestAxisDistance = {x: 0, y: 0}
    avgOrigoDistance = 0;
    avgPiontsDistance = 0;
    farAwaiPoints.distance = farAwaiPoints.x1 = farAwaiPoints.y1 = farAwaiPoints.x2 = farAwaiPoints.y2 = 0;
    origoMirroredPoint = false; 
    axisMirroredPoint = false;
    threePoints.thereIsAThreePiontLine = false;
    threePoints.x1 = threePoints.y1 = threePoints.x2 = threePoints.y2 = 0;

    for(let i = 0; i < 18; i++)
    {
        coordinates.push({x: rand(-9,9), y: rand(-9,9), distanceFromOrigo: 0});
        coordinates[i].distanceFromOrigo = Math.sqrt(Math.pow(coordinates[i].x,2) + Math.pow(coordinates[i].y,2));
        PointOnAxis(coordinates[i].x);
        PointOnAxis(coordinates[i].y);
        if(coordinates[i].y > 0){aboveXcounter++}
        QuarterCounts(i);
        if(coordinates[i].distanceFromOrigo > farOrigo){farOrigo = coordinates[i].distanceFromOrigo; farAwai.x = coordinates[i].x; farAwai.y = coordinates[i].y;}
        avgOrigoDistance += coordinates[i].distanceFromOrigo;
        if((Math.abs(coordinates[i].x) > Math.abs(coordinates[i].y) && (Math.abs(coordinates[i].y) > far))){far = Math.abs(coordinates[i].y); biggestAxisDistance.x = coordinates[i].x; biggestAxisDistance.y = coordinates[i].y}
        else if((Math.abs(coordinates[i].y) > Math.abs(coordinates[i].x) && (Math.abs(coordinates[i].x) > far))){far = Math.abs(coordinates[i].x); biggestAxisDistance.x = coordinates[i].x; biggestAxisDistance.y = coordinates[i].y}
    }
    FindSamePoint();
    ThreeLineChecker();
}

function TwoPointDistance(x1,y1,x2,y2)
{
    return Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2))
}

function ThreePointonALine(x1,y1,x2,y2,x3,y3)
{
    if(((y2-y1)*x3) + (((x2-x1)*-1)*y3) === ((y2-y1)*x1) + (((x2-x1)*-1)*y1))//nx = y2-y1;ny = (x2-x1)*-1;normálvektor
    {
        var dist12 = TwoPointDistance(x1,y1,x2,y2);
        var dist13 = TwoPointDistance(x1,y1,x3,y3);
        var dist23 = TwoPointDistance(x2,y2,x3,y3);

        threePoints.thereIsAThreePiontLine = true;
        threePoints.x1 = x1;
        threePoints.y1 = y1;

        if(dist12 > dist13 && dist12 > dist23)
        {
            threePoints.x2 = x2;
            threePoints.y2 = y2;
        }
        else if(dist13 > dist12 && dist13 > dist23)
        {
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
            ThreePointonALine(coordinates[i].x,coordinates[i].y,coordinates[i+1].x,coordinates[i+1].y,coordinates[j].x,coordinates[j].y);
        }

        if(threePoints.thereIsAThreePiontLine)
        {
            j = i = coordinates.length;
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
            var actualPDIstance = TwoPointDistance(coordinates[i].x,coordinates[i].y,coordinates[y].x,coordinates[y].y);
            avgPiontsDistance += actualPDIstance;
            if(actualPDIstance > farAwaiPoints.distance){
                farAwaiPoints.x1 = coordinates[i].x;
                farAwaiPoints.y1 = coordinates[i].y;
                farAwaiPoints.x2 = coordinates[y].x;
                farAwaiPoints.y2 = coordinates[y].y;
                farAwaiPoints.distance = actualPDIstance;}
            if(!origoMirroredPoint){origoMirroredPoint = coordinates[i].x*-1 === coordinates[y].x && coordinates[i].y*-1 === coordinates[y].y}
            if(!axisMirroredPoint){axisMirroredPoint = (coordinates[i].x*-1 === coordinates[y].x && coordinates[i].y === coordinates[y].y) ||
                (coordinates[i].y*-1 === coordinates[y].y && coordinates[i].x === coordinates[y].x)}
            
            y++
            counter++;
        }
    }
    avgPiontsDistance = avgPiontsDistance/counter;
    return samePoint;
}

function PointOnAxis(axis)
{
    if(!axisWasTwo && axis === 0){if(!axisWas){axisWas = true}else{axisWasTwo = true}}
}

function QuarterCounts(index)
{    
    if(coordinates[index].x > 0 && coordinates[index].y > 0){quartersPointCounts[0].count++}
    else if(coordinates[index].x < 0 && coordinates[index].y > 0){quartersPointCounts[1].count++}
    else if(coordinates[index].x < 0 && coordinates[index].y < 0){quartersPointCounts[2].count++}
    else{quartersPointCounts[3].count++}   
}

function QuarterHasTheMostPoints()
{
    var theMostQ = -1;
    var quarter = -1;
    for(let i = 0;i < quartersPointCounts.length;i++)
    {
        if(quartersPointCounts[i].count > theMostQ){theMostQ = quartersPointCounts[i].count; quarter = quartersPointCounts[i].quarter}
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

function CreateOneDivForFull(willBeLoop, givenArray, type, id, resultText)
{
    let div = document.createElement('div');
    div.id = id;
    div.className = 'block';
    let data = ``;
    var results = ``;

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
                    results = `<label id="${id}${i}" name="">${resultText}</label></br>`;  //majd kivenni
                }
                results += `<label id="${id}${i}" name="">${data}</label><br>`;
            }
        }
        else
        {
            results = `<label id="${id}" name="">Nem volt a kérdésnek megfelelő adat.</label></br>`;
        }
    }
    else
    {
        results = `<label id=${id} name="">${resultText}</label>`;
    }
    div.innerHTML = results;
    document.getElementById('fullDiv').appendChild(div);
}

function CreateH1(id)
{
    let h1 = document.createElement('h1');
    h1.id = id;
    h1.innerText = "Koordináták";
    document.getElementById('fullDiv').appendChild(h1);
}

function CreateButton(id)
{
    let div = document.createElement('div');
    div.className = 'center';
    div.innerHTML = `<button id=${id} onclick="NewTurn()">Nyomja meg a gombot az új koordináták generálásához.</button>`;
    document.getElementById('fullDiv').appendChild(div);
}

function CreateCanvas()
{
    let div = document.createElement('div');
    div.className = 'center';
    div.id = 'centerCanvas';

    div.innerHTML = `<canvas width="400" height="400" id="axesAndCoordinates" class="AxesACoord"></canvas>`;
    document.getElementById('fullDiv').appendChild(div);
}

function DrawCanvas()
{
    let canvas = document.getElementById('axesAndCoordinates');
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
    ctx.lineTo((canvasWidth/2)+(farAwai.x*20), (canvasWidth/2)+(farAwai.y*-20));
    ctx.strokeStyle = '#ff0000';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo((canvasWidth/2) + (farAwaiPoints.x1*20), (canvasWidth/2) + (farAwaiPoints.y1*-20));
    ctx.lineTo((canvasWidth/2)+(farAwaiPoints.x2*20), (canvasWidth/2)+(farAwaiPoints.y2*-20));
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
    let canvas = document.getElementById('axesAndCoordinates');
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
    CreateOneDivForFull(false,null,0,'axisHasPoint',`${axisWas ? "Van" : "Nincs"} olyan pont amelyik rajta van valamelyik tengelyen.`);
    CreateOneDivForFull(false,null,0,'bothAxisesHavePoints',`${axisWasTwo ? "Van" : "Nincs"} mindkét tengelyen pont.`);
    CreateOneDivForFull(false,null,0,'aboveXCount',`A pontok ${((aboveXcounter/18)*100).toFixed(2)} százaléka van az x tengely felett.`);
    CreateOneDivForFull(false,null,0,'firstQuarterCount',`Az első síknegyedben ${quartersPointCounts[0].count} pont található.`);
    CreateOneDivForFull(false,null,0,'quarterHasTheMostPCount',`A ${QuarterHasTheMostPoints()} negyedben van a legtöbb pont. (Az első legnagyobb találat)`);
    CreateOneDivForFull(false,null,0,'avgOrigoDistance',`Az origótól mért átlagos távolság ${(avgOrigoDistance/18).toFixed(2)}`);
    CreateOneDivForFull(false,null,0,'farAwaiFromOrigo',`A ${farAwai.x}; ${farAwai.y} koordinátákkal rendelkező pont van a legmesszebb az origótól.`);
    CreateOneDivForFull(false,null,0,'samePintFound', `${FindSamePoint() ? "Van": "Nincs"} olyan két pont aminek a koordinátája ugyan az.`);
    CreateOneDivForFull(false,null,0,'avgPointDIstance',`A pontok átlagos távolsága: ${avgPiontsDistance.toFixed(2)}`);
    CreateOneDivForFull(false,null,0,'farAwatPointDistance',`A legnagyobb ${farAwaiPoints.distance.toFixed(2)} távolság a ${farAwaiPoints.x1}; ${farAwaiPoints.y1} pont és a ${farAwaiPoints.x2};${farAwaiPoints.y2} pont között van.`);
    CreateOneDivForFull(false,null,0,'origoMirroredPiont',`${origoMirroredPoint ? "Van" : "Nincs"} olyan pontpár amelyek egymás tükörképei az origóból nézve.`);
    CreateOneDivForFull(false,null,0,'axisMirroredPint',`${axisMirroredPoint ? "Van" : "Nincs"} olyan pontpár amelyek egymás tükörképei valamelyik tengelyről nézve.`);
    CreateOneDivForFull(false, null,0,'biggestAxisDistance', `A tengelyektől a ${biggestAxisDistance.x}; ${biggestAxisDistance.y}  pont van a legtávolabb.`);
    CreateOneDivForFull(false,null,0,'threPointOnLine',`${threePoints.thereIsAThreePiontLine ? "Van":"Nincs"} Olyanpont amelyen 3 pont is rajta van.`);
}
//#endregion

function NewTurn()
{
    CLearFullDiv();
    randomCoordinates();  
    CreateFullDiv();
    CreateH1('mainTitle');
    CreateCanvas();
    DrawCanvas();
    DrawPoints();
    CreateAnswerDivs();
    CreateButton('buttonNewTurn');
}

document.getElementById("buttonNewTurn").onclick = NewTurn;
