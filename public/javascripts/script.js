/* SELECTORS */
const tbody = document.querySelector('table tbody');

/* EVENT LISTENERS */
document.addEventListener('DOMContentLoaded', loadingData);

/* FUNCTIONS */
async function loadingData() {
    await fetch('http://localhost:8000/api/endpoints')
        .then(res => res.json())
        .then(data => renderEndpoints(data))
        .catch(error => console.error('Error fetching data:', error));
}

function renderEndpoints(data) {
    data.forEach((element, index) => {
        const { path, methods, middlewares } = element;
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${path}</td>
            <td>${methods[0]}</td>
            <td>${middlewares.join(', ')}</td>
        `;
        
        tbody.appendChild(tr);
    });
}
