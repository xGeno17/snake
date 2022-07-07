window.onload = function()
{

    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100;
    var snakee;
    var createApple;
    var widthInBlock = canvasWidth/blockSize;
    var heightInBlock = canvasHeight/blockSize;
    var centreX = canvasWidth/2;
    var centreY = canvasHeight/2;
    var score;

    init();

    function init()
    {
        var canvas = document.createElement("canvas");//Canvas est une fonction qui permet de dessiner dans HTML
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid #D4D4D4";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#E4E4E4" ;
        document.body.appendChild(canvas);//permet d'ajouter le tag canvas dans le body du fichier HTML
        ctx = canvas.getContext("2d");//le style du canvas (2D)
        snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
        createApple = new Apple([10,12]);
        score = 0;
        refreshCanvas();//appel la fonction "refreshCanvas"
        
    };
    
    function refreshCanvas()
    {
        snakee.advance();
        if (snakee.checkColision())
        {
            gameOver();
        }
        else
        {
            if(snakee.isEatingApple(createApple))
            {
                snakee.ateApple=true;
                do
                {
                    score += 1;
                    createApple.setNewPosition();
                }
                while(createApple.isOnSnake(snakee))
                
            /// le serpent gagne une case de plus
            }
            ctx.clearRect(0,0,canvasWidth, canvasHeight);
            drawScore();
            snakee.draw();
            createApple.draw();
            setTimeout(refreshCanvas,delay);//permet de relancer la fonction refreshCanvas a chaque delay (20ms là)

        }
    };
    
    function gameOver()
    {
        ctx.save();
        ctx.font="bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.fillText("Game Over", centreX, centreY - 180);
        ctx.font="bold 30px sans-serif"
        ctx.strokeText ("Appuyer sur la touche Espace pour rejouer", centreX, centreY-120);
        ctx.fillText ("Appuyer sur la touche Espace pour rejouer", centreX, centreY-120);
        ctx.restore();
    };

    function restart()
    {
        snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
        createApple = new Apple([10,12]);
        score = 0;
        refreshCanvas();//appel la fonction "refreshCanvas"
    };

    function drawScore()
    {
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "#D4D4D4";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();
    };

    function drawBlock(ctx, position)
    {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x,y,blockSize, blockSize);
    };

    function Snake(body,direction)
    {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function()
        {
            ctx.save(); // permet de sauvegarde le contexte du canvas, donc son contenu avant de rentrer dans la fonction
            ctx.fillStyle = "#61CE70";
            for(var i = 0; i< this.body.length; i++)
            {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        this.advance = function()
        {
            var nextPosition = this.body[0].slice();
            switch(this.direction)
            {
                case "right" :
                    nextPosition[0] += 1;
                    break;
                case "left" :
                    nextPosition[0] -= 1;
                    break;
                case "up" :
                    nextPosition[1] -= 1;
                    break;
                case "down" :
                    nextPosition[1] += 1;
                    break;
                default:
                    throw("Invalid Direction");
            }
            this.body.unshift(nextPosition);
            if(!this.ateApple)
            {
                this.body.pop();
            }
            else
            {
                this.ateApple = false;
            }
            
        };
        this.setDirection = function(newDirection)
        {
            var allowedDirections;
            switch(this.direction)
            {
                case "left":
                case "right":
                    allowedDirections = ["up","down"];
                    break;
                case "up":
                case "down":
                    allowedDirections = ["left","right"];
                    break;
                default:
                    throw("Invalid Direction");
            }
            if(allowedDirections.indexOf(newDirection) > -1)
            {
                this.direction = newDirection;
            }
        };

        document.onkeydown = function handleKeyDown(e)
        {
            var key = e.keyCode;
            var newDirection;
            switch(key)
            {
                case 37:
                    newDirection = "left";
                    break;
                case 38:
                    newDirection = "up";
                    break;
                case 39:
                    newDirection = "right";
                    break;
                case 40:
                    newDirection = "down";
                    break;
                case 32:
                    restart();
                    return; 
                default:
                    return;
            }
            snakee.setDirection(newDirection);
        };

        this.checkColision = function()
        {
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlock -  1;
            var maxY = heightInBlock - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if(isNotBetweenHorizontalWalls||isNotBetweenVerticalWalls)
            {
                wallCollision=true;
            }

            for(var i=0; i < rest.length ; i++)
            {
                if(snakeX === rest[i][0] && snakeY === rest[i][1])
                {
                    snakeCollision = true;
                    console.log("snakeCollision");
                }
            }

            return wallCollision || snakeCollision;

        };

        this.isEatingApple = function(appleToEat)
        {
            var head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true;
            else
                return false;
        };
    
    }
    
    function Apple(position)
    {
        this.position = position;
        this.draw = function()
        {
            ctx.save();
            ctx.fillStyle = "red";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0] * blockSize + radius;
            var y = this.position[1] * blockSize + radius;
            ctx.arc(x,y,radius,0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function()
        {
            var newX = Math.round(Math.random() * (widthInBlock - 1));
            var newY = Math.round(Math.random() * (heightInBlock - 1));
            this.position = [newX,newY];
        };
        this.isOnSnake = function(snakeToCheck)
        {
            var isOnSnake = false;
            for (var i=0; i<snakeToCheck.body.length; i++)
            {
                if(this.position[0]===snakeToCheck.body[i][0] && this.position[1]===snakeToCheck.body[i][1])
                {
                    isOnSnake=true;
                }
            }
            return isOnSnake;
        };

    }
    
}


