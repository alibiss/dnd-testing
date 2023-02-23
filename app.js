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
    initItem(action);
}

document.querySelectorAll("#slots > .container").forEach(node => {
    // Shift click to remove element
    node.addEventListener("click", (e) => {
        e.preventDefault();

        if ( !e.shiftKey ) return;
        if ( e.target.classList.contains("item") ) e.target.remove();
    })

    // Set .container nodes as valid drop zones
    node.addEventListener("dragover", (e) => { e.preventDefault() });
    
    node.addEventListener("drop", (e) => {
        // Parse payload's content
        const action = JSON.parse(e.dataTransfer.getData("text/plain"));

        if ( action.slot === "empty" ) {
            // If dragging an action from the list

            let destination = e.target;
            if ( e.target.classList.contains("item") ) {
                // If slot already filled, remove sibling first
                const sibling = e.target.parentNode.querySelector(".item");
                destination = e.target.parentNode;
                sibling.remove();
            }

            const item = document.createElement("div");
            item.classList.add("item", "child");
            item.setAttribute("data-skill", action.name);
            item.setAttribute("draggable", "true");
            item.style = action.style;
            destination.appendChild(item);
            initItem(item);
        } else {
            // If dragging an action from the hotbars

            const node = document.querySelector(`[data-slot="${action.slot}"] > [data-skill="${action.name}"]`);
            if ( e.target.classList.contains("container") ) {
                e.target.appendChild(node);
            } else if ( e.target.classList.contains("item") ) {
                const sibling = e.target.parentNode.querySelector(".item"),
                    destination = document.querySelector(`[data-slot="${action.slot}"]`);
        
                e.target.parentNode.appendChild(node);
                destination.appendChild(sibling);
            }
        }
    })
})

function initItem(i) {
    i.addEventListener("dragstart", (e) => {
        e.dataTransfer.clearData();
        clearSelection();

        e.dataTransfer.setData("text/plain", JSON.stringify({
            name: e.target.getAttribute("data-skill"),
            slot: e.target.parentNode.getAttribute("data-slot") || "empty",
            style: e.target.getAttribute("style")
        }));
    })
}

// https://stackoverflow.com/a/880518/21273012
function clearSelection() {
    if(document.selection && document.selection.empty) {
        document.selection.empty();
    } else if(window.getSelection) {
        const sel = window.getSelection();
        sel.removeAllRanges();
    }
}