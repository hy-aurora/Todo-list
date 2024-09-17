window.addEventListener("load", () => {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    const nameInput = document.querySelector("#name");
    const newTodoForm = document.querySelector("#new-todo-form");
    const todoList = document.querySelector("#todo-list");

    const username = localStorage.getItem("username") || "";

    nameInput.value = username;

    nameInput.addEventListener('change', e => {
        localStorage.setItem("username", e.target.value);
    })

    newTodoForm.addEventListener("submit", e => {
        e.preventDefault();

        const newTodo = {
            content: e.target.elements.content.value,
            category: e.target.elements.category.value,
            done: false,
            createdAt: new Date().getTime()
        }

        todos.push(newTodo);

        localStorage.setItem("todos", JSON.stringify(todos));

        e.target.reset();

        displayTodos();
    });

    displayTodos();
});

function displayTodos() {
    const todoList = document.querySelector("#todo-list");
    todoList.innerHTML = '';

    let todos = JSON.parse(localStorage.getItem("todos")) || [];

    // Sort todos by createdAt property in descending order
    todos.sort((a, b) => b.createdAt - a.createdAt);

    todos.forEach(todo => {
        const todoItem = document.createElement("div");
        todoItem.classList.add("todo-item");

        const label = document.createElement("label");
        const input = document.createElement("input");
        const span = document.createElement("span");
        const content = document.createElement("div");
        const actions = document.createElement("div");
        const edit = document.createElement("button");
        const deleteButton = document.createElement("button");

        input.type = "checkbox";
        input.checked = todo.done;
        span.classList.add("bubble");

        if (todo.category === "personal") {
            span.classList.add("personal");
        } else {
            span.classList.add("business");
        }

        content.classList.add('todo-content');
        actions.classList.add('actions');
        edit.classList.add('edit');
        deleteButton.classList.add('delete');

        content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;

        label.appendChild(input);
        label.appendChild(span);
        actions.appendChild(edit);
        actions.appendChild(deleteButton);
        todoItem.appendChild(label);
        todoItem.appendChild(content);
        todoItem.appendChild(actions);

        todoList.appendChild(todoItem);

        if (todo.done) {
            todoItem.classList.add("done");
        }

        input.addEventListener('change', e => {
            todo.done = e.target.checked;
            localStorage.setItem("todos", JSON.stringify(todos));

            if (todo.done) {
                todoItem.classList.add("done");
            }else {
                todoItem.classList.remove("done");
            }

            displayTodos();
        })

        edit.addEventListener('click', e => {
            const input = content.querySelector('input');
            input.removeAttribute('readonly');
            input.focus();
            input.addEventListener('blur', e => {
                input.setAttribute('readonly', true);
                todo.content = e.target.value;
                localStorage.setItem("todos", JSON.stringify(todos));
                displayTodos();
            })
        })

        deleteButton.addEventListener('click', e => {
            todoItem.classList.add('fade-out');
            setTimeout(() => {
                todos = todos.filter(t => t != todo);
                localStorage.setItem("todos", JSON.stringify(todos));
                displayTodos();
            }, 300); // Wait for the fade-out transition to complete
        })
    })
}

const MIN_SPEED = 1.5
const MAX_SPEED = 2.5

function randomNumber(min, max) {
  return Math.random() * (max - min) + min
}

class Blob {
  constructor(el) {
    this.el = el
    const boundingRect = this.el.getBoundingClientRect()
    this.size = boundingRect.width
    this.initialX = randomNumber(0, window.innerWidth - this.size)
    this.initialY = randomNumber(0, window.innerHeight - this.size)
    this.el.style.top = `${this.initialY}px`
    this.el.style.left = `${this.initialX}px`
    this.vx =
      randomNumber(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1)
    this.vy =
      randomNumber(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1)
    this.x = this.initialX
    this.y = this.initialY
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    if (this.x >= window.innerWidth - this.size) {
      this.x = window.innerWidth - this.size
      this.vx *= -1
    }
    if (this.y >= window.innerHeight - this.size) {
      this.y = window.innerHeight - this.size
      this.vy *= -1
    }
    if (this.x <= 0) {
      this.x = 0
      this.vx *= -1
    }
    if (this.y <= 0) {
      this.y = 0
      this.vy *= -1
    }
  }

  move() {
    this.el.style.transform = `translate(${this.x - this.initialX}px, ${
      this.y - this.initialY
    }px)`
  }
}

function initBlobs() {
  const blobEls = document.querySelectorAll('.bouncing-blob')
  const blobs = Array.from(blobEls).map((blobEl) => new Blob(blobEl))

  function update() {
    requestAnimationFrame(update)
    blobs.forEach((blob) => {
      blob.update()
      blob.move()
    })
  }

  requestAnimationFrame(update)
}

initBlobs()
