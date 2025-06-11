'use strict';

// ========================================
// CONSTANTS AND DATA ARRAYS
// ========================================

const ATTRIBUTES = ["INT", "REF", "DEX", "TECH", "COOL", "WILL", "LUCK", "MOVE", "BODY", "EMP"];

const DICE_TYPES = ["D2", "D4", "D6", "D8", "D10", "D12", "D20", "D100"];

const CYBERWARE_LOCATIONS = [
    "Right Cybereye", "Left Cybereye", "CyberAudio Suite", "Right Cyberarm",
    "Left Cyberarm", "Neural Link", "Right Cyberleg", "Left Cyberleg",
    "Internal Cyberware", "External Cyberware", "Fashionware", "Borgware"
];

const ROLES = ["solo", "netrunner", "fixer", "nomad", "rockerboy", "techie", "corporate", "cop"];

const SKILLS = [
    { name: "Accounting", attribute: "INT" },
    { name: "Acting", attribute: "COOL" },
    { name: "Air Vehicle Tech", attribute: "TECH" },
    { name: "Animal Handling", attribute: "INT" },
    { name: "Archery", attribute: "REF" },
    { name: "Athletics", attribute: "DEX" },
    { name: "Autofire", attribute: "REF" },
    { name: "Basic Tech", attribute: "TECH" },
    { name: "Brawling", attribute: "DEX" },
    { name: "Bribery", attribute: "COOL" },
    { name: "Bureaucracy", attribute: "INT" },
    { name: "Business", attribute: "INT" },
    { name: "Composition", attribute: "INT" },
    { name: "Conceal/Reveal Object", attribute: "INT" },
    { name: "Concentration", attribute: "WILL" },
    { name: "Contortionist", attribute: "DEX" },
    { name: "Conversation", attribute: "EMP" },
    { name: "Criminology", attribute: "INT" },
    { name: "Cryptography", attribute: "INT" },
    { name: "Cyber Tech", attribute: "TECH" },
    { name: "Dance", attribute: "DEX" },
    { name: "Deduction", attribute: "INT" },
    { name: "Demolitions", attribute: "TECH" },
    { name: "Drive Land Vehicle", attribute: "REF" },
    { name: "Driving", attribute: "REF" },
    { name: "Education", attribute: "INT" },
    { name: "Electronics/Security Tech", attribute: "TECH" },
    { name: "Endurance", attribute: "WILL" },
    { name: "Evasion", attribute: "DEX" },
    { name: "First Aid", attribute: "TECH" },
    { name: "Forgery", attribute: "TECH" },
    { name: "Gamble", attribute: "INT" },
    { name: "Handgun", attribute: "REF" },
    { name: "Heavy Weapons", attribute: "REF" },
    { name: "Human Perception", attribute: "EMP" },
    { name: "Interrogation", attribute: "COOL" },
    { name: "Land Vehicle Tech", attribute: "TECH" },
    { name: "Language", attribute: "INT" },
    { name: "Library Search", attribute: "INT" },
    { name: "Lipreading", attribute: "INT" },
    { name: "Local Expert", attribute: "INT" },
    { name: "Marksmanship", attribute: "REF" },
    { name: "Martial Arts", attribute: "DEX" },
    { name: "Melee Weapon", attribute: "DEX" },
    { name: "Paint/Draw/Sculpt", attribute: "TECH" },
    { name: "Paramedic", attribute: "TECH" },
    { name: "Perception", attribute: "INT" },
    { name: "Personal Grooming", attribute: "COOL" },
    { name: "Persuasion", attribute: "COOL" },
    { name: "Photography/Film", attribute: "TECH" },
    { name: "Picklock", attribute: "TECH" },
    { name: "Pickpocket", attribute: "TECH" },
    { name: "Pilot Air Vehicle", attribute: "REF" },
    { name: "Pilot Sea Vehicle", attribute: "REF" },
    { name: "Play Instrument", attribute: "EMP" },
    { name: "Resist Torture/Drugs", attribute: "WILL" },
    { name: "Riding", attribute: "REF" },
    { name: "Science", attribute: "INT" },
    { name: "Sea Vehicle Tech", attribute: "TECH" },
    { name: "Shoulder Arms", attribute: "REF" },
    { name: "Stealth", attribute: "DEX" },
    { name: "Streetwise", attribute: "COOL" },
    { name: "Tactics", attribute: "INT" },
    { name: "Tracking", attribute: "INT" },
    { name: "Trading", attribute: "COOL" },
    { name: "Wardrobe/Style", attribute: "COOL" },
    { name: "Weapons Tech", attribute: "TECH" },
    { name: "Wilderness Survival", attribute: "INT" }
];

const ARMOR_OPTIONS = [
    "none [SP-0]", "Leathers [SP-4]", "Kevlar [SP-7]", "LightArmorJack [SP-11]",
    "Bodyweight Suit [SP-11]", "Medium Armorjack [SP-11]", "Heavy Armorjack [SP-13]",
    "Flak [SP-15]", "Metalgear [SP-18]", "Bulletproof Shield [HP-10]"
];

// ========================================
// CHARACTER DATA STORAGE
// ========================================

const characterData = {
    characterName: "",
    role: 0,
    trackers: {
        currentHP: 0,
        totalHP: 0,
        seriouslyWounded: 0,
        deathSaves: 0,
        luckRemaining: 0
    },
    attributes: {},
    armor: { head: 0, body: 0 },
    euroBucks: 0,
    skills: [],
    weapons: [],
    cyberware: [],
    respect: [],
    inventory: []
};

const slotPrototype = {
    parent: null,
    children: []
};

let skillResults = [];

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Safely get element by ID with error handling
 * @param {string} id - Element ID
 * @returns {Element|null} - DOM element or null if not found
 */
function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with ID '${id}' not found`);
    }
    return element;
}

/**
 * Create a text paragraph element
 * @param {string} text - Text content
 * @returns {HTMLParagraphElement} - Paragraph element
 */
function createTextElement(text) {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    return paragraph;
}

/**
 * Create a dropdown select element
 * @param {Array} options - Array of option strings
 * @returns {HTMLSelectElement} - Select element
 */
function createDropdown(options) {
    const selectElement = document.createElement("select");

    options.forEach(optionText => {
        const option = document.createElement("option");
        option.textContent = optionText;
        option.value = optionText;
        selectElement.appendChild(option);
    });

    return selectElement;
}

/**
 * Create a flex row container
 * @returns {HTMLDivElement} - Div element with flex row styling
 */
function createFlexRow() {
    const row = document.createElement("div");
    row.classList.add("flexRow", "gap");
    return row;
}

/**
 * Add sidebar brackets to an element
 * @param {HTMLElement} element - Element to wrap
 * @returns {HTMLDivElement} - Wrapped element with sidebars
 */
function addSideBars(element) {
    const container = document.createElement("div");
    container.classList.add("flexRow");

    const leftBracket = createTextElement("[ ");
    const rightBracket = createTextElement(" ]");

    leftBracket.classList.add("sideBars");
    rightBracket.classList.add("sideBars");

    container.appendChild(leftBracket);
    container.appendChild(element);
    container.appendChild(rightBracket);

    return container;
}

/**
 * Store slot information for data management
 * @param {HTMLElement} element - Element to store
 * @param {HTMLElement} parent - Parent container
 */
function storeSlot(element, parent) {
    const slot = Object.create(slotPrototype);
    slot.parent = parent;
    slot.element = element;
    // Could extend this to actually store in characterData
}

// ========================================
// ATTRIBUTE MANAGEMENT
// ========================================

/**
 * Get all attribute input elements
 * @returns {Array<HTMLInputElement>} - Array of attribute input elements
 */
function getAllAttributeElements() {
    return ATTRIBUTES.map(attr => getElement(attr)).filter(Boolean);
}

/**
 * Update the total of all attributes
 */
function updateAttributeTotal() {
    const total = getAllAttributeElements().reduce((sum, element) => {
        const value = parseInt(element.value) || 0;
        return sum + value;
    }, 0);

    const totalElement = getElement("TOTAL");
    if (totalElement) {
        totalElement.textContent = total.toString();
    }
}

/**
 * Update attribute bonus display
 * @param {HTMLInputElement} attributeElement - The attribute input element
 */
function updateAttributeBonus(attributeElement) {
    const bonusElement = getElement(`bonusNum_${attributeElement.id}`);
    if (bonusElement) {
        const value = parseInt(attributeElement.value) || 0;
        bonusElement.textContent = `+${value}`;
    }
}

/**
 * Find skill attribute by skill name
 * @param {string} skillName - Name of the skill
 * @returns {string} - Attribute name
 */
function findSkillAttribute(skillName) {
    const skill = SKILLS.find(s => s.name === skillName);
    return skill ? skill.attribute : "";
}

/**
 * Initialize attribute event listeners
 */
function initializeAttributes() {
    getAllAttributeElements().forEach(element => {
        element.addEventListener("change", () => {
            updateAttributeTotal();
            updateAttributeBonus(element);
            updateAllSkillResults();
        });
    });
}

// ========================================
// SKILL MANAGEMENT
// ========================================

/**
 * Update all skill calculation results
 */
function updateAllSkillResults() {
    SKILLS.forEach(skill => {
        const inputElement = getElement(`input_${skill.name}`);
        const outputElement = getElement(`output_${skill.name}`);
        const attributeElement = getElement(skill.attribute);

        if (inputElement && outputElement && attributeElement) {
            const skillValue = parseInt(inputElement.value) || 0;
            const attributeValue = parseInt(attributeElement.value) || 0;
            const total = skillValue + attributeValue;

            outputElement.textContent = `= ${total >= 10 ? total : ` ${total}`}`;
        }
    });
}

/**
 * Create skill input and display elements
 */
function createSkillSlots() {
    SKILLS.forEach(skill => {
        const container = getElement(`holder_${skill.attribute}`);
        if (!container) return;

        const row = createFlexRow();
        row.classList.add("width100", "alignLeft", "textAlignLeft");
        row.style.position = "relative";

        // Create skill input
        const skillInput = document.createElement("input");
        skillInput.type = "number";
        skillInput.id = `input_${skill.name}`;
        skillInput.classList.add("inputSmaller");
        skillInput.value = "0";
        skillInput.placeholder = "0";

        // Create skill name label
        const skillName = createTextElement(skill.name);

        // Create result display
        const resultContainer = document.createElement("div");
        resultContainer.classList.add("flexRow", "alignRight");

        const result = createTextElement("= 0");
        result.id = `output_${skill.name}`;
        resultContainer.appendChild(result);

        // Add change event listener
        skillInput.addEventListener("change", () => {
            const skillValue = parseInt(skillInput.value) || 0;
            const attributeElement = getElement(skill.attribute);
            const attributeValue = parseInt(attributeElement?.value) || 0;
            const total = skillValue + attributeValue;

            result.textContent = `= ${total >= 10 ? total : ` ${total}`}`;
        });

        skillResults.push(result);

        row.appendChild(skillInput);
        row.appendChild(skillName);
        row.appendChild(resultContainer);

        container.appendChild(row);
    });
}

// ========================================
// SLOT CREATION FUNCTIONS
// ========================================

/**
 * Create a weapon slot
 * @param {HTMLElement} parentContainer - Parent container element
 */
function createWeaponSlot(parentContainer) {
    const row = createFlexRow();

    // Weapon name input
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "data entry";
    nameInput.classList.add("textAlignLeft");

    // Damage dice amount input
    const diceAmountInput = document.createElement("input");
    diceAmountInput.type = "number";
    diceAmountInput.placeholder = "0";
    diceAmountInput.classList.add("inputSmaller");

    // Dice type dropdown
    const diceTypeDropdown = createDropdown(DICE_TYPES);

    row.appendChild(nameInput);
    row.appendChild(diceAmountInput);
    row.appendChild(diceTypeDropdown);

    const wrappedRow = addSideBars(row);
    parentContainer.appendChild(wrappedRow);
    storeSlot(wrappedRow, parentContainer);
}

/**
 * Create a cyberware slot
 * @param {HTMLElement} parentContainer - Parent container element
 */
function createCyberwareSlot(parentContainer) {
    const row = document.createElement("div");
    row.classList.add("flexRow", "cyberwareSlot", "roundedEdges");

    const column = document.createElement("div");
    column.classList.add("flexColumn");

    // Cyberware name input
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "data entry";
    nameInput.classList.add("textAlignLeft", "thinnerInput");

    // Cyberware data input
    const dataInput = document.createElement("input");
    dataInput.type = "text";
    dataInput.placeholder = "data entry";
    dataInput.classList.add("textAlignLeft", "thinnerInput");

    const wrappedNameInput = addSideBars(nameInput);
    const wrappedDataInput = addSideBars(dataInput);

    column.appendChild(wrappedNameInput);
    column.appendChild(wrappedDataInput);

    // Location dropdown
    const locationDropdown = createDropdown(CYBERWARE_LOCATIONS);
    locationDropdown.classList.add("textAlignLeft");

    row.appendChild(column);
    row.appendChild(locationDropdown);

    parentContainer.appendChild(row);
    storeSlot(row, parentContainer);
}

/**
 * Create a respect slot
 * @param {HTMLElement} parentContainer - Parent container element
 */
function createRespectSlot(parentContainer) {
    const row = createFlexRow();

    // Respect source input
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.classList.add("noBorder");
    nameInput.placeholder = "data entry";

    // Respect amount input
    const amountInput = document.createElement("input");
    amountInput.type = "number";
    amountInput.classList.add("noBorder", "inputSmaller");
    amountInput.placeholder = "0";

    row.appendChild(nameInput);
    row.appendChild(amountInput);

    const wrappedRow = addSideBars(row);
    parentContainer.appendChild(wrappedRow);
    storeSlot(wrappedRow, parentContainer);
}

/**
 * Create an inventory slot
 * @param {HTMLElement} parentContainer - Parent container element
 */
function createInventorySlot(parentContainer) {
    const input = document.createElement("input");
    input.classList.add("fillWidth", "noBorder");
    input.placeholder = "data entry";

    const wrappedInput = addSideBars(input);
    wrappedInput.classList.add("fillWidth");

    parentContainer.appendChild(wrappedInput);
    storeSlot(wrappedInput, parentContainer);
}

// ========================================
// BUTTON FUNCTIONALITY
// ========================================

/**
 * Add functionality to add buttons
 * @param {string} buttonId - ID of the button element
 */
function setupAddButton(buttonId) {
    const button = getElement(buttonId);
    if (!button) return;

    const [, containerType] = buttonId.split("_");
    const containerId = `container_${containerType}`;
    const container = getElement(containerId);

    if (!container) return;

    const slotCreators = {
        weapon: createWeaponSlot,
        cyberware: createCyberwareSlot,
        respect: createRespectSlot,
        inventory: createInventorySlot
    };

    const createSlot = slotCreators[containerType];
    if (createSlot) {
        button.addEventListener("click", () => createSlot(container));
    }
}

// ========================================
// DROPDOWN INITIALIZATION
// ========================================

/**
 * Create and insert role dropdown
 */
function createRoleDropdown() {
    const container = getElement("roleInsert");
    if (container) {
        const dropdown = createDropdown(ROLES);
        const wrappedDropdown = addSideBars(dropdown);
        container.appendChild(wrappedDropdown);
    }
}

/**
 * Create and insert armor dropdowns
 */
function createArmorDropdowns() {
    const bodyContainer = getElement("bodyArmorInsert");
    const headContainer = getElement("headArmorInsert");

    if (bodyContainer) {
        const bodyDropdown = createDropdown(ARMOR_OPTIONS);
        bodyDropdown.classList.add("inputMedium");
        const wrappedBodyDropdown = addSideBars(bodyDropdown);
        bodyContainer.appendChild(wrappedBodyDropdown);
    }

    if (headContainer) {
        const headDropdown = createDropdown(ARMOR_OPTIONS);
        headDropdown.classList.add("inputMedium");
        const wrappedHeadDropdown = addSideBars(headDropdown);
        headContainer.appendChild(wrappedHeadDropdown);
    }
}

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize the character sheet application
 */
function initializeApp() {
    // Initialize attributes
    initializeAttributes();

    // Create skill slots
    createSkillSlots();

    // Setup add buttons
    ["add_weapon", "add_cyberware", "add_respect", "add_inventory"].forEach(setupAddButton);

    // Create dropdowns
    createRoleDropdown();
    createArmorDropdowns();

    console.log("Cyberpunk Character Sheet initialized successfully");
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}