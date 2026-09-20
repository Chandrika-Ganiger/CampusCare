let reports = [];

let selectedIssueId = null;

let currentFilter = "All";


// ===============================
// LOAD REPORTS
// ===============================

function loadReports() {

    fetch("https://540o2ggrqj.execute-api.ap-south-1.amazonaws.com/CampusCareIssueHandler")

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Failed to load issues: " + response.status
                );
            }

            return response.json();
        })

        .then(data => {

            reports = data.issues || [];

            console.log("AWS ISSUES:", reports);

            displayReports(reports);
        })

        .catch(error => {

            console.error(
                "AWS LOAD ERROR:",
                error
            );

            document.getElementById(
                "reportsContainer"
            ).innerHTML = `
                <div class="empty">
                    ❌ Failed to load issues from AWS.
                    <br><br>
                    Please try again.
                </div>
            `;
        });
}


// ===============================
// DISPLAY REPORTS
// ===============================

function displayReports(data) {

    const container =
        document.getElementById(
            "reportsContainer"
        );

    updateStats(data);

    if (data.length === 0) {

        container.innerHTML = `

            <div class="empty">

                📭

                <br><br>

                No student reports found.

            </div>

        `;

        return;
    }


    container.innerHTML =
        data.map(issue => {

            const statusClass =
                issue.status === "Pending"
                    ? "pending"
                    : issue.status === "In Progress"
                        ? "progress"
                        : "cleared";


            return `

                <div class="issue">

                    <div class="issue-top">

                        <div>

                            <div class="category">

                                ${getCategoryIcon(
                                    issue.category
                                )}

                                ${escapeHTML(
                                    issue.category
                                )}

                            </div>


                            <h3>

                                ${escapeHTML(
                                    issue.description
                                )}

                            </h3>


                            <div class="details">

                                <span>
                                    👤
                                    ${escapeHTML(
                                        issue.studentName
                                    )}
                                </span>

                                <span>
                                    📧
                                    ${escapeHTML(
                                        issue.studentEmail
                                    )}
                                </span>

                                <span>
                                    📍
                                    ${escapeHTML(
                                        issue.building
                                    )}
                                </span>

                                <span>
                                    🚪
                                    ${escapeHTML(
                                        issue.room || "N/A"
                                    )}
                                </span>

                            </div>

                        </div>


                        <span class="status ${statusClass}">

                            ${escapeHTML(
                                issue.status
                            )}

                        </span>

                    </div>


                    <div class="actions">

                        <button
                            class="btn secondary"
                            onclick="openUpdate('${issue.issueId}')">

                            Update Status

                        </button>


                        ${
                            issue.status === "Pending"

                            ?

                            `
                            <button
                                class="btn primary"
                                onclick="quickUpdate(
                                    '${issue.issueId}',
                                    'In Progress'
                                )">

                                Start Work

                            </button>
                            `

                            :

                            ""
                        }


                        ${
                            issue.status === "In Progress"

                            ?

                            `
                            <button
                                class="btn success-btn"
                                onclick="quickUpdate(
                                    '${issue.issueId}',
                                    'Cleared'
                                )">

                                Mark Cleared

                            </button>
                            `

                            :

                            ""
                        }

                    </div>

                </div>

            `;

        }).join("");
}


// ===============================
// FILTER
// ===============================

function filterReports(
    filter,
    button
) {

    currentFilter = filter;

    document
        .querySelectorAll(".filter")
        .forEach(btn => {

            btn.classList.remove("active");

        });


    button.classList.add("active");


    if (filter === "All") {

        displayReports(reports);

        return;
    }


    const filtered =
        reports.filter(
            report =>
                report.status === filter
        );


    displayReports(filtered);
}


// ===============================
// OPEN UPDATE
// ===============================

function openUpdate(issueId) {

    selectedIssueId = issueId;


    const issue =
        reports.find(
            item =>
                item.issueId === issueId
        );


    if (!issue) return;


    document.getElementById(
        "newStatus"
    ).value = issue.status;


    document.getElementById(
        "adminMessage"
    ).value =
        issue.adminMessage || "";


    document
        .getElementById("updateModal")
        .classList.add("show");
}


// ===============================
// CLOSE MODAL
// ===============================

function closeModal() {

    document
        .getElementById("updateModal")
        .classList.remove("show");

    selectedIssueId = null;
}


// ===============================
// SAVE UPDATE - AWS
// ===============================

function saveUpdate() {

    if (!selectedIssueId) return;


    const status =
        document.getElementById(
            "newStatus"
        ).value;


    const message =
        document.getElementById(
            "adminMessage"
        ).value.trim();


    fetch(
        "https://540o2ggrqj.execute-api.ap-south-1.amazonaws.com/CampusCareIssueHandler",
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                issueId:
                    selectedIssueId,

                status:
                    status,

                adminMessage:
                    message

            })
        }
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "AWS update failed: " +
                response.status
            );
        }


        return response.json();
    })


    .then(data => {

        console.log(
            "AWS UPDATE SUCCESS:",
            data
        );


        const index =
            reports.findIndex(
                item =>
                    item.issueId ===
                    selectedIssueId
            );


        if (index !== -1) {

            reports[index].status =
                status;


            reports[index].adminMessage =
                message;


            reports[index].updatedAt =
                new Date().toISOString();


            createStudentNotification(
                reports[index]
            );
        }


        closeModal();


        refreshDisplay();
    })


    .catch(error => {

        console.error(
            "AWS UPDATE ERROR:",
            error
        );


        alert(
            "Failed to update issue. Please try again."
        );
    });
}


// ===============================
// QUICK UPDATE
// ===============================

function quickUpdate(
    issueId,
    status
) {

    const index =
        reports.findIndex(
            item =>
                item.issueId === issueId
        );


    if (index === -1) return;


    reports[index].status =
        status;


    if (status === "In Progress") {

        reports[index].adminMessage =
            "Our maintenance team is currently working on this issue.";
    }


    if (status === "Cleared") {

        reports[index].adminMessage =
            "Your reported issue has been cleared. Thank you for helping improve the campus.";
    }


    reports[index].updatedAt =
        new Date().toISOString();


    localStorage.setItem(
        "campuscare_reports",
        JSON.stringify(reports)
    );


    createStudentNotification(
        reports[index]
    );


    refreshDisplay();
}


// ===============================
// STUDENT NOTIFICATION
// ===============================

function createStudentNotification(
    issue
) {

    if (!issue) return;


    const key =
        "campuscare_notifications_" +
        issue.studentEmail;


    const notifications =
        JSON.parse(
            localStorage.getItem(key)
        ) || [];


    notifications.unshift({

        issueId:
            issue.issueId,

        status:
            issue.status,

        message:
            issue.adminMessage,

        createdAt:
            new Date().toISOString()

    });


    localStorage.setItem(
        key,
        JSON.stringify(notifications)
    );
}


// ===============================
// STATS
// ===============================

function updateStats(data) {

    const total =
        data.length;


    const pending =
        data.filter(
            x =>
                x.status === "Pending"
        ).length;


    const progress =
        data.filter(
            x =>
                x.status === "In Progress"
        ).length;


    const cleared =
        data.filter(
            x =>
                x.status === "Cleared"
        ).length;


    document.getElementById(
        "totalIssues"
    ).textContent = total;


    document.getElementById(
        "pendingIssues"
    ).textContent = pending;


    document.getElementById(
        "progressIssues"
    ).textContent = progress;


    document.getElementById(
        "clearedIssues"
    ).textContent = cleared;
}


// ===============================
// ICONS
// ===============================

function getCategoryIcon(
    category
) {

    const icons = {

        "Wi-Fi / Internet":
            "📶",

        "Fan":
            "🌀",

        "Light":
            "💡",

        "Smartboard":
            "🖥️",

        "Power / Socket":
            "🔌"

    };


    return (
        icons[category] ||
        "🛠️"
    );
}


// ===============================
// ESCAPE HTML
// ===============================

function escapeHTML(
    value
) {

    return String(
        value || ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


// ===============================
// REFRESH
// ===============================

function refreshDisplay() {

    if (currentFilter === "All") {

        displayReports(
            reports
        );

    } else {

        displayReports(

            reports.filter(
                report =>
                    report.status ===
                    currentFilter
            )

        );
    }
}


// ===============================
// START
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    loadReports
);