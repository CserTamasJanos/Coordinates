//#region Canvas data
var canvasWidth = 400;
//#endregion

//#region Count data
var coordinates = [];
var axisWas = 0;
var aboveXcounter = 0;
var quartersPointCounts = [];
var farAwai = {x: 0, y: 0};
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
    axisWas = 0;
    aboveXcounter = 0;

    for(let i = 0; i < 18; i++)
    {
        coordinates.push({x: rand(-9,9), y: rand(-9,9), distanceFromOrigo: 0});
        coordinates[i].distanceFromOrigo = Math.sqrt(Math.pow(coordinates[i].x,2) + Math.pow(coordinates[i].y,2));
        if(axisWas !== 1 && (coordinates[i].x === 0)){axisWas = 1;}else if(axisWas !==2 && coordinates[i].y === 0){axisWas = 2;}
        if(coordinates[i].y > 0){aboveXcounter++}
        QuarterCounts(i);
    }
    FarAwaiFromOrigo();

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

function FarAwaiFromOrigo()
{
    var far = 0;
    var index = -1;
    for(let i = 0; i < coordinates.length; i++)
    {
        if(coordinates[i].distanceFromOrigo > far){far = coordinates[i].distanceFromOrigo; index = i}
    }
    farAwai.x = coordinates[index].x;
    farAwai.y = coordinates[index].y;
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
                    results = `<label id="${id}${i}" name="">${resultText}</label></br>`;  
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
    CreateOneDivForFull(false,null,0,'axisHasPoint',`${axisWas >= 1 ? "Van" : "Nincs"} olyan pont amelyik rajta van valamelyik tengelyen.`);
    CreateOneDivForFull(false,null,0,'bothAxisesHavePoints',`${axisWas === 2 ? "Van" : "Nincs"} mindkét tengelyen pont.`);
    CreateOneDivForFull(false,null,0,'aboveXCount',`A pontok ${((aboveXcounter/18)*100).toFixed(2)} százaléka van az x tengely felett.`);
    CreateOneDivForFull(false,null,0,'firstQuarterCount',`Az első síknegyedben ${quartersPointCounts[0].count} pont található.`);
    CreateOneDivForFull(false,null,0,'quarterHasTheMostPCount',`A ${QuarterHasTheMostPoints()} negyedben van a legtöbb pont. (Az első legnagyobb találat)`);
    CreateOneDivForFull(false,null,0,'farAwaiFromOrigo',`A ${farAwai.x}; ${farAwai.y} koordinátákkal rendelkező pont van a legmesszebb az origótól.`);
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
