$(document).ready(function () {
    // Call the function to populate categories when the document is ready
    populateCategories();

    // Event listener for form submission to add a new game
    $("#addNewGameForm").submit(function (event) {
        event.preventDefault();

        // Collect form data
        var gameTitle = $("#gameTitle").val();
        var gameDescription = $("#gameDescription").val();
        var gameYear = parseInt($("#gameYear").val());
        var gamePrice = parseFloat($("#price").val());
        var categoryIds = $("input[name='categories']:checked").map(function () { return $(this).val(); }).get();

        console.log("Form data collected:", { gameTitle, gameDescription, gameYear, gamePrice, categoryIds });

        // Validate form data
        if (!gameTitle || !gameDescription || isNaN(gameYear) || gameYear < 0 || gameYear > new Date().getFullYear()) {
            alert("Please fill in all required fields with valid values.");
            return;
        }

        if (isNaN(gamePrice) || gamePrice <= 0) {
            alert("Please enter a valid price greater than 0.");
            return;
        }

        // Check if category checkboxes exist on the page
        var categoryCheckboxes = $("input[name='categories']");
        if (categoryCheckboxes.length === 0) {
            alert("No categories available. Please add a category first.");
            return;
        }

        if (categoryIds.length === 0) {
            alert("Please select at least one category.");
            return;
        }

        // Create FormData object for file upload (if image is selected)
        var formData = new FormData();
        formData.append("title", gameTitle);
        formData.append("description", gameDescription);
        formData.append("year", gameYear);
        formData.append("price", gamePrice);
        
        // Append each categoryId separately so backend receives an array
        categoryIds.forEach(function(categoryId) {
            formData.append("categoryIds", categoryId);
        });

        var fileInput = $("#gameImage")[0];
        if (fileInput.files.length > 0) {
            var gameImage = fileInput.files[0];
            formData.append("game_pic_url", gameImage);
        }

        console.log("FormData prepared for submission");

        // Make AJAX request to create a new game
        $.ajax({
            url: "/games",
            method: "POST",
            processData: false,
            contentType: false,
            data: formData,
            headers: {
                Authorization: "Bearer " + localStorage.getItem('jwt')
            },
            success: function (response) {
                console.log("Game created successfully:", response);
                alert("Game created successfully.");
                location.reload();
            },
            error: function (error) {
                console.error("Error creating game:", error);
                var errorMessage = "An error occurred. Please try again.";
                try {
                    var errorData = JSON.parse(error.responseText);
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    } else if (errorData.errorCode === "INVALID_IMAGE") {
                        errorMessage = "Invalid image. Please upload a valid image.";
                    }
                } catch (e) {
                    // Use default error message
                }
                alert(errorMessage);
            }
        });
    });

    // Function to create a category checkbox
    function createCategoryCheckbox(category) {
        var container = $('<div class="form-check"></div>');
        var checkbox = $('<input type="checkbox" class="form-check-input" value="' + category.catid + '" name="categories">');
        var label = $('<label class="form-check-label">' + category.catname + '</label>');
        container.append(checkbox);
        container.append(label);
        return container;
    }

    // Function to populate categories
    function populateCategories() {
        // Fetch categories
        $.ajax({
            url: '/category',
            method: 'GET',
            headers: {
                Authorization: "Bearer " + localStorage.getItem('jwt')
            }
        }).done(function (categories) {
            console.log("Fetched categories:", categories);
            var categoryList = $('#categoryList');
            categoryList.empty();
            if (categories && categories.length > 0) {
                categories.forEach(function (category) {
                    var categoryCheckbox = createCategoryCheckbox(category);
                    categoryList.append(categoryCheckbox);
                });
            } else {
                categoryList.append($('<p class="text-muted">No categories available. Please add a category first.</p>'));
            }
        }).fail(function (error) {
            console.error("Error fetching categories:", error);
            $('#categoryList').html('<p class="text-danger">Error loading categories.</p>');
        });
    }

    // Event listener for form submission to add a new category
    $("#addNewCategoryForm").submit(function (event) {
        event.preventDefault();

        var categoryName = $("#categoryName").val();
        var categoryDescription = $("#categoryDescription").val() || '';

        if (!categoryName || !categoryName.trim()) {
            alert("Category name is required.");
            return;
        }

        var categoryData = {
            catname: categoryName.trim(),
            description: categoryDescription.trim()
        };

        $.ajax({
            url: "/category",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(categoryData),
            headers: {
                Authorization: "Bearer " + localStorage.getItem('jwt')
            },
            success: function (response) {
                console.log("Category created successfully:", response);
                alert("Category created successfully.");
                $("#addNewCategoryForm")[0].reset();
                populateCategories(); // Refresh category list
            },
            error: function (error) {
                console.error("Error creating category:", error);
                var errorMessage = "An error occurred. Please try again.";
                try {
                    var errorData = JSON.parse(error.responseText);
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    }
                } catch (e) {
                    // Use default error message
                }
                alert(errorMessage);
            }
        });
    });

    // Fetch user data to verify admin access
    $.ajax({
        url: "/user/self",
        method: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem('jwt')
        },
        success: function (response) {
            if (response.type === 'Admin') {
                document.getElementById('admin_panel_link').style.display = 'inline-block';
                document.getElementById('update_news_link').style.display = 'inline-block';
            } else {
                window.location.href = '/store';
            }
        },
        error: function (error) {
            console.error("Error fetching user data:", error);
            window.location.href = '/store';
        }
    });
});
