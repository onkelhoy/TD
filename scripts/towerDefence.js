// global variables
var turrets = [],
    bullets = [],
    enemies = [],
    level = 0,
    xp = 0,
    mousePos = Vector.create(0, 0),
    selectedTurret = null,
    lives = 200;


function addTurret(){//this function must be outside.. so it can be reached.
    //index at the jsonContent.turrets[index]
    //(position, radius, image, reloadTime, bulletSpeed, name)
    var turretIndex = currentPage; //this variable is found in menu.js.. whz not just use currentPage?
                                //well.. i forgot it.. and now as i found it.. im to lazy xD
    
    var tur = jsonContent.turrets[turretIndex];
    var tempTurret = Turret.create(mousePos, tur.radius, turretImages[turretIndex], tur.reloadTime, tur.bulletSpeed, tur.name, tur.type, tur.damage);
    tempTurret.isClicked = tempTurret.isDraged = true;
    if((selectedTurret != null && !turrets[selectedTurret].isDraged) || selectedTurret == null){
        if(selectedTurret != null){
            turrets[selectedTurret].isClicked = false;
        }
        turrets.push(tempTurret);
        selectedTurret = turrets.length - 1;
        bottomMenu();
        console.log("turret is added!");
    }
    else {
        console.log("the current turret must be placed first!");
    }
}

window.onload = function(){
    
    //variables
    var mouseClick = false;
    var enemyIndexLoop = 0, enemycounter = 0, ammountOfEnemies = 25;

    //do functions
    load();
    GameLoop();
    renderBackground();
    
    //mouse events
    canvas.addEventListener('mousemove', function(event){
        mousePos = Vector.create(event.clientX, event.clientY);
    });
    canvas.addEventListener('click', mouseClickfunc);
    function mouseClickfunc(){
        console.log("mouse is clicked");
        mouseClick = true;
    }


    //functions
    function shoot(turret){
        for(var i = 0; i < turret.type; i++){
            var bulletPos, angle, bullet;
            if(turret.type <= 2){
                //it shoots from minimum two barrels.. the angle should be the same!
                //(pos, speed, direction, damage)
                bulletPos = Vector.create(turret.circle.center.x + Math.cos(turret.angle + Math.PI / 2) * turret.image.width/2, turret.circle.center.y + Math.sin(turret.angle + Math.PI / 2) * turret.image.width/2);
                if(turret.type == 2){
                    var index = (i == 0) ? 1 : -1;
                    angle = Math.PI / 2;
                    var addThis = Vector.create(Math.cos(angle) * index * turret.image.width/4, Math.sin(angle) * index * turret.image.width/4);
                    bulletPos.addTo(addThis);
                }
                bullet = Bullet.create(bulletPos, turret.bulletSpeed, turret.angle + Math.PI / 2, turret.damage);
                bullets.push(bullet);
            }
            else {
                angle = Math.PI * 2 / turret.type * i + turret.angle;
                bulletPos = Vector.create(turret.circle.center.x + Math.cos(angle) * turret.image.width/2, turret.circle.center.y + Math.sin(angle) * turret.image.width/2);

                bullet = Bullet.create(bulletPos, turret.bulletSpeed, angle, turret.damage);
                bullets.push(bullet);
            }
        }
    }
    function addEnemy(){
        var enemyIndex = 3;//Math.round(Math.random() * 4);//(enemyImages.length - 1));//for now.. just a circle will do as an enemy
        var tempEnemy = Enemy.create(MapPoints,19, 1 + Math.round(14 * Math.random()), 4 * Math.random() + 1);//enemyImages[enemyIndex]
        enemies.push(tempEnemy);
    }
    function load(){
        loadMap();
    }

    function update(){
        enemyIndexLoop++;//10 + (level <= 50) ? 350 * Math.random() + 220 * Math.random() - 60 * level * Math.random() + 130 : 80 * Math.random()
        if((enemyIndexLoop >= 120) && enemycounter <= ammountOfEnemies){
            enemycounter++;
            enemyIndexLoop = 0;
            addEnemy();
        }
        else if(enemycounter > ammountOfEnemies){
            level++;
            //enemycounter = 0;
            //ammountOfEnemies = 25 + 5 * level + 50 * Math.random();
        }
        for(var i = 0; i < enemies.length; i++){
            enemies[i].update();
            if(enemies[i].hit){
                //lives--;
            }
            if(enemies[i].health <= 0){
                enemies.splice(i, 1);//remove it!
                i--;
            }
        }
        for(var i = 0; i < bullets.length; i++){
            bullets[i].update();
            for(var j = 0; j < enemies.length; j++){
                try{
                if(enemies[j].circle.pointCollision(bullets[i].position)){
                    //mayby do a rayline.. (see if the line of the bullet is intersecting with the enemie)
                                    //the line is the pos and the prev pos.. but i think this will work just fine
                    enemies[j].health -= bullets[i].damage;
                    //mayby have explotion bullets later on!
                    bullets.splice(i, 1);
                    i--;
                }
                }catch(e){}//cheap.. but quick solution!
            }
        }
        for(var i = 0; i < turrets.length; i++){
            if(turrets[i].isDraged){
                
                turrets[i].drag(mousePos);
                var circle = turrets[i].circle;
                var k = 0;
                for(var j = 0; j < MapPoints.length - 1; j++){
                    var intersectValues = LineCircleIntersection(circle, MapPoints[j].position, MapPoints[j + 1].position);
                    if(intersectValues[0] >= 1){
                        k++;
                        if(turrets[i].fillcolor == "rgba(0, 0, 255, 0.2)"){
                            turrets[i].fillcolor = "rgba(255, 0, 0, 0.2)";
                        }
                    }
                }
                for(var j = 0; j < turrets.length; j++){
                    if(i != j && turrets[i].circle.circleCollision(turrets[j].circle)){
                        k++;
                        if(turrets[i].fillcolor == "rgba(0, 0, 255, 0.2)"){
                            turrets[i].fillcolor = "rgba(255, 0, 0, 0.2)";
                        }
                    }
                }
                if(k == 0){
                    if(turrets[i].fillcolor == "rgba(255, 0, 0, 0.2)"){
                        turrets[i].fillcolor = "rgba(0, 0, 255, 0.2)";
                    }
                    if(mouseClick){//no errors.. the turret is set!
                        console.log("clicked!");
                        turrets[i].isDraged = false;
                    }
                }
            }
            else {
                if(turrets[i].isClicked){
                    if(mouseClick && turrets[i].circle.pointCollision(mousePos)){
                        turrets[i].isDraged = true;
                        //the turret is clicked a second time... therfor it can be dragged!
                    }
                    else if(mouseClick){
                        //turret is not clicked!
                        turrets[i].isClicked = false;
                        selectedTurret = null;
                        bottomMenu(); //just to empty it
                        //the selected turret was not clicked!
                    }
                }
                else {//cant shoot when picking it up..
                    if(mouseClick && turrets[i].circle.pointCollision(mousePos) && selectedTurret == null){
                        selectedTurret = i;
                        turrets[i].isClicked = true;
                        bottomMenu();
                        //this turret was selected!
                    }
                }
                //console.log("hej");
                turrets[i].update(enemies);
                if(turrets[i].shoot){
                    turrets[i].shoot = false;
                    shoot(turrets[i]);
                }
            }
        }
        
        if(mouseClick){//just for the toggle experience.. 
            //prob exist a better solution... but this will do just fine!
            mouseClick = false;
        }
    }

    function render(){
        context.clearRect(0, 0, width, height);

        for(var i = 0; i < turrets.length; i++){
            turrets[i].render(context);
        }
        enemies.forEach(function(enemy){
            enemy.render(context);
        });
        bullets.forEach(function(bullet){
            bullet.render(context);
        });
    }

    function renderBackground(){
        bContext.fillStyle = "rgb(94, 213, 52)";
        bContext.rect(0, 0, width, height);
        bContext.fill();

        for(var i = 0; i < imgBricks.length; i++){
            imgBricks[i].render(bContext);
        }

    }

    //the very heart!
    function GameLoop(){
        if(lives > 0){
            update();   
        }
        else if(lives != -1){
            lives = -1;
            //draw something on the bContext... (game over..)
        }
    	render();

    	requestAnimationFrame(GameLoop);
    }
}
