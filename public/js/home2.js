$(document).ready(function () {
    var apiUrl = "/api/testcases";
    console.log("Request URL:", apiUrl); // Logging the request URL

    // Fetch test cases data from the proxy API
    $.ajax({
        url: apiUrl,
        method: "GET",
        success: function (data) {
            populateTable(data.values);
        },
        error: function () {
            alert("Failed to fetch data from the API.");
        }
    });

    // Populate the table with test cases data
    function populateTable(values) {
        var tableBody = $("#data-table tbody");

        // Iterate over each item in the JSON values array
        $.each(values, function (index, values) {
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
            // row.append(
            //     $("<td></td>")
            //         .text("Loading...")
            //         .attr("id", "folder-" + index)
            // );
            
            row.append($("<td></td>").text(values.customFields["Epic Key"]));
            row.append($("<td></td>").text(values.customFields["Automated Test Failure Reason"]));

            tableBody.append(row); // Add the row to the table body

            // Fetch folder name
            // fetchFolderName(values, index);
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
    }

    // Fetch folder name from the API
    function fetchFolderName(values, index) {
        var apiUrl = "/api/folders/" + values.folder["id"];
        console.log("Request URL:", apiUrl); // Logging the request URL

        if (values.folder && values.folder["id"]) {
            // Fetch folder name from the API
            $.ajax({
                url: apiUrl,
                method: "GET",
                success: function (folderData) {
                    var folderName = folderData.name; // Assuming the response contains a 'name' field
                    $("#folder-" + index).text(folderName);

                    // After updating the folder name, if using DataTables, redraw the table
                    if ($.fn.DataTable.isDataTable('#data-table')) {
                        $('#data-table').DataTable().rows().invalidate().draw();
                    }
                },
                error: function () {
                    $("#folder-" + index).text("Error");
                },
            });
        } else {
            $("#folder-" + index).text("No Folder");
        }
    }

    // Search using top search bar
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#data-table tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});