// SELECTORS
const $studentsTableBody = document.querySelector("#students-table-body");
const $addStudentForm = document.querySelector("#add-form");
const $editStudentForm = document.querySelector("#edit-form");
const $countText = document.querySelector(".count");
const $studentsTemplate = document.querySelector("#student-template").content;

const newFragment = new DocumentFragment();

// EVENTS
window.onload = async () => {
    renderElements(await fetchDatas());
};

$addStudentForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    createData();
    $addStudentForm.reset()
})

// FUNCTIONS

// Fetching datas form API
async function fetchDatas() {
    try {
        const response = await fetch("http://167.235.158.238/students");
        const parsedDatas = await response.json();
        return parsedDatas;
    } catch (error) {
        console.log(error.message);
    }
}

// Delete data
async function deleteData(id) {
    try {
        const res = await fetch(`http://167.235.158.238/students/${id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        renderElements(await fetchDatas());
    } catch (error) {
        console.log(error.message);
    }
}

// Create datas
async function createData(data) {
    try {
        const addNameInput = document.querySelector("#add-name");
        const addLastNameInput = document.querySelector("#add-lastname");
        const addMarkInput = document.querySelector("#add-mark");
        // console.log(JSON.stringify(data));
        const response = await fetch("http://167.235.158.238/students", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: addNameInput.value,
                markedDate: new Date(),
                mark: addMarkInput.value,
            }),
        });

        const data = await response.json();
        renderElements(await fetchDatas());
        console.log(data);
    } catch (error) {
        console.log(error.message);
    }
}

// Update datas
async function updateData(id) {
    try {
        const editNameInput = document.querySelector("#edit-name");
        // const editLastNameInput = document.querySelector("#edit-lastname");
        const editMarkInput = document.querySelector("#edit-mark");
        const response = await fetch(`http://167.235.158.238/students/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: editNameInput.value,
                markedDate: new Date(),
                mark: editMarkInput.value,
            }),
        });

        const data = await response.json();
        renderElements(await fetchDatas());
        console.log(data);
    } catch (error) {
        console.log(error.message);
    }
}

// Rendering elements
function renderElements(datas) {
    $studentsTableBody.innerHTML = "";
    $countText.textContent = `Count : ${datas.length}`;
    datas.forEach(item => {
        const templateCloned = $studentsTemplate.cloneNode(true);

        templateCloned.querySelector("#student-id").textContent = item.id;
        templateCloned.querySelector("#student-name").textContent = item.name;
        templateCloned.querySelector("#student-marked-date").textContent = item.markedDate.slice(0, 10);
        templateCloned.querySelector("#student-mark").textContent = item.mark;
        templateCloned.querySelector("#student-delete").dataset.id = item.id;
        templateCloned.querySelector("#student-edit").dataset.id = item.id;
        const $studentPassStatus = templateCloned.querySelector("#student-pass-status");

        if (item.mark >= 100) {
            $studentPassStatus.textContent = "Pass";
            $studentPassStatus.classList.add("bg-success");
        } else {
            $studentPassStatus.textContent = "Failed";
            $studentPassStatus.classList.add("bg-danger");
        }
        newFragment.appendChild(templateCloned);
    });

    $studentsTableBody.appendChild(newFragment);
}

$studentsTableBody.addEventListener("click", evt => {
    if (evt.target.matches("#student-delete")) {
        const btnId = evt.target.dataset.id;
        deleteData(btnId);
    }

    if (evt.target.matches("#student-edit")) {
        const btnEditId = evt.target.dataset.id;
        $editStudentForm.addEventListener("submit", (evt) => {
            evt.preventDefault();
            updateData(btnEditId);
            console.log(btnEditId);
            $editStudentForm.reset()
        })

    }
})