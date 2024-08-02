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

    // Cache Folders
    var folderCache = {};
    var folderApiUrl = "/api/folder";
    fetchAndCacheResponseData(folderApiUrl, folderCache);

    // Cache Folders
    var statusesCache = {};
    var statusesApiUrl = "/api/statuses";
    fetchAndCacheResponseData(statusesApiUrl, statusesCache);

    function fetchAndCacheResponseData(ApiUrl, cacheData) {
        $.ajax({
            url: ApiUrl,
            method: "GET",
            cache: true, // Enable caching
            success: function (respData) {
                // Ensure cacheData is an object (not a string)
                if (typeof cacheData === 'object' && cacheData !== null) {
                    // Update cacheData with respData
                    Object.assign(cacheData, respData);
                    // Optionally, you can process the respData or trigger other actions
                    console.log("Request URL:", ApiUrl);
                    console.log("Data cached:", cacheData);
                } else {
                    // console.log("Data cached:", respData);
                    console.error("Error: cacheData is not an object or is null.");
                }
            },
            error: function (xhr, status, error) {
                // Handle errors if any
                console.error("Error fetching data:", error);
            }
        });
    }

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
            var epic_link = $("<a></a>")
                .attr("href", "https://inforwiki.atlassian.net/browse/" + values.customFields["Epic Key"])
                .attr("class", "text-decoration-none")
                .attr("target", "_blank")
                .text(values.customFields["Epic Key"]);

            row.append($("<td></td>").append(m3qa_link));
            row.append($("<td></td>").append(tcm3_link));
            row.append($("<td></td>").text(values.customFields["Testing Purpose"]));
            row.append($("<td></td>").text(values.name));
            row.append($("<td></td>").text(values.customFields["Qualification Level"]));
            row.append($("<td></td>").text(values.labels));
            row.append($("<td></td>").text(values.customFields["Framework"]));
            
            // Check if values.folder is not null before accessing 'id'
            row.append(
                $("<td></td>")
                    .text("Loading...")
                    .attr("id", "folder-" + index)
            );
            
            row.append($("<td></td>").append(epic_link));
            row.append($("<td></td>").text(values.customFields["Automated Test Failure Reason"]));
            row.append(
                $("<td></td>")
                    .text("Loading...")
                    .attr("id", "status-" + index)
            );
            row.append($("<td></td>").text(values.customFields["Test Objective"]));
            row.append($("<td></td>").text(values.customFields["Test Type"]));
            row.append($("<td></td>").text(values.customFields["Product(s)"]));
            row.append($("<td></td>").text(values.customFields["One Time Setup"]));
            row.append($("<td></td>").text(values.customFields["Automation Status"]));
            row.append($("<td></td>").text(values.customFields["Business Process"]));
            row.append($("<td></td>").text(values.customFields["Integrated Product"]));
            row.append($("<td></td>").text(values.customFields["State"]));
            row.append($("<td></td>").text(values.customFields["Test Technique"]));
            row.append($("<td></td>").text(values.customFields["Deployment Method"]));
            row.append($("<td></td>").text(values.customFields["Component/s"]));
            row.append($("<td></td>").text(values.customFields["Issue Type"]));
            row.append($("<td></td>").text(values.customFields["Automation Complexity"]));

            tableBody.append(row); // Add the row to the table body

            // Fetch folder name
            if (values.folder != null) {
                fetchFolderName(values.folder, index);
            } else {
                $("#folder-" + index).text("No folder");
            }
            fetchStatusName(values.status, index)
        });

        // Initialize DataTables with sorting enabled and individual column searching
        var dataTable = $('#data-table').DataTable({
            // responsive: true,
            order: [],
            layout: {
                topStart: 'info',
                topEnd: 'paging',
                bottomStart: 'pageLength',
                bottomEnd: null
            },
            // ordering: true, // Enable ordering (sorting)
            orderCellsTop: true,
            columnDefs: [
                {
                    targets: [5,6,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
                    visible: false
                },
                {
                    targets: '_all', // Apply sorting to headers inside #headersLabels
                    orderable: true // Enable sorting on these headers
                },
                {
                    targets: '#searchRow th', // Target the search row headers
                    orderable: false // Disable sorting for search row headers
                }
            ]
        });

        // Populate Column Customization Dropdown
        dataTable.columns().every(function(index) {
            var column = this;
            var title = $(column.header()).text();
            var checked = column.visible() ? 'checked' : ''; // Determine if the checkbox should be checked
            $('#column-customization-dropdown').append(
                `<li><a class="dropdown-item" href="#"><input type="checkbox" data-column="${index}" ${checked}> ${title}</a></li>`
            );
        });

        // Handle column visibility changes
        // $('#column-customization-dropdown input[type="checkbox"]').on('change', function() {
        //     var column = dataTable.column($(this).attr('data-column'));
        //     column.visible(!column.visible());
        //     updateSearchFilters(column); // Update filters when column visibility changes
        // });

        // Initialize filters on table load
        initializeFilters(dataTable);

        // Reinitialize filters when column visibility changes
        $('#column-customization-dropdown input[type="checkbox"]').on('change', function() {
            var columnIndex = $(this).attr('data-column');
            var isVisible = $(this).is(':checked');
            dataTable.column(columnIndex).visible(isVisible);
            initializeFilters(dataTable); // Reapply filters after visibility change
        });

        function removeExistingFilters() {
            // Remove existing dropdowns from the column headers
            $('#searchRow select').remove();
        }        

        function isColumnVisible(dataTable, columnIndex) {
            return dataTable.column(columnIndex).visible();
        }

        function createDropdownFilter(dataTable, columnIndex, headerIndex, placeholder) {
            var column = dataTable.column(columnIndex);
            var select = $('<select class="form-control form-control-sm"><option value="">' + placeholder + '</option></select>')
                .appendTo($('#searchRow th[aria-colindex="' + (headerIndex + 1) + '"]'))
                .on('change', function() {
                    var val = $.fn.dataTable.util.escapeRegex($(this).val());
                    column.search(val ? '^' + val + '$' : '^$', true, false).draw();
                });
    
            column.data().unique().sort().each(function(d) {
                select.append('<option value="' + d + '">' + d + '</option>');
            });
        }
    
        function createDropdownFilterWithComma(dataTable, columnIndex, headerIndex, placeholder) {
            var column = dataTable.column(columnIndex);
            var select = $('<select class="form-control form-control-sm"><option value="">' + placeholder + '</option></select>')
                .appendTo($('#searchRow th[aria-colindex="' + (headerIndex + 1) + '"]'))
                .on('change', function() {
                    var val = $(this).val();
                    if (val === '') {
                        column.search('^$', true, false).draw();
                    } else {
                        var escapedVal = $.fn.dataTable.util.escapeRegex(val);
                        column.search(escapedVal, true, false).draw();
                    }
                });
    
            var uniqueValues = new Set();
            column.data().each(function(data) {
                data.split(',').forEach(item => {
                    uniqueValues.add(item.trim());
                });
            });
    
            Array.from(uniqueValues).sort().forEach(function(value) {
                select.append('<option value="' + value + '">' + value + '</option>');
            });
        }
    
        function createDropdownFilterWithLink(dataTable, columnIndex, headerIndex, placeholder) {
            var column = dataTable.column(columnIndex);
            var select = $('<select class="form-control form-control-sm"><option value="">' + placeholder + '</option></select>')
                .appendTo($('#searchRow th[aria-colindex="' + (headerIndex + 1) + '"]'))
                .on('change', function() {
                    var val = $.fn.dataTable.util.escapeRegex($(this).val());
                    column.search(val ? '^' + val + '$' : '^$', true, false).draw();
                });
    
            var uniqueValues = new Set();
            column.data().each(function(data) {
                var text = $("<div>").html(data).text();
                uniqueValues.add(text.trim());
            });
    
            Array.from(uniqueValues).sort().forEach(function(value) {
                select.append('<option value="' + value + '">' + value + '</option>');
            });
        }
    
        function initializeFilters(dataTable) {
            removeExistingFilters();
    
            $('#headersLabels th').each(function() {
                var colIndex = $(this).attr('aria-colindex');
                if (colIndex) {
                    colIndex = parseInt(colIndex, 10) - 1;
    
                    if (isColumnVisible(dataTable, colIndex)) {
                        switch (colIndex) {
                            case 2:
                                createDropdownFilter(dataTable, colIndex, colIndex, 'Select Testing Purpose');
                                break;
                            case 4:
                                createDropdownFilterWithComma(dataTable, colIndex, colIndex, 'Select QL');
                                break;
                            case 5:
                                createDropdownFilterWithComma(dataTable, colIndex, colIndex, 'Select Labels');
                                break;
                            case 6:
                                createDropdownFilter(dataTable, colIndex, colIndex, 'Select Framework');
                                break;
                            case 7:
                                createDropdownFilter(dataTable, colIndex, colIndex, 'Select Folder');
                                break;
                            case 8:
                                createDropdownFilterWithLink(dataTable, colIndex, colIndex, 'Select Epic');
                                break;
                            case 9:
                                createDropdownFilter(dataTable, colIndex, colIndex, 'Select Failure');
                                break;
                            case 10:
                                createDropdownFilter(dataTable, colIndex, colIndex, 'Select Status');
                                break;
                            case 11:
                                createDropdownFilter(dataTable, colIndex, colIndex, 'Select OBJ');
                                break;
                            case 12:
                                createDropdownFilter(dataTable, colIndex, colIndex, 'Select Type');
                                break;
                            case 13:
                                createDropdownFilterWithComma(dataTable, colIndex, colIndex, 'Select Product');
                                break;
                            case 14:
                                createDropdownFilterWithComma(dataTable, colIndex, colIndex, 'Select OTS');
                                break;
                            case 15:
                                createDropdownFilter(dataTable, colIndex, colIndex, 'Select Status');
                                break;
                            case 16:
                                createDropdownFilter(dataTable, colIndex, colIndex, 'Select Process');
                                break;
                            case 17:
                                createDropdownFilter(dataTable, colIndex, colIndex, 'Select Integration');
                                break;
                            case 18:
                                createDropdownFilter(dataTable, colIndex, colIndex, 'Select State');
                                break;
                            case 19:
                                createDropdownFilter(dataTable, colIndex, colIndex, 'Select Technique');
                                break;
                            case 20:
                                createDropdownFilter(dataTable, colIndex, colIndex, 'Select Deployment');
                                break;
                            case 21:
                                createDropdownFilterWithComma(dataTable, colIndex, colIndex, 'Select Component');
                                break;
                            case 22:
                                createDropdownFilter(dataTable, colIndex, colIndex, 'Select Type');
                                break;
                            case 23:
                                createDropdownFilter(dataTable, colIndex, colIndex, 'Select Complexity');
                                break;
                            default:
                                break;
                        }
                    }
                }
            });
        }    

        // Customize DataTable classes for Bootstrap
        // $('#data-table').addClass('table-hover');
        $('.dataTables_length').addClass('bs-select');

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
                $('#filterResults').text('Filter: None');
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
                $('#filterResults').text('Filter: None');
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
            dataTable.order([]).draw(); // Clears sorting and redraws the table
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

    // Fetch status name from the cache
    function fetchStatusName(status, index) {
        var statusName = '';
        $.each(statusesCache.values, function (idx, statusItem) {
            if (statusItem.id === status.id) {
                statusName = statusItem.name;
                return false; // Exit the loop once found
            }
        });

        // Update the table row with the folder name
        $("#status-" + index).text(statusName || "Status not found");
    }

    // Update badge based on Filtered (Main/Precondition/Reset)
    // Set default text for filterResults
    $('#filterResults').text('Filter: None');
    $('.filter-btn').on('click', function () {
        // Change the text of the filterResults element
        $('#filterResults').text('Filter: ' + $(this).data('filter'));
    });
    
});