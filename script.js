// =============================
// FLAG VARIABLES
// =============================

// This boolean tracks whether the modal is currently open or closed.
// If false → modal hidden. If true → modal visible.
let modalFlag = false;


// =============================
// DOM ELEMENT SELECTORS
// =============================

// Select the Add button (the '+' button that toggles the modal).
const addBtn = document.querySelector(".add-btn");

// Select the modal container where users type ticket text.
const modalCont = document.querySelector(".modal-cont");

// Select the textarea inside the modal where tasks are typed.
const modalTaskArea = document.querySelector(".textArea-cont");

// Select the container where all ticket cards will be appended.
const mainCont = document.querySelector(".main-cont");

// Select all priority color elements inside the modal (color options).
const allPriorityColors = document.querySelectorAll(".priority-color");


// =============================
// LOCAL STORAGE HANDLING
// =============================

// Read existing ticket data from localStorage.
// If nothing exists, return an empty array instead of null (important fix).
const ticketsFromLS = JSON.parse(localStorage.getItem("myTickets")) || [];

// Make a working array of tickets that we can modify.
let ticketsArr = ticketsFromLS;


// =============================
// INITIALIZATION FUNCTION
// =============================

// Loads all saved tickets from localStorage and creates UI elements for them.
function init() {
  ticketsArr.forEach(function (ticket) {
    // For each saved ticket, recreate its HTML layout on the page.
    createTicket(ticket.ticketTask, ticket.ticketId, ticket.ticketColor);
  });
}

// Call the init function so tickets appear when page loads.
init();


// =============================
// GLOBAL VARIABLES
// =============================

// Array of colors used for priority cycling.
let colorsArray = ["lightpink", "lightgreen", "lightblue", "black"];

// FontAwesome class names for locked/unlocked icons.
let closeLock = "fa-lock";
let openLock = "fa-lock-open";

// Default selected color in modal.
let ticketColorSelected = "lightpink";


// =============================
// ADD BUTTON → OPEN/CLOSE MODAL
// =============================

addBtn.addEventListener("click", function () {
  // If modalFlag is true, hide modal. If false, show modal.
  modalCont.style.display = modalFlag ? "none" : "flex";

  // Toggle modalFlag so next click reverses state.
  modalFlag = !modalFlag;
});


// =============================
// CREATE NEW TICKET ON SHIFT KEY
// =============================

// When inside modal, pressing SHIFT creates a ticket.
modalCont.addEventListener("keydown", function (e) {
  if (e.key == "Shift") {
    // Read user input from textarea.
    let task = modalTaskArea.value;

    // Generate a unique ID using shortid() library.
    let id = shortid();

    // Use the priority color selected earlier.
    let color = ticketColorSelected;

    // Create the actual ticket element in UI.
    createTicket(task, id, color);

    // Hide modal & reset modalFlag.
    modalCont.style.display = "none";
    modalFlag = false;

    // Push new ticket data into array for saving.
    // NOTE: property names must match what we use in init().
    ticketsArr.push({
      ticketTask: task,
      ticketId: id,
      ticketColor: color,
    });

    // Save updated array to localStorage.
    localStorage.setItem("myTickets", JSON.stringify(ticketsArr));
  }
});


// =============================
// FUNCTION: CREATE A TICKET
// =============================

function createTicket(ticketTask, ticketId, ticketColor) {
  // Create outer ticket container.
  const ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont");

  // Insert inner structure of ticket using template literal.
  ticketCont.innerHTML = `
     <div style="background-color:${ticketColor};" class="ticket-color"></div>
      <div class="ticket-id">${ticketId}</div>
      <div class="task-area">${ticketTask}</div>
      <div class="ticket-lock">
         <i class="fa-solid fa-lock"></i>
      </div>
  `;

  // Add ticket to main container.
  mainCont.appendChild(ticketCont);

  // Enable lock/unlock editing.
  handleLock(ticketCont);

  // Enable color cycling on color band.
  handleColor(ticketCont);
}


// =============================
// SELECT PRIORITY COLOR IN MODAL
// =============================

allPriorityColors.forEach(function (colorElem) {
  colorElem.addEventListener("click", function () {
    // Remove active class from all color options.
    allPriorityColors.forEach(function (priorityColor) {
      priorityColor.classList.remove("active");
    });

    // Add active class only to the selected color.
    colorElem.classList.add("active");

    // Store the selected color name (class name at index 0).
    ticketColorSelected = colorElem.classList[0];
  });
});



// =============================
// LOCK / UNLOCK TICKET CONTENT
// =============================

function handleLock(ticket) {
  // Select lock container inside ticket.
  const ticketLockConatainer = ticket.querySelector(".ticket-lock");

  // Select the task text area inside ticket.
  const ticketTaskArea = ticket.querySelector(".task-area");

  // Select <i> icon representing lock state.
  const ticketLock = ticketLockConatainer.children[0];

  // Add click listener to lock icon.
  ticketLock.addEventListener("click", function () {
    // If currently locked:
    if (ticketLock.classList.contains(closeLock)) {
      // Switch to unlocked icon.
      ticketLock.classList.remove(closeLock);
      ticketLock.classList.add(openLock);

      // Enable text editing.
      ticketTaskArea.setAttribute("contenteditable", "true");
    } else {
      // Switch back to locked icon.
      ticketLock.classList.remove(openLock);
      ticketLock.classList.add(closeLock);

      // Disable editing.
      ticketTaskArea.setAttribute("contenteditable", "false");
    }
  });
}


// =============================
// COLOR CYCLING ON TICKET
// =============================

function handleColor(ticket) {
  // Select the color bar at top of the ticket.
  const ticketColorBand = ticket.querySelector(".ticket-color");

  // Add click listener to cycle colors.
  ticketColorBand.addEventListener("click", function () {
    // Get current color from inline style.
    let currentColor = ticketColorBand.style.backgroundColor;

    // Find the index of that color in colorsArray.
    let currentColorIdx = colorsArray.indexOf(currentColor);

    // Move to next color using modulo (wraps from last → first).
    const nextColorIdx = (currentColorIdx + 1) % colorsArray.length;

    // Apply the next color.
    ticketColorBand.style.backgroundColor = colorsArray[nextColorIdx];
  });
}


// =============================
// WORKING COLOR FILTER FOR YOUR FILES
// =============================

// Select the filter buttons (they have class="color")
const filterButtons = document.querySelectorAll(".color");

// On click → filter
filterButtons.forEach(function(btn) {
  btn.addEventListener('click', function() {
    const selectedColor = btn.classList[0]; // lightpink, lightgreen, etc.

    const allTickets = document.querySelectorAll(".ticket-cont");

    allTickets.forEach(function(ticket) {
      const ticketColor = ticket.querySelector(".ticket-color").style.backgroundColor;

      // Compare using direct color names
      if (ticketColor === selectedColor) {
        ticket.style.display = "block";
      } else {
        ticket.style.display = "none";
      }
    });
  });
});

// Double click → show all
filterButtons.forEach(function(btn) {
  btn.addEventListener("dblclick", function() {
    let tkt = document.querySelectorAll(".ticket-cont");
    tkt.forEach(function(ticket){
       ticket.style.display = "block";
    });
  });
});

