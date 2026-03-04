// Function to load memos from localStorage
function loadMemos() {
    const memos = JSON.parse(localStorage.getItem('memos')) || [];
    const table = document.querySelector('#memosList table');
    
    // Clear existing rows except header
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    
    // Add each memo to the table
    memos.forEach((memo, index) => {
        addMemoToTable(memo, index);
    });
}

// Function to add a memo to the table
function addMemoToTable(memo, index) {
    const table = document.querySelector('#memosList table');
    const row = table.insertRow();
    
    // Add cells for subject, priority, status, and actions
    const subjectCell = row.insertCell();
    const priorityCell = row.insertCell();
    const statusCell = row.insertCell();
    const deleteCell = row.insertCell();
    const completeCell = row.insertCell();
    
    // Set cell contents
    subjectCell.textContent = memo.subject;
    priorityCell.textContent = memo.priority;
    statusCell.textContent = memo.status || 'Pending';
    
    // Add delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'pure-button';
    deleteButton.onclick = () => deleteMemo(index);
    deleteCell.appendChild(deleteButton);
    
    // Add complete button
    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.className = 'pure-button';
    completeButton.onclick = () => toggleComplete(index);
    completeCell.appendChild(completeButton);
}

// Function to delete a memo
function deleteMemo(index) {
    const memos = JSON.parse(localStorage.getItem('memos')) || [];
    memos.splice(index, 1);
    localStorage.setItem('memos', JSON.stringify(memos));
    loadMemos();
}

// Function to toggle memo completion status
function toggleComplete(index) {
    const memos = JSON.parse(localStorage.getItem('memos')) || [];
    memos[index].status = memos[index].status === 'Completed' ? 'Pending' : 'Completed';
    localStorage.setItem('memos', JSON.stringify(memos));
    loadMemos();
}

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    const subject = document.getElementById('memo-subject').value;
    const priority = document.getElementById('memo-priority').value;
    
    if (!subject) {
        alert('Please enter a subject');
        return;
    }
    
    const memo = {
        subject,
        priority,
        status: 'Pending',
        timestamp: new Date().toISOString()
    };
    
    // Get existing memos and add new one
    const memos = JSON.parse(localStorage.getItem('memos')) || [];
    memos.push(memo);
    localStorage.setItem('memos', JSON.stringify(memos));
    
    // Add to table
    addMemoToTable(memo, memos.length - 1);
    
    // Clear form
    document.getElementById('memo-subject').value = '';
    document.getElementById('memo-priority').value = 'Low';
    
    // Track the event in Amplitude
    amplitude.track("Memo Added", {
        priority: priority
    });
}

// Add event listener when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('memo-input-form');
    form.addEventListener('submit', handleFormSubmit);
    
    // Load existing memos
    loadMemos();
}); 
