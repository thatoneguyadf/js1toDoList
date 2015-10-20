/* ================= Variables ====================== */
var form = document.getElementById('toDoForm');
var list = document.getElementById('toDoList');
var clear = document.getElementById('clear');
var clearAll = document.getElementById('clearAll');
var toDoArray = JSON.parse(localStorage.listItems || null) || [];

form.submit.disabled = true;

/* ================= Event Listeners ====================== */
//disables submit button if text area is empty
form.addEventListener('input', function () {
    if (form.toDoItem.value.length > 0) {
        form.submit.disabled = false;
    }
    else {
        form.submit.disabled = true;
    }
});

//listens for a submit event and adds a new toDoItem
form.addEventListener('submit', function (evt) {
    evt.preventDefault();

    var toDoItem = form.toDoItem.value;

    form.toDoItem.value = '';
    form.submit.disabled = true;

    toDoItem = [toDoItem, false];
    toDoArray.push(toDoItem);
    localStorage.setItem('listItems', JSON.stringify(toDoArray));
    makeLis();
});

clear.addEventListener('click', function () {
    for (var i = toDoArray.length - 1; i >= 0; i--) {
       if (toDoArray[i][1]) {
           toDoArray.splice(i, 1);
       }
    }

    localStorage.listItems = JSON.stringify(toDoArray);

    makeLis();
});

clearAll.addEventListener('click', function () {
    toDoArray.splice(0);

    localStorage.listItems = JSON.stringify(toDoArray);

    makeLis();
});

//listens for clicks on lis and call corresponding functions
list.addEventListener('click', function (evt) {
    var target = evt.target;
    var targetClass = target.getAttribute('class');

    switch (targetClass) {
        //when checkBox is clicked call checked function and save status to local storage
        case 'checkBox':
            checked(target);
            var arrIndex = target.parentElement.getAttribute('rel');

            if (target.checked) {
                toDoArray[arrIndex][1] = true;
            }
            else {
                toDoArray[arrIndex][1] = false;
            }

            localStorage.listItems = JSON.stringify(toDoArray);
            break;

        //when edit button is clicked calls function to edit item
        case 'editBtn':
            editLi(target);
            break;

        //when delete button is clicked calls function to delete item
        case 'delBtn':
            deleteLi(target);
            break;
    }
});

list.addEventListener('submit', function (evt) {
    evt.preventDefault();

    var edited = evt.target;
    var li = edited.parentElement;
    var replace = li.getAttribute('rel');
    var text = edited.toDoItem.value;

    if (text === '') {

        text = edited.getAttribute('rel');
    }
    else {

        toDoArray[replace].splice(0, 1, text);

        localStorage.listItems = JSON.stringify(toDoArray);
    }

    var span = e('span', text);

    li.replaceChild(span, edited);
    li.childNodes[0].disabled = false;
    li.childNodes[2].classList.remove('hidden');
});


/* ================= Functions ====================== */
//creates DOM elements
function e(elementType, text, attributes, styles) {
    var newElement = document.createElement(elementType);
    newElement.textContent = text;

    //set the attributes on the tag
    if (attributes) {
        for (var i = 0; i < attributes.length; i++) {
            var attr = attributes[i];
            newElement.setAttribute(attr[0], attr[1]);
        }
    }

    //set the styles
    if (styles) {
        for (var j = 0; j < styles.length; j++) {
            var style = styles[j];
            newElement.style[style[0]] = style[1];
        }
    }

    return newElement;
}

//turns array into lis
function makeLis() {
    list.innerHTML = '';

    //loops over array to create lis
    for (var i = 0; i < toDoArray.length; i++) {
        var item = toDoArray[i][0];
        var li = e('li', '', [['rel', i]]);
        var checkBox = e('input', '', [['type', 'checkbox'], ['class', item], ['class', 'checkBox']]);
        var span = e('span', item);
        var edit = e('button', 'Edit', [['class', 'editBtn'], ['rel', item]]);
        var del = e('button', 'Delete', [['class', 'delBtn'], ['rel', item]]);
        checkBox.checked = toDoArray[i][1];

        li.appendChild(checkBox);
        li.appendChild(span);
        li.appendChild(edit);
        li.appendChild(del);
        checked(checkBox);
        list.appendChild(li);
    }
}

//when checBox is checked gray out and strike through text
function checked(item) {
    if (item.checked) {
        item.parentElement.classList.add('checked');
        item.parentElement.childNodes[2].classList.add('hidden');
    }
    else {
        item.parentElement.classList.remove('checked');
        item.parentElement.childNodes[2].classList.remove('hidden');
    }
}

//when edit button is clicked replace toDoItem with edit form and hide edit button
function editLi(item) {
    var li = item.parentElement;
    var text = li.childNodes[1].textContent;
    var editForm = e('form', '', [['id', 'editForm'], ['rel', text]]);
    var editField = e('input', '', [['type', 'text'], ['name', 'toDoItem'], ['value', text]]);
    var editSubmit = e('input', '', [['type', 'submit']]);

    item.classList.add('hidden');
    editForm.appendChild(editField);
    editForm.appendChild(editSubmit);
    li.childNodes[0].disabled = true;
    li.replaceChild(editForm, li.childNodes[1]);
}

//when delete button is clicked removes the specified item
function deleteLi(item) {
    if (confirm('Are you sure you want to delete this?')) {
        var delAt = item.parentElement.getAttribute('rel');

        toDoArray.splice(delAt, 1);

        localStorage.listItems = JSON.stringify(toDoArray);

        makeLis();
    }
}


/* ================= Execution ====================== */

makeLis();