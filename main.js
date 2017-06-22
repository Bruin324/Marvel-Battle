console.log('Hello World!');

var PUBLIC_KEY = "5e95afa5349a935d4aa5c656081f8e54";
var PRIV_KEY = "2f92590b5ff1d02a9a0040c19ad10d71a8093c6e";

var playerCard = document.querySelector('.player1');
var randomCard = document.querySelector('.cpu')
var fightButton = document.querySelector('#fight-button');
var attackDescription = document.querySelector('.attack-description')

var randomCharacter = {};
var loadedCharacters = [];


//Gets data from Marvel API
function getMarvelResponse() {

  var ts = new Date().getTime();
  var hash = md5(ts + PRIV_KEY + PUBLIC_KEY).toString();
  var url = 'http://gateway.marvel.com:80/v1/public/characters';

  $.getJSON(url, {
    ts: ts,
    apikey: PUBLIC_KEY,
    hash: hash,
    limit: 100,
    events: 238
    // events: "Civil War"
    // name: "Spider-Man"
  }).done(function(data) {
    var characters = data.data.results
    console.log(characters[3])
    buildCharacters(characters);

  }).fail(function(err) {
    console.log(err);
  });
};

function startBattle (event) {
  // console.log('startBattle', selectedCharacter.healthValue, selectedCharacter.strengthValue);
  var randomCharacter = loadedCharacters[Math.floor(Math.random() * loadedCharacters.length)];
  attackDescription.innerHTML = '';
  console.log(randomCharacter);

  randomCard.innerHTML = "";
  var randomImg = document.createElement('img')
  randomImg.src = randomCharacter.thumbnail.path + "/landscape_xlarge." + randomCharacter.thumbnail.extension;
  $(randomCard).append(randomImg)

  var randomDetail = document.createElement('div');
  randomDetail.className = "random-detail";
  $(randomCard).append(randomDetail)

  var randomName = document.createElement('div');
  randomName.className = "character-text character-name"
  randomName.innerHTML = randomCharacter.name;
  $(randomDetail).append(randomName);

  var randomHealth = document.createElement('div');
  randomHealth.className = "character-text character-health"
  randomHealth.textContent = "Health: " + randomCharacter.healthValue
  $(randomDetail).append(randomHealth);

  var randomStrength = document.createElement('div');
  randomStrength.className = "character-text character-strength"
  randomStrength.textContent = "Strength: " + randomCharacter.strengthValue
  $(randomDetail).append(randomStrength);

  var originalPlayerHealth = selectCharacter.healthValue;
  var originalCPUHealth = randomCharacter.healthValue;
  console.log('OPlayerHealth: ', originalPlayerHealth);
  console.log('OCPUHealth: ', originalCPUHealth);
  console.log('FPlayerHealth: ', selectCharacter.healthValue);
  console.log('FCPUHealth: ', randomCharacter.healthValue);

  fightButton.removeEventListener('click', startBattle);
  fightButton.textContent = "ATTACK";

  fightButton.addEventListener('click', attack);

  console.log(randomCharacter)

  function attack (event) {
    if (selectedCharacter.healthValue > 0 && randomCharacter.healthValue > 0) {
      var playerAttackValue = Math.floor(Math.random()*(selectedCharacter.strengthValue));
      randomCharacter.healthValue -= playerAttackValue;
      var attackLine = selectedCharacter.name + ' attacks ' + randomCharacter.name + ' for ' + playerAttackValue + '. ' + randomCharacter.name + ' health is now ' + randomCharacter.healthValue + '<br>';
      attackDescription.innerHTML += attackLine;
      attackDescription.scrollTop = attackDescription.scrollHeight
      if (randomCharacter.healthValue <= 0) {
        attackDescription.innerHTML += '<strong>' + randomCharacter.name + ' is Dead.</strong><br>Select new player to play again.'
        attackDescription.scrollTop = attackDescription.scrollHeight
      } else {
        var randomAttackValue = Math.floor(Math.random()*(randomCharacter.strengthValue));
        selectedCharacter.healthValue -= randomAttackValue;
        var attackLine = randomCharacter.name + ' attacks  ' + selectedCharacter.name + ' for ' + randomAttackValue + '. ' + selectedCharacter.name + ' health is now ' + selectedCharacter.healthValue + '<br>';
        attackDescription.innerHTML += attackLine;
        attackDescription.scrollTop = attackDescription.scrollHeight
      }
      if (selectedCharacter.healthValue <= 0) {
        attackDescription.innerHTML += '<strong>' + selectedCharacter.name + ' is Dead.</strong><br>Select new player to play again.'
        attackDescription.scrollTop = attackDescription.scrollHeight
      }
    }
  }
}



//Adds clicked character to Player Battle Window, enables FIGHT button
function selectCharacter (event){
  document.querySelector('h1').scrollIntoView();
  playerCard.innerHTML = "";
  // console.log(event);
  selectedCharacter = loadedCharacters[event.target.parentNode.value - 1];
  // console.log(selectedCharacter);
  var playerImg = document.createElement('img')
  playerImg.src = selectedCharacter.thumbnail.path + "/landscape_xlarge." + selectedCharacter.thumbnail.extension;
  $(playerCard).append(playerImg)

  var playerDetail = document.createElement('div');
  playerDetail.className = "player-detail";
  $(playerCard).append(playerDetail)

  var playerName = document.createElement('div');
  playerName.className = "character-text character-name"
  playerName.innerHTML = selectedCharacter.name;
  $(playerDetail).append(playerName);

  var playerHealth = document.createElement('div');
  playerHealth.className = "character-text character-health"
  playerHealth.textContent = "Health: " + selectedCharacter.healthValue
  $(playerDetail).append(playerHealth);

  var playerStrength = document.createElement('div');
  playerStrength.className = "character-text character-strength"
  playerStrength.textContent = "Strength: " + selectedCharacter.strengthValue
  $(playerDetail).append(playerStrength);

  fightButton.disabled = false;
  fightButton.addEventListener('click', startBattle/*(selectedCharacter.healthValue, selectedCharacter.strengthValue)*/);
}

//Build index and display of characters
function buildCharacters(characters) {
  var divChars = document.querySelector('.characters')

  for (i = 0; i < characters.length; i++) {
    if (characters[i].thumbnail.path != 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available') {
      loadedCharacters.push(characters[i]);

      var characterCard = document.createElement('div');
      characterCard.className = "character-card";
      $(divChars).append(characterCard);

      var characterPic = document.createElement('div');
      characterPic.className = "character-pic"
      var characterButton = document.createElement('button');
      characterButton.value = loadedCharacters.length;
      characterButton.type = 'button';
      characterButton.className = 'character-button';
      var characterImg = document.createElement('img')
      characterImg.src = characters[i].thumbnail.path + "/landscape_xlarge." + characters[i].thumbnail.extension;
      $(characterCard).append(characterPic);
      $(characterPic).append(characterButton);
      $(characterButton).append(characterImg);

      var characterDetail = document.createElement('div');
      characterDetail.className = "character-detail";
      $(characterCard).append(characterDetail)

      var characterName = document.createElement('div');
      characterName.className = "character-text character-name"
      characterName.innerHTML = '<a href="' + characters[i].urls[1].url + '" target = "_blank">' + characters[i].name + '</a>';
      $(characterDetail).append(characterName);

      characters[i].healthValue = Math.floor(Math.random()*(100 - 10 + 1)) + 10;
      characters[i].strengthValue = Math.floor(Math.random()*(100 - 10 + 1)) + 10;

      var characterHealth = document.createElement('div');
      characterHealth.className = "character-text character-health"
      characterHealth.textContent = "Health: " + characters[i].healthValue
      $(characterDetail).append(characterHealth);

      var characterStrength = document.createElement('div');
      characterStrength.className = "character-text character-strength"
      characterStrength.textContent = "Strength: " + characters[i].strengthValue
      $(characterDetail).append(characterStrength);
    }
  }

  // console.log(loadedCharacters);

  var allImages = document.querySelectorAll('.character-button')
  // console.log(allImages);
  for (j = 0; j < allImages.length; j++) {
    allImages[j].addEventListener('click', selectCharacter)
  }
}
getMarvelResponse();
