import './style.css';

const attackerJsons =  [
    'Ace.json',
    'Amaru.json',
    'Ash.json',
    'Blackbeard.json',
    'Blitz.json',
    'Brava.json',
    'Buck.json',
    'Capitao.json',
    'Dokkaebi.json',
    'Finka.json',
    'Flores.json',
    'Fuze.json',
    'Glaz.json',
    'Gridlock.json',
    'Grim.json',
    'Hibana.json',
    'Iana.json',
    'IQ.json',
    'Jackal.json',
    'Kali.json',
    'Lion.json',
    'Maverick.json',
    'Montagne.json',
    'Nokk.json',
    'Nomad.json',
    'Osa.json',
    'Ram.json',
    'Sens.json',
    'Sledge.json',
    'Thatcher.json',
    'Thermite.json',
    'Twitch.json',
    'Ying.json',
    'Zero.json',
    'Zofia.json'
];
const defenderJsons = [
    'Alibi.json',
    'Aruni.json',
    'Azami.json',
    'bandit.json',
    'Castle.json',
    'Caveira.json',
    'Clash.json',
    'Doc.json',
    'Echo.json',
    'Ela.json',
    'Fenrir.json',
    'Frost.json',
    'Goyo.json',
    'Jaeger.json',
    'Kaid.json',
    'Kapkan.json',
    'Lesion.json',
    'Maestro.json',
    'Melusi.json',
    'Mira.json',
    'Mozzie.json',
    'Mute.json',
    'Oryx.json',
    'Pulse.json',
    'Rook.json',
    'Smoke.json',
    'Solis.json',
    'Tachanka.json',
    'Thorn.json',
    'Thunderbird.json',
    'Tubarao.json',
    'Valkyrie.json',
    'Vigil.json',
    'Wamai.json',
    'Warden.json'
];

const defenderPlaystyles = [
    "Anchor",
    "Roamer",
    "Support",
    "Flex",
    "Spawn Peekers",
    "Turtle/Static",
    "Runnout"
];
const attackerPlaystyles = [
    "Entry Fragger",
    "Support",
    "Flank Watcher",
    "Intel Gatherer",
    "Supportive Entry",
    "Objective Hold",
    "Slow Push",
    "Solo Push",
    "Rush"
];

let currentMode = 'attacker'


// Function to fetch a random JSON file
async function fetchRandomJsonData() {
    const jsonFiles = currentMode === 'attacker' ? attackerJsons : defenderJsons;
    const randomFileName = jsonFiles[Math.floor(Math.random() * jsonFiles.length)];
    return await fetch(`/${currentMode}s/${randomFileName}`).then(response => response.json());
}


function setupApp() {
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
      <div id="button-container">
        <button id="toggle-mode">Switch to Defender</button>
        <button id="randomize">Randomize</button>
      </div>
      <div id="data-display"></div>
    `;

    const toggleButton = document.querySelector<HTMLButtonElement>('#toggle-mode')!;
    const randomizeButton = document.querySelector<HTMLButtonElement>('#randomize')!;

    toggleButton.addEventListener('click', () => {
        currentMode = currentMode === 'attacker' ? 'defender' : 'attacker';
        toggleButton.textContent = `Switch to ${currentMode === 'attacker' ? 'Defender' : 'Attacker'}`;
        updateDataDisplay(); // Update display when mode is toggled
    });

    randomizeButton.addEventListener('click', () => {
        updateDataDisplay(); // Update display when randomize is clicked
    });

    updateDataDisplay(); // Initial data display update
}

async function updateDataDisplay() {
    const data = await fetchRandomJsonData();
    const dataDisplayElement = document.querySelector<HTMLDivElement>('#data-display');
    dataDisplayElement!.innerHTML = ''; // Clear previous content

    // Generate randomized loadout for the operator
    const operatorLoadout = generateRandomLoadout(data);

    // Create container to hold operator name and icon
    const operatorContainer = document.createElement('div');
    operatorContainer.style.display = 'flex'; // Make the container a flexbox
    operatorContainer.style.alignItems = 'center'; // Center the items vertically
    operatorContainer.style.justifyContent = 'center'; // Center the items horizontally
    dataDisplayElement?.appendChild(operatorContainer);

    // Create element to display operator name
    const operatorNameElement = document.createElement('h2');
    operatorNameElement.textContent = operatorLoadout.name;
    operatorContainer.appendChild(operatorNameElement);

    // Fetch operator icon
    const operatorIconElement = document.createElement('img');
    fetchOperatorIcon(operatorLoadout.svgName.toLowerCase()).then(svgData => {
        operatorIconElement.src = `data:image/svg+xml,${encodeURIComponent(svgData)}`;
        operatorIconElement.alt = `${operatorLoadout.name} Icon`;
        operatorIconElement.style.width = '80px'; // Set width of the icon
        operatorIconElement.style.height = '80px'; // Set height of the icon
        operatorIconElement.style.marginLeft = '5px'; // Add margin to the left for spacing
        operatorContainer.appendChild(operatorIconElement);
    });

    // Create elements to display loadout details
    const primaryWeaponElement = document.createElement('p');
    primaryWeaponElement.textContent = `${operatorLoadout.primary}`;
    dataDisplayElement?.appendChild(primaryWeaponElement);

    const secondaryWeaponElement = document.createElement('p');
    secondaryWeaponElement.textContent = `${operatorLoadout.secondary}`;
    dataDisplayElement?.appendChild(secondaryWeaponElement);

    const gadgetElement = document.createElement('p');
    gadgetElement.textContent = `${operatorLoadout.gadget}`;
    dataDisplayElement?.appendChild(gadgetElement);

    const uniqueGadgetElement = document.createElement('p');
    uniqueGadgetElement.textContent = `${operatorLoadout.unique_gadget}`;
    dataDisplayElement?.appendChild(uniqueGadgetElement);

    const playstyleElement = document.createElement('p');
    playstyleElement.textContent = `${getRandomPlaystyle().toUpperCase()}`;
    dataDisplayElement?.appendChild(playstyleElement);
}


function generateRandomLoadout(operatorData: any) {
    const primaryWeapon = getRandomItem(operatorData.primary);
    const secondaryWeapon = getRandomItem(operatorData.secondary);
    const gadget = getRandomItem(operatorData.gadget);

    return {
        svgName: operatorData.name,
        name: operatorData.nameShown, // Convert name to uppercase
        primary: randomizeWeapon(primaryWeapon),
        secondary: randomizeWeapon(secondaryWeapon),
        gadget: gadget.name.toUpperCase(), // Convert gadget name to uppercase
        unique_gadget: operatorData.unique_gadget.toUpperCase() // Convert unique gadget name to uppercase
    };
}

function getRandomItem(items: any[]) {
    return items[Math.floor(Math.random() * items.length)];
}

function randomizeWeapon(weapon: any) {
    const name = weapon.name.toUpperCase(); // Convert weapon name to uppercase
    const sight = (getRandomItem(weapon.sight) || 'No Sight').toUpperCase(); // Convert sight to uppercase
    const barrel = (getRandomItem(weapon.barrel) || 'No Barrel').toUpperCase(); // Convert barrel to uppercase
    const grip = (getRandomItem(weapon.grip) || 'No Grip').toUpperCase(); // Convert grip to uppercase
    const under_barrel = (getRandomItem(weapon.under_barrel) || 'No Underbarrel').toUpperCase(); // Convert under_barrel to uppercase

    // Construct the output string
    const output = `
        ${name}\n
        ${sight}\n
        ${barrel}\n
        ${grip}\n
        ${under_barrel}\n
    `.trim(); // Remove leading/trailing whitespace

    return output;
}

function getRandomPlaystyle() {
    const playstyles = currentMode === 'attacker' ? attackerPlaystyles : defenderPlaystyles;
    return playstyles[Math.floor(Math.random() * playstyles.length)];
}

async function fetchOperatorIcon(operator: string) {
    const response = await fetch(`https://r6operators.marcopixel.eu/icons/svg/${operator}.svg`);
    const svgData = await response.text();
    return svgData;
}

setupApp();