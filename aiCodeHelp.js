// --- Tamagotchi Pet Simulator ---
// This code lets you create up to 4 pets, interact with them, and see their stats and activity log.
// Each pet has its own stats, animation state, and activity log. Only the active pet's log and animation are shown.

// --- DOM ELEMENTS ---
// Inputs and buttons for creating pets
let petName = document.querySelector('#name');
const randName = document.querySelector('#rand');
let animalType = document.querySelector('#animalSel');
const addPet = document.querySelector('#petAdd');

// Progress bars and stat values
let energyProg = document.querySelector('#energy');
let fullProg = document.querySelector('#fullness');
let happyProg = document.querySelector('#hapiness');
let energyValue = document.querySelector('#energyValue');
let fullnessValue = document.querySelector('#fullnessValue');
let hapinessValue = document.querySelector('#hapinessValue');

// Interaction buttons
const sleepBtn = document.querySelector('#sleep');
const playBtn = document.querySelector('#play');
const eatBtn = document.querySelector('#eat');

// Activity log textarea
const activityLog = document.querySelector('#activityLog');

// Pet display elements
let petTitle = document.querySelector('#text');
let petImg = document.querySelector('#animImg');

// Navigation buttons and pet index display
let prevBtn = document.querySelector('#prev');
let nextBtn = document.querySelector('#next');
let petIndex = document.querySelector('#page');

// --- PET CLASS ---
class Pet {
    constructor(name, animType) {
        this.name = name || "Pet"; // Pet's name
        this.animType = animType;  // Pet's species/type
        this.energy = 50;          // Initial stats
        this.fullness = 50;
        this.hapiness = 50;
        this.currentAnimation = 'idle'; // Animation state: 'idle', 'sleep', 'eat'
        this.timerID = null;       // Interval for stat decay
        this.animTimer = null;     // Timeout for animation
        this.isAnimating = false;  // Blocks interactions during animation
        this.activityLog = [];     // Stores this pet's activity log
        this.startTimer();         // Start stat decay
    }

    // Checks if this pet has an animation for a given action
    hasAnimation(action) {
        // Only dogs have sleep/eat animations in this example
        if (this.animType === "dog" && (action === "sleep" || action === "eat")) {
            return true;
        }
        // Add more logic here if you add more animated assets for other animals
        return false;
    }

    // Returns the correct image path based on pet type and current animation
    getImageSrc() {
        if (this.animType === "dog") {
            if (this.currentAnimation === "sleep") return "./animals/dog_sleep.gif";
            if (this.currentAnimation === "eat") return "./animals/dog_eat.gif";
            if (this.currentAnimation === "play") return "./animals/playing_dog.gif";
            return "./animals/idle_dog.gif";
        } else if (this.animType === "cat") {
            return "./animals/cat_idle.gif";
        } else if (this.animType === "hamster") {
            return "./animals/Hamster.png";
        } else if (this.animType === "horse") {
            return "./animals/Horse.png";
        }
        return "";
    }

    // Starts the stat decay timer (every 10 seconds)
    startTimer() {
        if (this.timerID) clearInterval(this.timerID);
        this.timerID = setInterval(() => {
            this.energy -= 10;
            this.fullness -= 10;
            this.hapiness -= 10;
            this.updateProgress();
            this.logActivity(`${this.name}'s stats have decreased.`);
            // If any stat reaches 0, pet runs away
            if (this.energy <= 0 || this.fullness <= 0 || this.hapiness <= 0) {
                clearInterval(this.timerID);
                this.timerID = null;
                if (this.animTimer) {
                    clearTimeout(this.animTimer);
                    this.animTimer = null;
                }
                this.logActivity(`${this.name} ran away due to neglect!`);
                // Remove pet from array and update UI
                const index = pets.indexOf(this);
                if (index > -1) {
                    pets.splice(index, 1);
                    if (pets.length === 0) {
                        petImg.src = "";
                        petTitle.innerText = "No pet selected";
                        energyProg.value = 0;
                        fullProg.value = 0;
                        happyProg.value = 0;
                        energyValue.innerText = 0;
                        fullnessValue.innerText = 0;
                        hapinessValue.innerText = 0;
                        addPet.disabled = false;
                        petIndex.innerText = `0/0`;
                        activityLog.value = "";
                    } else {
                        if (currentPetIndex >= pets.length) currentPetIndex = pets.length - 1;
                        updateUI();
                    }
                }
            }
        }, 10000);
    }

    // Adds an activity to this pet's log and updates the textarea if this is the active pet
    logActivity(activity) {
        const timestamp = new Date().toLocaleTimeString();
        const entry = `[${timestamp}] ${activity}`;
        this.activityLog.push(entry); // Store in this pet's log
        if (pets[currentPetIndex] === this) {
            this.showActivityLog();
        }
    }

    // Shows this pet's activity log in the textarea
    showActivityLog() {
        activityLog.value = this.activityLog.join('\n');
        activityLog.scrollTop = activityLog.scrollHeight;
    }

    // Nap interaction: blocks further actions if animation exists, otherwise instant
    nap() {
        if (this.isAnimating) return;
        const hasAnim = this.hasAnimation("sleep");
        if (this.timerID) { clearInterval(this.timerID); this.timerID = null; }
        this.energy += 40;
        this.hapiness -= 10;
        this.fullness -= 10;

        if (hasAnim) {
            this.isAnimating = true;
            this.currentAnimation = "sleep";
            if (pets[currentPetIndex] === this) {
                sleepBtn.disabled = playBtn.disabled = eatBtn.disabled = true;
                updateUI();
            }
            if (this.animTimer) clearTimeout(this.animTimer);
            this.animTimer = setTimeout(() => {
                this.currentAnimation = "idle";
                this.animTimer = null;
                this.isAnimating = false;
                if (pets[currentPetIndex] === this) {
                    sleepBtn.disabled = playBtn.disabled = eatBtn.disabled = false;
                    updateUI();
                }
                this.startTimer();
            }, 5000); // 5 seconds animation
        } else {
            this.currentAnimation = "idle";
            if (pets[currentPetIndex] === this) updateUI();
            this.startTimer();
        }
        this.updateProgress();
        this.logActivity(`${this.name} took a nap.`);
    }

    // Play interaction: triggers animation for dog, instant for others
    play() {
        if (this.isAnimating) return;
        const hasAnim = this.animType === "dog";
        if (this.timerID) { clearInterval(this.timerID); this.timerID = null; }
        this.hapiness += 30;
        this.energy -= 10;
        this.fullness -= 10;

        if (hasAnim) {
            this.isAnimating = true;
            this.currentAnimation = "play";
            if (pets[currentPetIndex] === this) {
                sleepBtn.disabled = playBtn.disabled = eatBtn.disabled = true;
                updateUI();
            }
            if (this.animTimer) clearTimeout(this.animTimer);
            this.animTimer = setTimeout(() => {
                this.currentAnimation = "idle";
                this.animTimer = null;
                this.isAnimating = false;
                if (pets[currentPetIndex] === this) {
                    sleepBtn.disabled = playBtn.disabled = eatBtn.disabled = false;
                    updateUI();
                }
                this.startTimer();
            }, 6500); // 6.5 seconds animation
        } else {
            this.currentAnimation = "idle";
            if (pets[currentPetIndex] === this) updateUI();
            this.startTimer();
        }
        this.updateProgress();
        this.logActivity(`${this.name} played and had fun!`);
    }

    // Eat interaction: blocks further actions if animation exists, otherwise instant
    eat() {
        if (this.isAnimating) return;
        const hasAnim = this.hasAnimation("eat");
        if (this.timerID) { clearInterval(this.timerID); this.timerID = null; }
        this.fullness += 30;
        this.hapiness += 5;
        this.energy -= 15;

        if (hasAnim) {
            this.isAnimating = true;
            this.currentAnimation = "eat";
            if (pets[currentPetIndex] === this) {
                sleepBtn.disabled = playBtn.disabled = eatBtn.disabled = true;
                updateUI();
            }
            if (this.animTimer) clearTimeout(this.animTimer);
            this.animTimer = setTimeout(() => {
                this.currentAnimation = "idle";
                this.animTimer = null;
                this.isAnimating = false;
                if (pets[currentPetIndex] === this) {
                    sleepBtn.disabled = playBtn.disabled = eatBtn.disabled = false;
                    updateUI();
                }
                this.startTimer();
            }, 2000); // 2 seconds animation
        } else {
            this.currentAnimation = "idle";
            if (pets[currentPetIndex] === this) updateUI();
            this.startTimer();
        }
        this.updateProgress();
        this.logActivity(`${this.name} ate some food and feels satisfied.`);
    }

    // Updates the progress bars and stat values, clamps stats to [0,100]
    updateProgress() {
        this.energy = Math.max(0, Math.min(100, this.energy));
        this.fullness = Math.max(0, Math.min(100, this.fullness));
        this.hapiness = Math.max(0, Math.min(100, this.hapiness));
        energyValue.innerText = this.energy;
        fullnessValue.innerText = this.fullness;
        hapinessValue.innerText = this.hapiness;
        energyProg.value = this.energy;
        fullProg.value = this.fullness;
        happyProg.value = this.hapiness;
    }

    // Fetches a random pet name from an API
    static async randomPetName() {
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

// --- PETS ARRAY AND INDEX ---
let pets = [];            // Array of all pets
let currentPetIndex = 0;  // Index of the currently selected pet

// --- UI UPDATE FUNCTION ---
// Updates all UI elements to show the current pet's info and log
function updateUI() {
    if (pets.length > 0) {
        const currentPet = pets[currentPetIndex];
        petTitle.innerText = currentPet.name;
        petImg.src = currentPet.getImageSrc();
        currentPet.updateProgress();
        petIndex.innerText = `${currentPetIndex + 1}/${pets.length}`;
        currentPet.showActivityLog(); // Show only this pet's log
        // Enable/disable addPet button if max pets reached
        addPet.disabled = pets.length >= 4;
        // Enable/disable interaction buttons if animating
        if (currentPet.isAnimating) {
            sleepBtn.disabled = playBtn.disabled = eatBtn.disabled = true;
        } else {
            sleepBtn.disabled = playBtn.disabled = eatBtn.disabled = false;
        }
    } else {
        petImg.src = "";
        petTitle.innerText = "No pet selected";
        petIndex.innerText = `0/0`;
        activityLog.value = "";
        addPet.disabled = false;
        sleepBtn.disabled = playBtn.disabled = eatBtn.disabled = true;
        energyProg.value = 0;
        fullProg.value = 0;
        happyProg.value = 0;
        energyValue.innerText = 0;
        fullnessValue.innerText = 0;
        hapinessValue.innerText = 0;
    }
}

// --- EVENT LISTENERS ---

// Generate a random pet name
randName.addEventListener('click', async () => {
    petName.value = "";
    petName.value = await Pet.randomPetName();
});

// Add a new pet (max 4)
addPet.addEventListener('click', () => {
    if (pets.length < 4) {
        const pet = new Pet(petName.value, animalType.value);
        pets.push(pet);
        currentPetIndex = pets.length - 1;
        updateUI();
        petName.value = "";
    } else {
        alert("You can only have 4 pets!");
    }
    if (pets.length === 4) {
        addPet.disabled = true;
    }
});

// Navigate to previous pet
prevBtn.addEventListener('click', () => {
    if (pets.length > 0) {
        currentPetIndex--;
        if (currentPetIndex < 0) {
            currentPetIndex = pets.length - 1;
        }
        updateUI();
    }
});

// Navigate to next pet
nextBtn.addEventListener('click', () => {
    if (pets.length > 0) {
        currentPetIndex++;
        if (currentPetIndex >= pets.length) {
            currentPetIndex = 0;
        }
        updateUI();
    }
});

// Pet interactions
sleepBtn.addEventListener('click', () => {
    if (pets.length > 0) {
        pets[currentPetIndex].nap();
    }
});

playBtn.addEventListener('click', () => {
    if (pets.length > 0) {
        pets[currentPetIndex].play();
    }
});

eatBtn.addEventListener('click', () => {
    if (pets.length > 0) {
        pets[currentPetIndex].eat();
    }
});

// --- INITIAL UI STATE ---
updateUI(); // Set initial UI state on page load

// --- END OF CODE ---

/*
    HOW THIS VERSION WORKS (SUMMARY):

    - Each pet has its own stats, animation state, and activity log.
    - Only the active pet's animation and log are shown.
    - Stat decay pauses during animations (if the pet has one).
    - Buttons are disabled during animations to prevent overlapping actions.
    - Activity log only shows the current pet's history.
    - Stats are clamped to [0,100].
    - You can have up to 4 pets at once.
    - Code is commented for clarity at every step.
*/