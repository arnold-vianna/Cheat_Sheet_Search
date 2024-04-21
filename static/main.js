document.addEventListener('DOMContentLoaded', function() {
    // Function to toggle the dark theme
    var toggleDarkTheme = function() {
        document.body.classList.toggle('dark-theme');
    };

    // Function to perform the search
    var performSearch = function(event, searchType) {
        event.preventDefault();
        var query = document.getElementById(searchType === 'command' ? 'query' : 'query-description').value.toLowerCase();
        var filename = document.getElementById('json-files').value;
        fetch('/get_json_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filename: filename })
        })
        .then(response => response.json())
        .then(data => {
            var resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = ''; // Clear the existing results

            // Filter the cheat sheet data based on the search query
            var searchResults = Object.entries(data).filter(([command, description]) => {
                if (searchType === 'command') {
                    return query === '' || command.toLowerCase().includes(query);
                } else {
                    return query === '' || description.toLowerCase().includes(query);
                }
            });

            // Append the search results to the results div
            searchResults.forEach(function([command, description]) {
                var cheatSheetDiv = document.createElement('div');
                cheatSheetDiv.className = 'col-md-12 mb-4';
                cheatSheetDiv.innerHTML = `
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">
                                ${command}
                                <button class="btn btn-sm btn-primary copy-button" data-command="${command}">Copy</button>
                            </h5>
                            <p class="card-text">${description}</p>
                        </div>
                    </div>
                `;
                resultsDiv.appendChild(cheatSheetDiv);

                // Attach the copy event listener to the new copy button
                var copyButton = cheatSheetDiv.querySelector('.copy-button');
                copyButton.addEventListener('click', copyToClipboard);
            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    };

    // Function to clear the search and display all commands
    var clearSearch = function(searchType) {
        document.getElementById(searchType === 'command' ? 'query' : 'query-description').value = '';
        performSearch(new Event('submit'), searchType);
    };

    // Function to populate the dropdown with JSON filenames
    var populateDropdown = function() {
        fetch('/get_json_files')
        .then(response => response.json())
        .then(filenames => {
            var dropdown = document.getElementById('json-files');
            dropdown.innerHTML = '<option value="">All JSON files</option>';
            filenames.forEach(function(filename) {
                var option = document.createElement('option');
                option.value = filename;
                option.text = filename.split('.')[0]; // Use only the first part of the filename
                dropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    };

    // Function to copy command to clipboard
    var copyToClipboard = function(event) {
        var command = event.target.dataset.command;
        navigator.clipboard.writeText(command).then(function() {
            // alert('Command copied to clipboard: ' + command);
        }, function(err) {
            console.error('Could not copy command: ', err);
        });
    };

    // Attach event listeners to the theme toggle button, search form, and clear search button
    document.getElementById('theme-toggle').addEventListener('click', toggleDarkTheme);
    document.getElementById('search-form').addEventListener('submit', (event) => performSearch(event, 'command'));
    document.getElementById('clear-search').addEventListener('click', () => clearSearch('command'));
    document.getElementById('json-files').addEventListener('change', () => performSearch(new Event('submit'), 'command'));
    document.getElementById('search-description-form').addEventListener('submit', (event) => performSearch(event, 'description'));
    document.getElementById('clear-search-description').addEventListener('click', () => clearSearch('description'));

    // Populate the dropdown when the page loads
    populateDropdown();

    // Load all commands when the page loads
    performSearch(new Event('submit'), 'command');
});