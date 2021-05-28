export function createSpan(content,classname) {
    const span = document.createElement('span');
    span.textContent = content;
    span.className = classname;
    return span;
}

export function createButton(content,classname,ev) {
    const button = document.createElement('button');
    button.textContent = content;
    button.className = classname;
    button.addEventListener('click',ev);
    return button;
}

export function createDropdown(classname,items,ev,selected) {
    let option;
    const selector = document.createElement('select');
    items.forEach( opt => {
        option = document.createElement('option');
        option.value = opt;
        if (opt === selected) {
            option.setAttribute('selected',true);
        }
        option.textContent = opt;
        selector.appendChild(option);
    });
    selector.className = classname;
    selector.addEventListener('change',ev);
    return selector;
}

export function createSlider(content,classname, range, step, ev, init) {
    const label = document.createElement('label');
	const slider = document.createElement('input');
	slider.className = classname;
	slider.type = 'range';
	slider.min = range[0];
	slider.max = range[1];
    slider.step = step;
    slider.value = init;
	slider.addEventListener('input',ev);
    label.className = 'slider_container';
    label.textContent = content;
    label.appendChild(slider);
	return label;
}

export function sliderRuleMarks(object,step_mult) {
    const range_obj = object.querySelector('input');
    const min = parseFloat(range_obj.getAttribute('min'));
    const max = parseFloat(range_obj.getAttribute('max'));
    const step = parseFloat(range_obj.getAttribute('step'));
    const listname = range_obj.className + '_list';
    const tick_marks = document.createElement('datalist');
    tick_marks.id = listname;
    let tick;
    for (let i = min; i <= max; i += step*step_mult) {
        tick = document.createElement('option');
        tick.textContent = i;
        tick_marks.appendChild(tick);
    }
    object.appendChild(tick_marks);
    range_obj.setAttribute('list', listname);
}

export function createNumberBox(content, classname, range, ev, init) {
    const label = document.createElement('label');
    const box = document.createElement('input');
    box.className = classname;
    box.type = 'number';
    box.min = range[0];
    box.max = range[1];
    box.value = init;
    box.addEventListener('mousedown',verticalDrag);
    box.onchange = ev;
    label.className = 'number_box';
    label.textContent = content;
    label.appendChild(box);
    return label;
}

function verticalDrag(dragev) {
    const obj = this;
    // multiply coordinates by .2 to slow down the change;
    let last_y = (.2*dragev.clientY) + parseFloat(obj.value);
    last_y = Number.isNaN(last_y) ? obj.min : last_y;
    let change;
    window.onmousemove = moveev => {
        document.body.style.cursor = 'n-resize';
        moveev.preventDefault();
        change = Math.trunc(last_y - (.2*moveev.clientY));
        obj.value = Math.min(obj.max,Math.max(obj.min,change));
        if (obj.onchange) {obj.onchange();}
    }
    window.onmouseup = () => {
        document.body.style.cursor = 'default';
        window.onmousemove = null;
        window.onmouseup = null;
    }
}

export function createToggle(content,classname,ev) {
	const label = document.createElement('label');
	const box = document.createElement('input');
    const face = document.createElement('span');
    face.textContent = content;
    box.type = 'checkbox';
	box.className = classname;
    label.className = 'toggle_button';
    label.appendChild(box);
    label.appendChild(face);
	label.addEventListener('change',ev);
	return label;
}
