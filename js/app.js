/* ================= Variables ====================== */
var form = document.getElementById('toDoForm');
var list = document.getElementById('toDoList');
var toDoArray = JSON.parse(localStorage.listItems || null) || [];


/* ================= Event Listeners ====================== */
//listens for a submit event and adds a new toDoItem
form.addEventListener('submit', function (evt) {
    evt.preventDefault();

    var toDoItem = form.toDoItem.value;
    form.toDoItem.value = '';

    toDoArray.push(toDoItem);
    localStorage.setItem('listItems', JSON.stringify(toDoArray));
    makeLis();
});

//listens for clicks on lis and call corresponding functions
list.addEventListener('click', function (evt) {
    var target = evt.target;
    var targetClass = target.getAttribute('class');

    switch (targetClass) {
        //when checkBox is clicked call checked function
        case 'checkBox':
            checked(target);
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
        var item = toDoArray[i];
        var li = e('li');
        var checkBox = e('input', '', [['type', 'checkbox'], ['id', item], ['class', 'checkBox']]);
        var span = e('span', item);
        var edit = e('button', 'Edit', [['class', 'editBtn'], ['rel', item]]);
        var del = e('button', 'Delete', [['class', 'delBtn'], ['rel', item]]);

        li.appendChild(checkBox);
        li.appendChild(span);
        li.appendChild(edit);
        li.appendChild(del);
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

//when edit button is clicked replace toDoItem with a form populated with toDoItem text
function editLi(item) {
    var li = item.parentElement;
    var text = li.childNodes[1].textContent;
    var editForm = e('form', '', [['id', 'editForm'], ['rel', text]]);
    var editField = e('input', '', [['type', 'text'], ['name', 'toDoItem'], ['value', text]]);
    var editSubmit = e('input', '', [['type', 'submit']]);

    editForm.addEventListener('submit', function (evt) {
        evt.preventDefault();

        var edited = evt.target;
        var replace = edited.getAttribute('rel');
        var replaceIndex = toDoArray.indexOf(replace);
        var li = edited.parentElement;
        var text = edited.toDoItem.value;
        var span = e('span', text);

        toDoArray.splice(replaceIndex, 1, text);

        localStorage.listItems = JSON.stringify(toDoArray);

        li.replaceChild(span, edited);
        li.childNodes[2].classList.remove('hidden');
    });

    item.classList.add('hidden');
    editForm.appendChild(editField);
    editForm.appendChild(editSubmit);
    li.replaceChild(editForm, li.childNodes[1]);
}

//when delete button is clicked removes the specified item
function deleteLi(item) {
    if (confirm('Are you sure you want to delete this?')) {
        var delAt = item.getAttribute('rel');
        var delItem = toDoArray.indexOf(delAt);
        toDoArray.splice(delItem, 1);

        localStorage.listItems = JSON.stringify(toDoArray);

        makeLis();
    }
}


/* ================= Execution ====================== */

makeLis();
