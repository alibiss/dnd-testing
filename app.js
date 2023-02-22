// Drag and drop events handlers

// Generate random skills
const list = document.getElementById("actions");
for (let i=0; i<24; i++) {
    const color = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6),
        action = document.createElement("div");
    action.classList.add("item", "parent");
    action.setAttribute("data-skill", "skill-" + (i+1));
    action.setAttribute("draggable", "true");
    action.style.backgroundColor = color;
    list.appendChild(action);
}

// Retrieve info on what skill is being dragged
document.addEventListener("dragstart", (e) => {
    e.dataTransfer.clearData();
    e.dataTransfer.setData("name", e.target.getAttribute("data-skill"));
    e.dataTransfer.setData("slot", e.target.parentNode.getAttribute("data-slot") || "empty");
    e.dataTransfer.setData("css", e.target.getAttribute("style"));
});

// No clue why this is needed..
document.addEventListener("dragover", (e) => { e.preventDefault() });

// Find out if drop location is valid or not
document.addEventListener("drop", (e) => {
    e.preventDefault();

    const action = {
        name: e.dataTransfer.getData("name"),
        slot: e.dataTransfer.getData("slot"),
        style: e.dataTransfer.getData("css")
    };

    const node = document.querySelector(`[data-slot="${action.slot}"] > [data-skill="${action.name}"]`);

    if ( action.slot === "empty" ) {
        // If dragging an action from the list
        if ( e.target.classList.contains("container") || e.target.classList.contains("child") ) {
            let destination = e.target;
            if ( e.target.classList.contains("child") ) {
                // If slot already filled, remove sibling first
                const sibling = e.target.parentNode.querySelector("[data-skill]");
                destination = e.target.parentNode;
                sibling.remove();
            }

            const item = document.createElement("div");
            item.classList.add("item", "child");
            item.setAttribute("data-skill", action.name);
            item.setAttribute("draggable", "true");
            item.style = action.style;
            destination.appendChild(item);
        }
    } else {
        // If dragging an action from the hotbars
        if ( e.target.classList.contains("container") ) {
            e.target.appendChild(node);
        } else if ( e.target.classList.contains("child") ) {
            const sibling = e.target.parentNode.querySelector("[data-skill]"),
                destination = document.querySelector(`[data-slot="${action.slot}"]`);
    
            e.target.parentNode.appendChild(node);
            destination.appendChild(sibling);
        } else {
            // ..to invalid space
            node.remove();
        }
    }
});