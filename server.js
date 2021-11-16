const delivery_items = document.querySelectorAll('.delivery-item');

// attach the dragstart event handler to each delivery item in the table
delivery_items.forEach(item => {
    item.addEventListener('dragstart', dragStart);
});

// handle the dragstart
function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => {
        e.target.classList.add('hide');
    }, 0);

}