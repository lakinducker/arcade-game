// Initialize variables

// Constant: tile size accessed by player when moving
var TILE = [101, 83];

// Game class. I created a Game class so that I can avoid global variables. Below the game object is instantiated.
// The methods for the Game class allow for setting and updating things such as lives, score, etc.
var Game = function() {
    // Variables applied to each of our instances go here
    // initialize game variables
    this.game_on = false;
    this.time_playing = 0;
    this.lives = 9;
    this.score = 0;
    this.crossed = 0;
    this.gems_grabbed = 0;
    this.hearts_grabbed = 0;
    // this variable stores the last thing grabbed by the player
    this.last_grab = '';
};

// Set game_on
Game.prototype.set_game_on = function(value) {
    this.game_on = value;
};

// Get game_on
Game.prototype.get_game_on = function() {
    return this.game_on;
};

// Increment the time_playing
Game.prototype.inc_time_playing = function() {
    this.time_playing++;
};

// Get the time_playing
Game.prototype.get_time_playing = function() {
    return this.time_playing;
};

// Get lives remaining in game
Game.prototype.get_lives = function() {
    return this.lives;
};

// Decrement life method
Game.prototype.dec_life = function() {
    if (game.get_lives() > 0) {
        this.lives -= 1;
    }
};

// Increment life method
Game.prototype.inc_life = function() {
    if (game.get_lives() > 0) {
        this.lives++;
    }
};

// Increment score count
Game.prototype.inc_score = function() {
    this.score++;
};

// Get score of the game
Game.prototype.get_score = function() {
    return this.score;
};

// Increment crossed count
Game.prototype.inc_crossed = function() {
    this.crossed++;
};

// Get the count of times crossed
Game.prototype.get_crossed = function() {
    return this.crossed;
};

// Increment gems_grabbed count
Game.prototype.inc_gems_grabbed = function() {
    this.gems_grabbed++;
};

// Get the count of gems_grabbed
Game.prototype.get_gems_grabbed = function() {
    return this.gems_grabbed;
};

// Increment hearts_grabbed count
Game.prototype.inc_hearts_grabbed = function() {
    this.hearts_grabbed++;
};

// Get the count of hearts_grabbed
Game.prototype.get_hearts_grabbed = function() {
    return this.hearts_grabbed;
};

// Set the last_grab
Game.prototype.set_last_grab = function(thing) {
    this.last_grab = thing;
};

// Get the last_thing
Game.prototype.get_last_grab = function(thing) {
    return this.last_grab;
};

// Handle click
// Get the last_thing
Game.prototype.handleClick = function() {
    if (this.game_on === false) {
        // re-initialize game variables
        this.game_on = true;
        this.time_playing = 0;
        this.bug_lanes = 3;
        this.lives = 9;
        this.score = 0;
        this.crossed = 0;
        this.gems_grabbed = 0;
        this.hearts_grabbed = 0;
        // this variable stores the last thing grabbed by the player
        this.last_grab = '';
        // this variable stores the last thing to happen to the player
        this.last_thing = '';
    };
};







// Random choice from an array
function randomChoice(a) {
    return a[Math.floor(Math.random() * a.length)];
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Check if number is even
function isEven(n) {
   return (n % 2 == 0);
}


// randomize bug location and velocity
function randomizeBug() {
    // randomized bug x; starts at off canvas in random position
    var bug_x = getRandomInt(-200, -50);
    
    // go down one of 3 lanes
    var lane = getRandomInt(0, 3);
    var bug_y = 62 + lane * TILE[1];
    
    // set direction
    var direction;
    if (isEven(lane)) {
        direction = 1;
        bug_x = -200;
    } else {
        direction = -1;
        bug_x = 806;
    }
    
    // random velocity
    var bug_vel = (Math.random() + 0.5) * 300 * direction;
    
    // return array of bug parameters
    return [bug_x, bug_y, bug_vel]    
}





// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    
    // randomize the bug; get randomized bug params from randomizeBug() function
    bug_params = randomizeBug();
    this.x = bug_params[0];
    this.y = bug_params[1];
    this.vel = bug_params[2];

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

/*
 Update the enemy's position
 Parameter: dt, a time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    /*
     Any movement is multiplied by the dt parameter
     which will ensure the game runs at the same speed for
     all computers.
     */
    if (this.x >= -200 && this.x <= 806) {
        // update movement to right base on enemies velocity
        this.x = this.x + (this.vel * dt);
    } else {
        // randomize the bug again; get randomized bug params from randomizeBug() function
        bug_params = randomizeBug();
        this.x = bug_params[0];
        this.y = bug_params[1];
        this.vel = bug_params[2];
    }
    
    // update bug sprite
    if (this.vel < 0) {
        // bug going left
        this.sprite = 'images/enemy-bug2.png';
    } else {
        //  bug going right
        this.sprite = 'images/enemy-bug.png';
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Get location of enemy
Enemy.prototype.get_loc = function() {
    // returns center; adds an offset to calculate the center of enemy
    return [this.x, this.y];
};

// Turn_around. This turns around the bug simply by multiplying the bug velocity by -1.
Enemy.prototype.turn_around = function() {
    this.vel = this.vel * -1;
};





/*
 Player class
 This class requires an update(), render() and
 a handleInput() method.
 */
var Player = function() {
    // Variables applied to each of our instances
    
    // player position
    this.pos = [2, 5];

    // The image/sprite for our enemies, this uses
    // a helper function that loads images
    this.sprite = 'images/char-horn-girl.png';
};
// Update player's position
Player.prototype.update = function() {
    // update player's position
    this.x = this.pos[0] * TILE[0];
    this.y = this.pos[1] * TILE[1] - 10; // 10 for offset
    
    // if player makes it to the water reset position and increment score
    if (this.pos[1] === 0) {
        this.pos = [2, 5];
        game.inc_score();;
        game.inc_crossed();
    }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handle player input
Player.prototype.handleInput = function(keyCode) {
    // Check key and check if the player is next to the edge of the game board to avoid moving off the screen.
    if (keyCode === 'left' && this.pos[0] > 0) {
        this.pos[0] = this.pos[0] - 1;
    } else if (keyCode === 'up' && this.pos[1] > 0) {
        this.pos[1] = this.pos[1] - 1;
    } else if (keyCode === 'right' && this.pos[0] < 4) {
        this.pos[0] = this.pos[0] + 1;
    } else if (keyCode === 'down' && this.pos[1] < 5) {
        this.pos[1] = this.pos[1] + 1;
    }
}

// Get location of player
Player.prototype.get_loc = function() {
    return [this.x, this.y];
};

// Player die method: When death occurs the player is moved back to the starting position and lives is decremented.
Player.prototype.die = function() {
    // starting position
    this.pos = [2, 5];
    // decrement player's lives
    game.dec_life();
};

// Player grab method
Player.prototype.grab = function(thing) {
    // The player methods called depend on what is grabbed.
    if (thing === 'gem') {
        // Increment score and gems_grabbed count
        game.inc_score();
        game.inc_gems_grabbed();
    } else if (thing === 'heart') {
        // Increment lives and hearts_grabbed count
        game.inc_life();
        game.inc_hearts_grabbed();
    }
    /*
    This is set so that the game knows what was grabbed last. This is so that we can avoid to prizes
    (i.e. gems or hearts) from being spawned in the same location. This is used in the checkGrabables
    function in engine.js.
     */
    game.set_last_grab(thing);
};




/*
Prize class. This the superclass for gems and hearts. The subclasses (i.e. the Gem and Heart classes)
inherit all these properties and methods.
 */
var Prize = function(img) {

    // Prize position
    this.pos = [getRandomInt(0, 5), getRandomInt(1, 4)];

    // The image/sprite for our prize
    this.sprite = img;
};

Prize.prototype.update = function() {
    // update prize's position
    this.x = this.pos[0] * TILE[0];
    this.y = this.pos[1] * TILE[1] - 8; // 8 for offset
};

// Draw the prize on the screen
Prize.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Get location of prize
Prize.prototype.get_loc = function() {
    return [this.x, this.y];
};

// Get position of prize
Prize.prototype.get_pos = function() {
    return this.pos;
};


// Gem is a pseudoclassical subclass of the Prize class
var Gem = function(img) {
    Prize.call(this, img);
};
Gem.prototype = Object.create(Prize.prototype);
Gem.prototype.constructor = Gem;

// Re-spawn in different location
Gem.prototype.spawn = function() {
    // New gem sprite. 3 different sprite images. Each time a new gem is spawned it will use a different sprite image.
    var gem_images = ['images/GemBlue.png',
                      'images/GemGreen.png',
                      'images/GemOrange.png'];
    var search_term = this.sprite;
    // Remove current sprite from choices
    for (var i=gem_images.length-1; i>=0; i--) {
        if (gem_images[i] === search_term) {
            gem_images.splice(i, 1);
        }
    }
    // The new sprite image is generated using the randomChoice function.
    this.sprite = randomChoice(gem_images);
    
    // The new position generated using the getRandomInt function.
    this.pos = [getRandomInt(0, 5), getRandomInt(1, 4)];
};



// Heart is a pseudoclassical subclass of the Prize class
var Heart = function(img) {
    Prize.call(this, img);
};
Heart.prototype = Object.create(Prize.prototype);
Heart.prototype.constructor = Heart;

// Re-spawn in different location
Heart.prototype.spawn = function() {
    // New heart sprite. 3 different sprite images. Each time a new heart is spawned it will use a different sprite image.
    var heart_images = ['images/HeartRed.png',
                        'images/HeartGold.png',
                        'images/HeartPurple.png'];
    var search_term = this.sprite;
    // Remove current sprite from choices
    for (var i=heart_images.length-1; i>=0; i--) {
        if (heart_images[i] === search_term) {
            heart_images.splice(i, 1);
        }
    }
    // The new sprite image is generated using the randomChoice function.
    this.sprite = randomChoice(heart_images);

    // The new position generated using the getRandomInt function.
    this.pos = [getRandomInt(0, 5), getRandomInt(1, 4)];
};



// Instantiate objects.

// Instantiate game object
game = new Game();

// Place all enemy objects in an array called allEnemies
var allEnemies = [];
// create enemy objects and push them into the allEnemies array
for (var i = 0; i < 5; i++) {
   allEnemies.push(new Enemy());
};

// Place the player object in a variable called player
player = new Player();

// Place a Gem object in a variable called gem
gem = new Gem('images/GemBlue.png');

// Place a Heart object in a variable called heart
heart = new Heart('images/HeartRed.png');


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// This listens for a click that will restart the game when the game is not active
document.addEventListener('click', function() {

    ;

    game.handleClick();
});