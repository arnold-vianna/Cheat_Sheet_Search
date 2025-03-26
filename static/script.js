document.addEventListener("DOMContentLoaded", () => {
    // Trigger search when the theme changes
    document.getElementById("themeSelect").addEventListener("change", search);

    // Initial search to load results for the default theme
    search();
});

// Helper function to escape special characters for JavaScript strings
function escapeForJavaScript(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

function search() {
    const theme = document.getElementById("themeSelect").value;
    const commandQuery = document.getElementById("commandSearch").value;
    const descriptionQuery = document.getElementById("descriptionSearch").value;

    fetch("/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, command_query: commandQuery, description_query: descriptionQuery })
    })
    .then(response => response.json())
    .then(data => {
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "";

        data.forEach(item => {
            const escapedCommand = escapeForJavaScript(item.command);
            const escapedTheme = escapeForJavaScript(item.theme);
            const escapedDescription = escapeForJavaScript(item.description);
            const card = `
                <div class="col-md-4 mb-4">
                    <div class="card text-light position-relative">
                        <div class="card-body">
                            <h5 class="card-title">${item.command}</h5>
                            <p class="card-text">${item.description}</p>
                            <p class="card-text"><small class="text-muted">Theme: ${item.theme}</small></p>
                            <button class="btn btn-sm btn-primary btn-copy" onclick="copyToClipboard('${escapedCommand}')">Copy</button>
                            <button class="btn btn-sm btn-danger btn-remove" onclick="deleteCommand('${escapedTheme}', '${escapedCommand}', '${escapedDescription}')">Remove</button>
                        </div>
                    </div>
                </div>
            `;
            resultsDiv.innerHTML += card;
        });
    });
}

function clearSearch(inputId) {
    document.getElementById(inputId).value = "";
    search();
}

function copyToClipboard(text) {
    // Try using the modern Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert("Copied to clipboard!");
            })
            .catch(err => {
                console.error("Failed to copy using Clipboard API:", err);
                // Fallback to the older method
                fallbackCopyToClipboard(text);
            });
    } else {
        // Fallback for browsers that don't support the Clipboard API
        fallbackCopyToClipboard(text);
    }
}

// Fallback method for copying to clipboard using document.execCommand
function fallbackCopyToClipboard(text) {
    try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        // Avoid scrolling to bottom
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        if (successful) {
            alert("Copied to clipboard!");
        } else {
            alert("Failed to copy to clipboard. Please copy manually.");
        }
    } catch (err) {
        console.error("Fallback copy failed:", err);
        alert("Failed to copy to clipboard. Please copy manually.");
    }
}

function createTheme() {
    const name = prompt("Enter the name of the new theme:");
    if (!name) return;

    fetch("/create_theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            // Update theme dropdowns
            const themeSelect = document.getElementById("themeSelect");
            const modalThemeSelect = document.getElementById("modalThemeSelect");
            themeSelect.innerHTML = "";
            modalThemeSelect.innerHTML = "";
            data.themes.forEach(theme => {
                themeSelect.innerHTML += `<option value="${theme}">${theme}</option>`;
                modalThemeSelect.innerHTML += `<option value="${theme}">${theme}</option>`;
            });
            alert("Theme created successfully!");
            search();
        }
    });
}

function addCommand() {
    const theme = document.getElementById("modalThemeSelect").value;
    const command = document.getElementById("modalCommand").value;
    const description = document.getElementById("modalDescription").value;

    fetch("/add_command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, command, description })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert(data.message);
            document.getElementById("modalCommand").value = "";
            document.getElementById("modalDescription").value = "";
            document.getElementById("addCommandModal").querySelector(".btn-close").click();
            search();
        }
    });
}

function deleteCommand(theme, command, description) {
    if (!confirm(`Are you sure you want to delete the command "${command}" from theme "${theme}"?`)) {
        return;
    }

    fetch("/delete_command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, command, description })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert(data.message);
            search();
        }
    });
}

function deleteTheme() {
    const theme = document.getElementById("themeSelect").value;
    if (!theme) {
        alert("Please select a theme to delete.");
        return;
    }

    if (!confirm(`Are you sure you want to delete the theme "${theme}" and all its commands?`)) {
        return;
    }

    fetch("/delete_theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            // Update theme dropdowns
            const themeSelect = document.getElementById("themeSelect");
            const modalThemeSelect = document.getElementById("modalThemeSelect");
            themeSelect.innerHTML = "";
            modalThemeSelect.innerHTML = "";
            data.themes.forEach(theme => {
                themeSelect.innerHTML += `<option value="${theme}">${theme}</option>`;
                modalThemeSelect.innerHTML += `<option value="${theme}">${theme}</option>`;
            });
            alert("Theme deleted successfully!");
            search();
        }
    });
}