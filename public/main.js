(() => {
  'use strict'
  const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.forEach(tooltipTriggerEl => {
    new bootstrap.Tooltip(tooltipTriggerEl)
  })
})();
const studentIdsEl = document.querySelector('input[name="studentIds"]');
if(studentIdsEl) {
  const studentIds = JSON.parse(studentIdsEl.value);
  [...document.querySelectorAll('tr.student-item')].forEach(tr => {
    console.log(tr);
    const checkboxEl= tr.querySelector('input');
    const studentId = parseInt(tr.dataset.id);
    if(studentIds.includes(studentId)) {
      checkboxEl.checked = true;
    }
    checkboxEl.addEventListener('change', () => {
      if(studentIds.includes(studentId)) {
        studentIds.splice(studentIds.indexOf(studentId), 1);
      } else {
        studentIds.push(studentId);
      }
      studentIdsEl.value = JSON.stringify(studentIds);
    });
  });
}
const scoreInputs = document.querySelectorAll('input.score-input');
const scoreDataEl = document.querySelector('input[name="scoreData"]');

if(scoreInputs && scoreDataEl) {
  // const classroomId = document.querySelector('input[name="classroomId"]').value;
  // const subjectId = document.querySelector('input[name="subjectId"]').value;
  // const semester = document.querySelector('input[name="semester"]').value;
  let scoreData = JSON.parse(scoreDataEl.value);
  [...scoreInputs].forEach(input => {
    input.addEventListener('change', (e) => {
      if (!scoreData[input.dataset.studentId]) scoreData[input.dataset.studentId] = {};
      scoreData[input.dataset.studentId][input.dataset.type] = parseFloat(input.value);
      scoreDataEl.value = JSON.stringify(scoreData);
      console.log(scoreData);
    });
  });
}

const deleteBtns = document.querySelectorAll('.delete-btn');
if(deleteBtns) {
  [...deleteBtns].forEach(btn => {
    btn.addEventListener('click', (e) => {
      if(confirm(`Bạn có chắc muốn xoá ${btn.dataset.name} không?`)) {
        console.log('xoa');
        axios.delete(btn.dataset.action).then(res => {
          if (res.status == 200) {
            window.location.reload();
          }
        });
      }
      e.preventDefault();
    });
  });
}