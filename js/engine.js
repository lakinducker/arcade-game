/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    };

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        //reset(); not used
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
        checkGrabables();
        checkLives();
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
        gem.update();
        heart.update();
        game.inc_time_playing();
        if (game.get_time_playing() % 3000 === 0 && allEnemies.length < 20) {
            allEnemies.push(new Enemy());
        }
        if (game.get_time_playing() < 3000 && allEnemies.length > 5) {
            allEnemies.pop();
        }
    }


    /* This function checks if any bugs collide with player.
     * It calls the dist function, which calculates the distance between two objects
     */
    function checkCollisions() {
        allEnemies.forEach(function(enemy) {
            var x_dist = Math.abs(enemy.get_loc()[0] - player.get_loc()[0]);
            var y_dist = Math.abs(enemy.get_loc()[1] - player.get_loc()[1]);
            if (x_dist < 80 && y_dist < 60) {
                enemy.turn_around();
                player.die();
            }
        });
    }

    // Function checks to see if there is anything to grab
    function checkGrabables() {

        // gems
        var x_dist = Math.abs(gem.get_loc()[0] - player.get_loc()[0]);
        var y_dist = Math.abs(gem.get_loc()[1] - player.get_loc()[1]);
        if (x_dist < 80 && y_dist < 60) {
            player.grab('gem');
            gem.spawn();
        }

        // hearts
        var x_dist = Math.abs(heart.get_loc()[0] - player.get_loc()[0]);
        var y_dist = Math.abs(heart.get_loc()[1] - player.get_loc()[1]);
        if (x_dist < 80 && y_dist < 60) {
            player.grab('heart');
            heart.spawn();
        }

        // make sure no gems or hearts are spawned on top of each other
        var x_dist = Math.abs(gem.get_loc()[0] - heart.get_loc()[0]);
        var y_dist = Math.abs(gem.get_loc()[1] - heart.get_loc()[1]);
        if (x_dist < 80 && y_dist < 60) {
            if (game.get_last_grab() === 'gem') {
                heart.spawn();
            } else {
                gem.spawn();
            }
        }
    }

    // check how many lives player has
    function checkLives() {
        if (game.get_lives() <= 0) {
            game.set_game_on(false);
        }
    }



    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        // render the score board
        ctx.font = '14pt calibri';
        ctx.fillStyle = 'darkblue';
        ctx.fillText('Lives: ' + game.get_lives(), 10 + 0*TILE[0], 570);
        ctx.fillText('Score: ' + game.get_score(), 10 + 1*TILE[0], 570);
        ctx.fillText('Across: ' + game.get_crossed(), 10 + 2*TILE[0], 570);
        ctx.fillText('Gems: ' + game.get_gems_grabbed(), 10 + 3*TILE[0], 570);
        ctx.fillText('Hearts: ' + game.get_hearts_grabbed(), 10 + 4*TILE[0], 570);


        /*
        Check if the game is still on.
        If the game is on, the renderEntities function is called, which renders the game objects.
        If it is not and, thus, the game is over or not started, the message is
        displayed. This message gives instructions how to play and start the game.
         */
        if (game.get_game_on()) {
            renderEntities();
        } else {
            /*
            Game message. I used TILEs as a location reference rather than just pixels.
            If there is an offset, it is added.
             */
            ctx.beginPath();
            ctx.rect(1*TILE[0],  1*TILE[1] + 50, 3*TILE[0], 4*TILE[1]);
            ctx.fillStyle = '#FFF';
            ctx.fill();
            ctx.lineWidth = 7;
            ctx.strokeStyle = '#66C';
            ctx.stroke();
            ctx.fillStyle = 'darkred';
            if (game.get_lives() === 0) {
                ctx.fillText('GAME OVER. PLAY AGAIN!', 1*TILE[0] + 20, 2*TILE[1] + 30);
            } else {
                ctx.fillText('PLAY THE GAME!', 2*TILE[0] - 30, 2*TILE[1] + 30);
            }
            ctx.fillText('The game is simple. You start with', 1*TILE[0] + 10, 3*TILE[1]);
            ctx.fillText('9 lives. Grab a heart, gain 1 life.', 1*TILE[0] + 10, 3*TILE[1] + 40);
            ctx.fillText('Grab a gem or cross to the water,', 1*TILE[0] + 10, 3*TILE[1] + 80);
            ctx.fillText('gain 1 point. Use arrow keys to move.', 1*TILE[0] + 10, 3*TILE[1] + 120);
            ctx.fillText('Click the screen to start the game.', 1*TILE[0] + 10, 3*TILE[1] + 160);
        }
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {

        // render gem
        gem.render();

        // render heart
        heart.render();

        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        // render player
        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    /*
    not used
    function reset() {
        // noop
    }
    */

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/enemy-bug2.png',
        'images/char-horn-girl.png',
        'images/GemBlue.png',
        'images/GemGreen.png',
        'images/GemOrange.png',
        'images/HeartRed.png',
        'images/HeartGold.png',
        'images/HeartPurple.png'
    ])
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
