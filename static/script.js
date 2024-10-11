document.addEventListener("DOMContentLoaded", function () {
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    const monthNames = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
    const dayNames = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];
    const uwagi = document.getElementById('uwagi').value;
    const event = { first_name, last_name, date, description, uwagi };

    renderCalendar(currentMonth, currentYear);

    document.getElementById('prev-month').addEventListener('click', function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    document.getElementById('next-month').addEventListener('click', function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    // Fetch and display events
    fetch('/events')
        .then(response => response.json())
        .then(events => {
            events.forEach(event => {
                displayEvent(event);
            });
        });

    // Form submission handler
    document.getElementById('event-form').addEventListener('submit', function (e) {
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

    // Search form handler
    document.getElementById('search-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const query = document.getElementById('search-query').value;

        fetch(`/search?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(results => {
                displaySearchResults(results);
            });
    });

    function renderCalendar(month, year) {
        const calendar = document.getElementById('calendar');
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
        searchResultsContainer.innerHTML = '';

        if (results.length === 0) {
            searchResultsContainer.textContent = 'Brak wyników.';
            return;
        }

        const ul = document.createElement('ul');
        results.forEach(result => {
            const li = document.createElement('li');
            li.textContent = `${result.first_name} ${result.last_name} - ${result.date} - ${result.description}`;
            ul.appendChild(li);
        });

        searchResultsContainer.appendChild(ul);
    }
    function displaySearchResults(results) {
        const searchResultsContainer = document.getElementById('search-results');
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

    function deleteEvent(eventId) {
        if (confirm('Czy na pewno chcesz usunąć to wydarzenie?')) {
            fetch('/delete_event/' + eventId, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                console.log('Event deleted successfully');
                // Odśwież wyniki wyszukiwania
                document.getElementById('search-form').dispatchEvent(new Event('submit'));
            })
            .catch(error => {
                console.error('Error deleting event:', error);
            });
        }
    }
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('delete-btn')) {
            const eventId = e.target.dataset.eventId;
            deleteEvent(eventId);
        }
    });
    
    
});
