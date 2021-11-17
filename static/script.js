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
    e.dataTransfer.setData('text/plain', e.target.id);
    // setTimeout(() => {
    //     e.target.classList.add('hide');
    // }, 0);

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

    const slotId = e.target.id; //2021-11-17%slot1
    console.log(slotId);
    const slotData = slotId.split("%"); //[2021-11-17, slot1]
    const alocated_slot = slotData[1]; //slot1
    const dateParts = slotData[0].split("-"); //[2021, 11, 17]
    const date = new Date(dateParts[0], dateParts[1]-1, dateParts[2]); //Wed Nov 17 2021 00:00:00 GMT+0100 (West Africa Standard Time)
    const dateISO = date.toISOString(); //2021-11-16T23:00:00.000Z
    console.log(date)
    console.log(alocated_slot)
    console.log(dateISO)

    fetch('/schedule',{
        method:'POST',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
            customer_id: item_id,
            date: dateISO,
            slot: alocated_slot
        })
    }).then(response => {
        if (response.ok) {
            // add it to the drop target
            e.target.innerHTML = item_id;
        }
        else{
            alert('Error!: Unable to create Schedule')
            throw new Error('Network response was not OK');
        }
    })
}
