$(document).ready(function () {

    // Refresh Button Click Event
    $('#refreshPageBtn').on('click', function () {
        location.reload(); // Reload the entire page
    });

    // Show loading indicator
    $('#loading').show();

    var apiUrl = "/api/testcases";
    console.log("Request URL:", apiUrl); // Logging the request URL

    // Fetch test cases data from the proxy API
    $.ajax({
        url: apiUrl,
        method: "GET",
        success: function (data) {
            populateTable(data.values);
            $('#loading').hide();
        },
        error: function () {
            alert("Failed to fetch data from the API.");
            $('#loading').hide();
        }
    });

    // Initialize an empty cache object
    var folderCache = {};
    var folderApiUrl = "/api/folder";

    // Fetch folders and save to cache
    $.ajax({
        url: folderApiUrl,
        method: "GET",
        cache: true, // Enable caching
        success: function (folderData) {
            // Save the response to folderCache
            folderCache = folderData;
            // Optionally, you can process the folderData or trigger other actions
            console.log("Request URL:", folderApiUrl);
            console.log("Folder data cached:", folderCache);
        },
        error: function (xhr, status, error) {
            // Handle errors if any
            console.error("Error fetching folder data:", error);
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
            // row.append($("<td></td>").text(folderId));
            row.append(
                $("<td></td>")
                    .text("Loading...")
                    .attr("id", "folder-" + index)
            );
            
            row.append($("<td></td>").text(values.customFields["Epic Key"]));
            row.append($("<td></td>").text(values.customFields["Automated Test Failure Reason"]));

            tableBody.append(row); // Add the row to the table body

            // Fetch folder name
            fetchFolderName(values.folder, index);
        });

        // Initialize DataTables with sorting enabled and individual column searching
        var dataTable = $('#data-table').DataTable({
            ordering: false, // Enable ordering (sorting)
            columnDefs: [{
                targets: '_all', // Apply sorting to headers inside #headersLabels
                orderable: true // Enable sorting on these headers
            }, {
                targets: '#searchRow th', // Target the search row headers
                orderable: false // Disable sorting for search row headers
            }]
        });

        // Populate dropdown options for Test Type column
        var columnTestType = dataTable.column(2); // Test Type column index is 2 (zero-based index)
        var selectTestType = $('<select class="form-control form-control-sm"></select>')
            .appendTo($('#searchRow th:nth-child(3)')) // Append dropdown to Test Type column header
            .on('change', function () {
                var val = $.fn.dataTable.util.escapeRegex(
                    $(this).val()
                );

                columnTestType.search(val ? '^' + val + '$' : '^$', true, false).draw(); // Include blank filter

            });

            columnTestType.data().unique().sort().each(function (d, j) {
            selectTestType.append('<option value="' + d + '">' + d + '</option>');
        });

        // Populate dropdown options for Framework column
        var columnFramework = dataTable.column(6); // Framework column index is 2 (zero-based index)
        var selectFramework = $('<select class="form-control form-control-sm" ></select>')
            .appendTo($('#searchRow th:nth-child(7)')) // Append dropdown to Framework column header
            .on('change', function () {
                var val = $.fn.dataTable.util.escapeRegex(
                    $(this).val()
                );

                columnFramework.search(val ? '^' + val + '$' : '^$', true, false).draw(); // Include blank filter

            });

        columnFramework.data().unique().sort().each(function (d, j) {
            selectFramework.append('<option value="' + d + '">' + d + '</option>');
        });

        // Populate dropdown options for Framework column
        var columnFolder = dataTable.column(7); // Framework column index is 2 (zero-based index)
        var selectFolder = $('<select class="form-control form-control-sm"><option value="">Select Folder</option></select>')
            .appendTo($('#searchRow th:nth-child(8)')) // Append dropdown to Framework column header
            .on('change', function () {
                var val = $.fn.dataTable.util.escapeRegex(
                    $(this).val()
                );

                columnFolder.search(val ? '^' + val + '$' : '^$', true, false).draw(); // Include blank filter

            });
        
        columnFolder.data().unique().sort().each(function (d, j) {
            selectFolder.append('<option value="' + d + '">' + d + '</option>');
        });

        // Populate dropdown options for AUTO-XXX column
        var columnAuto = dataTable.column(9); // AUTO-XXX column index is 2 (zero-based index)
        var selectAuto = $('<select class="form-control form-control-sm"></select>')
            .appendTo($('#searchRow th:nth-child(10)')) // Append dropdown to AUTO-XXX column header
            .on('change', function () {
                var val = $.fn.dataTable.util.escapeRegex(
                    $(this).val()
                );

                columnAuto.search(val ? '^' + val + '$' : '^$', true, false).draw(); // Include blank filter

            });

        columnAuto.data().unique().sort().each(function (d, j) {
            selectAuto.append('<option value="' + d + '">' + d + '</option>');
        });

        // Populate dropdown options for Qualification Level column
        var qualificationLevels = ['','2', '3', '4', '6', '7']; // Hard-coded options
        var columnQualificationLevel = dataTable.column(4); // Qualification Level column index is 4 (zero-based index)
        var selectQualificationLevel = $('<select class="form-control form-control-sm"></select>')
            .appendTo($('#searchRow th:nth-child(5)')) // Append dropdown to Qualification Level column header
            .on('change', function () {
                var val = $.fn.dataTable.util.escapeRegex(
                    $(this).val()
                );

                columnQualificationLevel.search(val ? val : '', true, false).draw();

            });

        // Add options to the dropdown
        $.each(qualificationLevels, function (index, value) {
            selectQualificationLevel.append('<option value="' + value + '">' + value + '</option>');
        });

        // Apply individual column searching
        $('#searchRow input').on('keyup change', function () {
            var index = $(this).closest('th').index();
            dataTable.column(index).search(this.value).draw();
        });

        // Button click to filter M3 - Preconditions folder
        $('#filterPreconditions').on('click', function () {
            var filterValue = 'M3 - Preconditions';
            var currentFilter = dataTable.column(7).search();
            
            if (currentFilter === filterValue) {
                // If already filtered, reset to show all records
                dataTable.column(7).search('').draw();
            } else {
                // Otherwise, apply the filter
                dataTable.column(7).search(filterValue).draw();
            }
        });

        // Button click to filter M3 - Preconditions folder
        var notMainFilterActive = false; // Track if the notMain filter is active
        $('#filterMain').on('click', function () {
            var filterValue = 'M3 - Preconditions';

            if (notMainFilterActive) {
                // Reset filter to show all records
                dataTable.column(7).search('').draw();
                notMainFilterActive = false;
            } else {
                // Apply filter to show records not containing 'M3 - Preconditions'
                dataTable.column(7).search('^(?!.*' + filterValue + ').*$' , true, false).draw();
                notMainFilterActive = true;
            }
        });

        // Button click to reset all filters
        $('#resetFilters').on('click', function () {
            dataTable.search('').columns().search('').draw();
            $('#searchRow input').val(''); // Clear search input fields
            $('#searchRow select').val(''); // Clear dropdown selections
            notMainFilterActive = false; // Reset the notMain filter state
        });
    }

    // Fetch folder name from the cache
    function fetchFolderName(folder, index) {
        var folderName = '';
        $.each(folderCache.values, function (idx, folderItem) {
            if (folderItem.id === folder.id) {
                folderName = folderItem.name;
                return false; // Exit the loop once found
            }
        });

        // Update the table row with the folder name
        $("#folder-" + index).text(folderName || "Folder not found");
    }

    // Search using top search bar
    // $("#myInput").on("keyup", function () {
    //     var value = $(this).val().toLowerCase();
    //     $("#data-table tr").filter(function () {
    //         $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    //     });
    // });
});