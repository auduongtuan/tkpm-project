const studentIdsEl = document.querySelector('input[name="studentIds"]');
const studentIds = JSON.parse(studentIdsEl.value);
console.log(studentIds);
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