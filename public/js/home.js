$(document).ready(function () {
    
    // Retrieve JSON data from "testcases.json" file
    $.getJSON("data/testcases.json", function (data) {
        var tableBody = $("#data-table tbody");

        // Iterate over each item in the JSON values array
        $.each(data.values, function (index, values) {
            var row = $("<tr></tr>");
            var m3qa_link = $("<a></a>")
                .attr("href", "https://inforwiki.atlassian.net/projects/M3QA?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kanoah.test-manager__main-project-page#!/testCase/" + values.key)
                .attr("target", "_blank")
                .text(values.key);
            var tcm3_link = $("<a></a>")
                .attr("href", "https://jira.infor.com/browse/" + values.customFields["TCM3 ID"])
                .attr("target", "_blank")
                .text(values.customFields["TCM3 ID"]);

            row.append($("<td></td>").append(m3qa_link));
            row.append($("<td></td>").append(tcm3_link));
            row.append($("<td></td>").text(values.customFields["Test Type"]));
            row.append($("<td></td>").text(values.name));
            row.append($("<td></td>").text(values.customFields["Qualification Level"]));
            row.append($("<td></td>").text(values.labels));
            row.append($("<td></td>").text(values.customFields["Framework"]));
            // Check if values.folder is not null before accessing 'id'
            var folderId = values.folder ? values.folder.id : '';
            row.append($("<td></td>").text(folderId));
            
            row.append($("<td></td>").text(values.customFields["Epic Key"]));
            row.append($("<td></td>").text(values.customFields["Automated Test Failure Reason"]));

            tableBody.append(row); // Add the row to the table body
        });

        // Initialize DataTables with sorting enabled and individual column searching
        var dataTable = $('#data-table').DataTable({
            ordering: true, // Enable ordering (sorting)
            columnDefs: [{
                targets: '_all', // Apply sorting to all columns
                orderable: true // Enable sorting on all columns
            }]
        });

        // Apply individual column searching
        $('#searchRow input').on('keyup change', function () {
            var index = $(this).closest('th').index();
            dataTable.column(index).search(this.value).draw();
        });
    });

    // Search functionality
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#data-table tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

function fetchFolderName(values) {
    $.ajax({
        url: "https://api.zephyrscale.smartbear.com/v2/folders/" + values.folder['id'],
        method: "GET",
        headers: {
            "Authorization": "Bearer <TOKEN>"  // Replace with your actual token
        },
        success: function (folderData) {
            var folderName = folderData.name; // Assuming the response contains a 'name' field
            return folderName
        },
        error: function () {
            return null
        }
    });
}