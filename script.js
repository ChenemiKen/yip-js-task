const delivery_items = document.querySelectorAll('.delivery-item');
const slots = document.querySelectorAll('.slot');

// attach the dragstart event handler to each delivery item in the table
delivery_items.forEach(item => {
    item.addEventListener('dragstart', dragStart);
});

slots.forEach(slot => {
    slot.addEventListener('dragenter', dragEnter)
    slot.addEventListener('dragover', dragOver);
    slot.addEventListener('drop', drop);
});

// handle the dragstart
function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.children[1].innerHTML);
    // setTimeout(() => {
    //     e.target.classList.add('hide');
    // }, 0);
    console.log(e.target.children[1].innerHTML)

}

function dragEnter(e) {
    e.preventDefault();
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    // get the draged item ID
    const item_id = e.dataTransfer.getData('text/plain');
    console.log(item_id);

    // add it to the drop target
    e.target.innerHTML = item_id;

}