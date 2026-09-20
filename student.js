let selectedCategory = "Wi-Fi / Internet";


// ===============================
// CATEGORY SELECTION
// ===============================

function selectCategory(button, category) {

    document
        .querySelectorAll(".category")
        .forEach(btn => {

            btn.classList.remove("active");

        });

    button.classList.add("active");

    selectedCategory = category;

    document.getElementById("category").value =
        category;
}


// ===============================
// SUBMIT ISSUE
// ===============================

function submitIssue() {

    const name =
        document.getElementById("studentName").value.trim();

    const email =
        document.getElementById("studentEmail").value.trim();

    const category =
        document.getElementById("category").value;

    const building =
        document.getElementById("building").value.trim();

    const room =
        document.getElementById("room").value.trim();

    const description =
        document.getElementById("description").value.trim();


    // Validation

    if (!name) {

        alert("Please enter your name.");

        return;
    }


    if (!email) {

        alert("Please enter your college email.");

        return;
    }


    if (!building) {

        alert("Please enter the building.");

        return;
    }


    if (!description) {

        alert("Please describe the issue.");

        return;
    }


    // Create issue

    const issue = {

        issueId:
            "CC-" + Date.now(),

        studentName:
            name,

        studentEmail:
            email,

        category:
            category,

        building:
            building,

        room:
            room,

        description:
            description,

        status:
            "Pending",

        adminMessage:
            "",

        createdAt:
            new Date().toISOString()

    };
        alert(
        "Name: " + name +
        "\nEmail: " + email +
        "\nCategory: " + category +
        "\nBuilding: " + building +
        "\nRoom: " + room +
        "\nDescription: " + description
    );


    // Get previous reports

    const reports =
        JSON.parse(
            localStorage.getItem(
                "campuscare_reports"
            )
        ) || [];

// Send issue to AWS
const awsData = {
    studentName: name,
    studentEmail: email,
    category: category,
    building: building,
    room: room,
    description: description
};

fetch("https://540o2ggrqj.execute-api.ap-south-1.amazonaws.com/CampusCareIssueHandler", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(awsData)
})
.then(response => {
    if (!response.ok) {
        throw new Error("AWS request failed: " + response.status);
    }
    return response.json();
})
.then(data => {
    console.log("AWS SUCCESS:", data);
})
.catch(error => {
    console.error("AWS ERROR:", error);
});
// Add new report

    reports.unshift(issue);


    // Save

    localStorage.setItem(
        "campuscare_reports",
        JSON.stringify(reports)
    );


    // Save student email

    localStorage.setItem(
        "campuscare_student_email",
        email
    );


    // Clear form

    document.getElementById("building").value = "";

    document.getElementById("room").value = "";

    document.getElementById("description").value = "";


    // Show success

    document
        .getElementById("successModal")
        .classList.add("show");


    // Refresh reports

    loadStudentReports();
}


// ===============================
// LOAD STUDENT REPORTS
// ===============================

function loadStudentReports() {

    const email =
        localStorage.getItem(
            "campuscare_student_email"
        );


    const allReports =
        JSON.parse(
            localStorage.getItem(
                "campuscare_reports"
            )
        ) || [];


    const reports =
        email
            ? allReports.filter(
                report =>
                    report.studentEmail === email
            )
            : [];


    const container =
        document.getElementById(
            "studentReports"
        );


    if (reports.length === 0) {

        container.innerHTML = `
            <div class="empty">
                No reports yet.
            </div>
        `;

        return;
    }


    container.innerHTML =
        reports.map(report => {

            const statusClass =
                report.status === "Pending"
                    ? "pending"
                    : report.status === "In Progress"
                        ? "progress"
                        : "cleared";


            return `

                <div class="report">

                    <div class="report-top">

                        <div>

                            <div class="report-title">

                                ${getCategoryIcon(
                                    report.category
                                )}

                                ${escapeHTML(
                                    report.category
                                )}

                            </div>

                            <div class="report-description">

                                ${escapeHTML(
                                    report.description
                                )}

                            </div>

                        </div>


                        <span class="status ${statusClass}">

                            ${escapeHTML(
                                report.status
                            )}

                        </span>

                    </div>

                </div>

            `;

        }).join("");
}


// ===============================
// CATEGORY ICON
// ===============================

function getCategoryIcon(category) {

    const icons = {

        "Wi-Fi / Internet": "📶",

        "Fan": "🌀",

        "Light": "💡",

        "Smartboard": "🖥️",

        "Power / Socket": "🔌"

    };

    return icons[category] || "🛠️";
}


// ===============================
// SECURITY HELPER
// ===============================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ===============================
// CLOSE SUCCESS
// ===============================

function closeSuccess() {

    document
        .getElementById("successModal")
        .classList.remove("show");
}


// ===============================
// START APP
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    loadStudentReports
);