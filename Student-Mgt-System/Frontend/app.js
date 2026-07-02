const API_BASE = 'http://localhost:5000/students';
const form = document.getElementById('student-form');
const tableBody = document.getElementById('student-table-body');
const refreshButton = document.getElementById('refresh-button');
const resetButton = document.getElementById('reset-button');
const formStatus = document.getElementById('form-status');
const toastContainer = document.getElementById('toast-container');

let selectedStudentId = null;

async function fetchStudents() {
  try {
    const response = await fetch(API_BASE);
    const data = await response.json();
    renderStudentRows(data);
    showToast('Student list loaded', 'success');
  } catch (error) {
    showToast('Unable to load students. Make sure the backend is running.', 'error');
  }
}

function renderStudentRows(students) {
  tableBody.innerHTML = students
    .map((student) => {
      return `
        <tr>
          <td>${student.id}</td>
          <td>${student.name}</td>
          <td>${student.email}</td>
          <td>${student.course}</td>
          <td>${student.level}</td>
          <td>
            <button class="action-button edit" onclick="editStudent(${student.id})">Edit</button>
            <button class="action-button delete" onclick="deleteStudent(${student.id})">Delete</button>
          </td>
        </tr>`;
    })
    .join('');
}

window.editStudent = async function (id) {
  try {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) {
      throw new Error('Student not found');
    }

    const student = await response.json();
    selectedStudentId = id;
    formStatus.textContent = 'Update';
    form.name.value = student.name;
    form.email.value = student.email;
    form.course.value = student.course;
    form.level.value = student.level;
    showToast('Editing student details', 'success');
  } catch (error) {
    showToast('Unable to load student details.', 'error');
  }
};

window.deleteStudent = async function (id) {
  if (!confirm('Delete this student permanently?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Delete failed');
    }
    await fetchStudents();
    resetForm();
    showToast('Student deleted successfully', 'success');
  } catch (error) {
    showToast('Unable to delete student.', 'error');
  }
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    course: form.course.value.trim(),
    level: form.level.value
  };

  if (!payload.name || !payload.email || !payload.course || !payload.level) {
    showToast('All fields are required.', 'error');
    return;
  }

  try {
    const method = selectedStudentId ? 'PUT' : 'POST';
    const requestUrl = selectedStudentId ? `${API_BASE}/${selectedStudentId}` : API_BASE;

    const response = await fetch(requestUrl, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.errors ? data.errors[0].msg : data.message || 'Save failed');
    }

    await fetchStudents();
    resetForm();
    showToast(`Student ${selectedStudentId ? 'updated' : 'created'} successfully`, 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
});

refreshButton.addEventListener('click', fetchStudents);
resetButton.addEventListener('click', resetForm);

function resetForm() {
  selectedStudentId = null;
  form.reset();
  formStatus.textContent = 'Create';
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<p class="toast-title">${type === 'error' ? 'Error' : 'Success'}</p><p class="toast-message">${message}</p>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3200);
}

fetchStudents();
