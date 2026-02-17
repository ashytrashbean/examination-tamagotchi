// User interactives to make pet
let petName = document.querySelector('#name');
const randName = document.querySelector('#rand');
let animalType = document.querySelector('#animalSel');
const addPet = document.querySelector('#petAdd');

// Progress bars for pet
let energyProg = document.querySelector('#energy');
let fullProg = document.querySelector('#fullness');
let happyProg = document.querySelector('#hapiness');

let energyValue = document.querySelector('#energyValue');
let fullnessValue = document.querySelector('#fullnessValue');
let hapinessValue = document.querySelector('#hapinessValue');

// Interaction buttons for pet
const sleepBtn = document.querySelector('#sleep');
const playBtn = document.querySelector('#play');
const eatBtn = document.querySelector('#eat');

// Activity log for pet
const activityLog = document.querySelector('#activityLog');

// Pet properties
let petTitle = document.querySelector('#text');
let petImg = document.querySelector('#animImg');

// Ui elements
let prevBtn = document.querySelector('#prev');
let nextBtn = document.querySelector('#next');
let petIndex = document.querySelector('#page');




// Pet class to create pet objects with properties and methods
class Pet{
    constructor(name,animType){
        this.name = name;
        this.animType = animType;
        this.energy = 50;
        this.fullness = 50;
        this.hapiness = 50;
        this.timerID = null;
        this.startTimer();
    }

    // Method to set pet image based on selected animal type    
    petType(){
        if(this.animType === "dog"){
            petImg.src = "./animals/idle_dog.gif"
        }else if(this.animType === "cat"){
            petImg.src = "./animals/cat_idle.gif"
        }else if(this.animType === "hamster"){
            petImg.src = "./animals/Hamster.png"
        }else if(this.animType === "horse"){
            petImg.src = "./animals/Horse.png"
        }
    }

    // Method to start a timer that decreases pet's stats every 5 seconds and checks for neglect
    startTimer(){
        this.timerID = setInterval(()=>{   
            this.energy -= 10;
            this.fullness -= 10;
            this.hapiness -= 10;
            this.updateProgress();
            this.logActivity(`${this.name}'s stats have decreased.`);

            if(this.energy <= 0 || this.fullness <= 0 || this.hapiness <= 0){
                clearInterval(this.timerID);
                this.logActivity(`${this.name} ran away due to neglect!`);

                const index = pets.indexOf(this);
                if(index > -1){
                    pets.splice(index, 1);
                    petImg.src = "";
                    petTitle.innerText = "No pet selected";
                    energyProg.value = 0;
                    fullProg.value = 0;
                    happyProg.value = 0;
                    addPet.disabled = false;

                    this.updateProgress();
                }
            }
        }, 10000);
    }

    // Method to log pet activities with timestamps in the activity log textarea

    logActivity(activity){
        const timestamp = new Date().toLocaleTimeString();
        activityLog.value += `[${timestamp}] ${activity}\n`;
        activityLog.scrollTop = activityLog.scrollHeight;
    }

    // Methods for pet interactions that update stats, progress bars, and log activities
    nap(){
        clearInterval(this.timerID);

        this.energy += 40;
        this.hapiness -= 10;
        this.fullness -= 10;
        
        if(this.animType === "dog"){
            petImg.src = "./animals/dog_sleep.gif";
            setTimeout(() => {
                petImg.src = "./animals/idle_dog.gif";
            }, 5000);
        }

        this.updateProgress();
        this.logActivity(`${this.name} took a nap.`);
        this.startTimer();
    }

    play(){
        clearInterval(this.timerID);

        this.hapiness += 30;
        this.energy -= 10;
        this.fullness -= 10;

        this.updateProgress();
        this.logActivity(`${this.name} played and had fun!`);
        this.startTimer();
    }

    eat(){
        clearInterval(this.timerID);

        this.fullness += 30;
        this.hapiness += 5;
        this.energy -= 15;

        if(this.animType === "dog"){
            petImg.src = "./animals/dog_eat.gif";
            setTimeout(() => {
                petImg.src = "./animals/idle_dog.gif";
            }, 2000);
        }

        this.updateProgress();
        this.logActivity(`${this.name} ate some food and feels satisfied.`);
        this.startTimer();
    }

    // Method to update the progress bars based on pet's current stats
    updateProgress(){
        energyValue.innerText = this.energy;
        fullnessValue.innerText = this.fullness;
        hapinessValue.innerText = this.hapiness;
        energyProg.value = this.energy;
        fullProg.value = this.fullness;
        happyProg.value = this.hapiness;
    }

    static async randomPetName(){
        try {
        const response = await fetch('https://randomuser.me/api/0.8');
        const data = await response.json();
        return data.results[0].user.name.first.charAt(0).toUpperCase() + data.results[0].user.name.first.slice(1);
        } catch (error) {
            console.error('Error fetching random name:', error);
            return "Pet";
        }
    }
}

randName.addEventListener('click',async ()=>{
    petName.value = "";
    petName.value = await Pet.randomPetName();
})

// Index of pets array to keep track of current pet
let pets = [];
let currentPetIndex = 0;

// Function to update the UI with the current pet's information
function updateUI(){
    if(pets.length > 0){
        const currentPet = pets[currentPetIndex];
        petTitle.innerText = currentPet.name;
        currentPet.petType();
        currentPet.updateProgress();
        petIndex.innerText = `${currentPetIndex + 1}/${pets.length}`;
    }
}

// Event listeners for navigating between pets
prevBtn.addEventListener('click',()=>{
    if(pets.length > 0){
        currentPetIndex --;
        if(currentPetIndex < 0){
            currentPetIndex = pets.length - 1;
        }
        updateUI();
    } 
})

nextBtn.addEventListener('click',()=>{
    if(pets.length > 0){
        currentPetIndex ++;
        if(currentPetIndex >= pets.length){
            currentPetIndex = 0;
        }
        updateUI();
    }
})

// Event listeners for pet interactions

sleepBtn.addEventListener('click',()=>{
    if(pets.length > 0){
        pets[currentPetIndex].nap();
    }
});

playBtn.addEventListener('click',()=>{
    if(pets.length > 0){
        pets[currentPetIndex].play();
    }
});

eatBtn.addEventListener('click',()=>{
    if(pets.length > 0){
        pets[currentPetIndex].eat();
    }
});


// To add a new pet to the pets array and update the UI accordingly
addPet.addEventListener('click',()=>{
    if(pets.length < 4){
        const pet = new Pet(petName.value,animalType.value);
        pet.petType();
        petTitle.innerText = pet.name;
        pets.push(pet);
        currentPetIndex = pets.length - 1;
        petIndex.innerText = `${currentPetIndex + 1}/${pets.length}`;
        petName.value = "";
    }else{
        alert("You can only have 4 pets!");
    }
    if(pets.length === 4){
        addPet.disabled = true;
    }
    

})