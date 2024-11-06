document.addEventListener("DOMContentLoaded", function () {
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    const monthNames = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
    
    if (document.getElementById('calendar')) {
        renderCalendar(currentMonth, currentYear);

        document.getElementById('prev-month')?.addEventListener('click', function () {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar(currentMonth, currentYear);
        });

        document.getElementById('next-month')?.addEventListener('click', function () {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar(currentMonth, currentYear);
        });


        fetch('/events')
            .then(response => response.json())
            .then(events => {
                events.forEach(event => {
                    displayEvent(event);
                });
            });
    }

    document.getElementById('event-form')?.addEventListener('submit', function (e) {
        e.preventDefault();

        const first_name = document.getElementById('first_name').value;
        const last_name = document.getElementById('last_name').value;
        const date = document.getElementById('date').value;
        const description = document.getElementById('description').value;
        const uwagi = document.getElementById('uwagi').value;

        const event = { first_name, last_name, date, description, uwagi };

        fetch('/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        })
        .then(response => response.json())
        .then(data => {
            displayEvent(data);
            document.getElementById('event-form').reset();
        });
    });


    document.getElementById('search-form')?.addEventListener('submit', function (e) {
        e.preventDefault();

        const query = document.getElementById('search-query').value;

        fetch(`/search?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(results => {
                displaySearchResults(results);
            });
    });


    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('delete-btn')) {
            const eventId = e.target.getAttribute('data-event-id');
            if (confirm('Czy na pewno chcesz usunąć to wydarzenie?')) {
                fetch(`/delete_event/${eventId}`, {
                    method: 'DELETE',
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Event deleted successfully');
                    // If we're on the day view page, remove the event's row
                    const eventRow = e.target.closest('tr');
                    if (eventRow) {
                        eventRow.remove();
                    }
                    // If we're on the search page, refresh the search results
                    const searchForm = document.getElementById('search-form');
                    if (searchForm) {
                        searchForm.dispatchEvent(new Event('submit'));
                    }
                })
                .catch(error => {
                    console.error('Error deleting event:', error);
                    alert('Wystąpił błąd podczas usuwania wydarzenia.');
                });
            }
        }
    });

    function renderCalendar(month, year) {
        const calendar = document.getElementById('calendar');
        if (!calendar) return;
        
        calendar.innerHTML = '';

        const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
            monthDays[1] = 29;
        }

        const firstDay = new Date(year, month, 1).getDay();
        const adjustedFirstDay = (firstDay + 6) % 7; // Adjust to start with Monday

        document.getElementById('month-year').textContent = `${monthNames[month]} ${year}`;

        for (let i = 0; i < adjustedFirstDay; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('day');
            calendar.appendChild(emptyDiv);
        }

        for (let i = 1; i <= monthDays[month]; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            dayDiv.textContent = i;
            dayDiv.addEventListener('click', function () {
                window.location.href = `/day/${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            });
            calendar.appendChild(dayDiv);
        }
    }

    function displayEvent(event) {
        const dayDivs = document.querySelectorAll('#calendar .day');
        dayDivs.forEach(dayDiv => {
            if (dayDiv.textContent == new Date(event.date).getDate()) {
                dayDiv.classList.add('event');
                dayDiv.title = `${event.first_name} ${event.last_name}\n${event.description}`;
            }
        });
    }

    function displaySearchResults(results) {
        const searchResultsContainer = document.getElementById('search-results');
        if (!searchResultsContainer) return;

        searchResultsContainer.innerHTML = '';

        if (results.length === 0) {
            searchResultsContainer.textContent = 'Brak wyników.';
            return;
        }

        const ul = document.createElement('ul');
        results.forEach(result => {
            const li = document.createElement('li');
            li.innerHTML = `${result.first_name} ${result.last_name} - ${result.date} - ${result.description} ${result.deleteButton}`;
            ul.appendChild(li);
        });

        searchResultsContainer.appendChild(ul);
    }


    document.querySelectorAll('.status-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const eventId = this.dataset.eventId;
            const status = this.dataset.status;
            const isChecked = this.checked;
            
            if (!isChecked) {
                if (confirm(`Czy na pewno chcesz odznaczyć status "${status}"?`)) {
                    updateEventStatus(eventId, status, isChecked);
                } else {
                    this.checked = true;
                }
            } else {
                updateEventStatus(eventId, status, isChecked);
            }
        });
    });

    document.querySelectorAll('.wytloczenie-input, .odebranie-input, .uwagi-content').forEach(element => {
        element.addEventListener('blur', function() {
            const eventId = this.getAttribute('data-event-id');
            const value = this.textContent;
            let field;
            
            if (this.classList.contains('wytloczenie-input')) {
                field = 'wytloczenie';
            } else if (this.classList.contains('odebranie-input')) {
                field = 'odebranie';
            } else if (this.classList.contains('uwagi-content')) {
                field = 'uwagi';
            }
            
            if (field) {
                updateEventField(eventId, field, value);
            }
        });
    });

    function updateEventField(eventId, field, value) {
        fetch(`/update_event/${eventId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ [field]: value })
        })
        .then(response => response.json())
        .then(data => console.log(`${field} updated successfully`))
        .catch(error => console.error(`Error updating ${field}:`, error));
    }

    function updateEventStatus(eventId, status, isChecked) {
        fetch(`/update_event/${eventId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ [status]: isChecked })
        })
        .then(response => response.json())
        .then(data => console.log('Status updated successfully'))
        .catch(error => console.error('Error updating status:', error));
    }

    window.deleteEvent = function(eventId) {
        if (confirm('Czy na pewno chcesz usunąć to wydarzenie?')) {
            fetch('/delete_event/' + eventId, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Błąd podczas usuwania');
                }
                return response.json();
            })
            .then(data => {
                console.log('Wydarzenie zostało usunięte');
                const eventElement = document.querySelector(`[data-event-id="${eventId}"]`).closest('tr');
                if (eventElement) {
                    eventElement.remove();
                }
            })
            .catch(error => {
                console.error('Błąd podczas usuwania wydarzenia:', error);
                alert('Wystąpił błąd podczas usuwania wydarzenia. Spróbuj ponownie.');
            });
        }
    };

});