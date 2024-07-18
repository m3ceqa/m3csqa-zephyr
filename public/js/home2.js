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
                .attr("class", "text-decoration-none")
                .attr("target", "_blank")
                .text(values.key);
            var tcm3_link = $("<a></a>")
                .attr("href", "https://jira.infor.com/browse/" + values.customFields["TCM3 ID"])
                .attr("class", "text-decoration-none")
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
            // row.append($("<td></td>").text(values.status));

            tableBody.append(row); // Add the row to the table body

            // Fetch folder name
            fetchFolderName(values.folder, index);
        });

        // Initialize DataTables with sorting enabled and individual column searching
        var dataTable = $('#data-table').DataTable({
            ordering: true, // Enable ordering (sorting)
            columnDefs: [{
                targets: '_all', // Apply sorting to headers inside #headersLabels
                orderable: true // Enable sorting on these headers
            }, {
                targets: '#searchRow th', // Target the search row headers
                orderable: false // Disable sorting for search row headers
            }]
        });

        // Populate dropdown options for Test Type column
        createDropdownFilter(dataTable, 2, 2, 'Select Test Type');

        // Populate dropdown options for Framework column
        createDropdownFilter(dataTable, 6, 6, 'Select Framework');

        // Populate dropdown options for Framework column
        createDropdownFilter(dataTable, 7, 7, 'Select Folder');

        // Populate dropdown options for AUTO-XXX column
        createDropdownFilter(dataTable, 9, 9, 'Select Failure');

        // Populate dropdown options for Qualification Level column
        var qualificationLevels = ['', '2', '3', '4', '6', '7']; // Hard-coded options
        createDropdownFilterWithOptions(dataTable, 4, 4, 'Select QL', qualificationLevels);

        // Populate dropdown options for Epic column
        createDropdownFilter(dataTable, 8, 8, 'Select Epic');

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
                $(this).removeClass('button-active'); // Remove the active class
            } else {
                // Apply filter to show records not containing 'M3 - Preconditions'
                dataTable.column(7).search('^(?!.*' + filterValue + ').*$' , true, false).draw();
                notMainFilterActive = true;
                $(this).addClass('button-active'); // Remove the active class
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

    function createDropdownFilter(dataTable, columnIndex, headerIndex, placeholder) {
        var column = dataTable.column(columnIndex); // Get the specified column
        var select = $('<select class="form-control form-control-sm"><option value="">' + placeholder + '</option></select>')
            .appendTo($('#searchRow th:nth-child(' + (headerIndex + 1) + ')')) // Append dropdown to specified column header
            .on('change', function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());
                column.search(val ? '^' + val + '$' : '^$', true, false).draw(); // Include blank filter
            });
    
        column.data().unique().sort().each(function (d, j) {
            select.append('<option value="' + d + '">' + d + '</option>');
        });
    }

    function createDropdownFilterWithOptions(dataTable, columnIndex, headerIndex, placeholder, options) {
        var column = dataTable.column(columnIndex); // Get the specified column
        var select = $('<select class="form-control form-control-sm"><option value="">' + placeholder + '</option></select>')
            .appendTo($('#searchRow th:nth-child(' + (headerIndex + 1) + ')')) // Append dropdown to specified column header
            .on('change', function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());
    
                if (val === '') {
                    // Filter for blanks
                    column.search('^$', true, false).draw();
                } else {
                    // Filter for selected value
                    column.search(val).draw();
                }
            });
    
        // Add options to the dropdown
        $.each(options, function (index, value) {
            select.append('<option value="' + value + '">' + value + '</option>');
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