$(document).ready(function () {

    //FORM IMAGE UPLOAD -----------------------------------------
    $(document).on('change', 'input[type="file"]', function () {
        const $input = $(this);
        const isMultiple = $input.hasClass('multi-image-upload');
        const $previewContainer = $input.closest('.input-file-wrap').next('.preview-container');
        const files = this.files;

        // Clear existing previews
        $previewContainer.empty();

        if (isMultiple) {
            // Handle multiple image upload
            Array.from(files).forEach((file, index) => {
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const previewHtml = `
                            <div class="preview-item" data-index="${index}">
                                <img src="${e.target.result}" alt="Preview Image" />
                                <button type="button" class="close-btn">×</button>
                            </div>
                        `;
                        $previewContainer.append(previewHtml);
                    };
                    reader.readAsDataURL(file);
                }
            });
        } else {
            // Handle single image upload
            const file = files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const previewHtml = `
                        <div class="preview-item">
                            <img src="${e.target.result}" alt="Preview Image" />
                            <button type="button" class="close-btn">×</button>
                        </div>
                    `;
                    $previewContainer.append(previewHtml);
                };
                reader.readAsDataURL(file);
            }
        }
    });

    // Handle remove button click
    $(document).on('click', '.close-btn', function () {
        const $previewItem = $(this).closest('.preview-item');
        const $previewContainer = $previewItem.closest('.preview-container');
        const $fileInput = $previewContainer.prev('.input-file-wrap').find('input[type="file"]');
        const isMultiple = $fileInput.hasClass('multi-image-upload');

        if (isMultiple) {
            // Handle removal for multiple images
            const indexToRemove = $previewItem.data('index');
            const dataTransfer = new DataTransfer();
            const files = $fileInput[0].files;

            Array.from(files).forEach((file, index) => {
                if (index !== indexToRemove) {
                    dataTransfer.items.add(file);
                }
            });

            $fileInput[0].files = dataTransfer.files;
        } else {
            // Handle removal for single image
            $fileInput.val(''); // Clear the file input
        }

        // Remove the preview item
        $previewItem.remove();
    });

    // REPEAT INPUT -----------------------------------------
    const rowCount = {};

    // Handle the "Add" button click
    $(document).on('click', '.add-row-btn', function () {
        const targetClass = $(this).data('target'); // Get the target class
        const $lastRow = $(`.${targetClass}`).last(); // Find the last row of the target class
        const $newRow = $lastRow.clone(); // Clone the row

        // Initialize or increment the row count for this group
        if (!rowCount[targetClass]) {
            rowCount[targetClass] = $lastRow.data('group-index') || 1;
        }
        rowCount[targetClass]++;

        // Update attributes in the cloned row
        $newRow.attr('data-group-index', rowCount[targetClass]);

        // Update input and select names
        $newRow.find('input, select').each(function () {
            const name = $(this).attr('name');
            if (name) {
                // Extract the first two words of the name
                const baseName = name.split('-').slice(0, 2).join('-'); // Take the first two parts
                $(this).attr('name', `${baseName}-${rowCount[targetClass]}`); // Append the new index
            }
            $(this).val(''); // Clear the value
        });

        // Append the new row after the last row in the group
        $lastRow.after($newRow);
    });

    

    // POPUP IMAGE ---------------------------------------
    $('.popup-image').magnificPopup({
        type: 'image',
        gallery: {
            enabled: false // Enable gallery mode
        },
        zoom: {
            enabled: true, // Enable zoom animation
            duration: 200 // Duration of the zoom animation in ms
        }
    });

    $('.popup-image-gallery').magnificPopup({
        type: 'image',
        gallery: {
            enabled: true // Enable gallery mode
        },
        zoom: {
            enabled: true, // Enable zoom animation
            duration: 200 // Duration of the zoom animation in ms
        }
    });

    // Table action buttons handling
    var actionButtonClass = '.action-btn-handeler';
    var moreActionsClass = '.more-action-btns';
    var hiddenClass = 'hidden';

    $(actionButtonClass).on('click', function (e) {
        e.stopPropagation();
        var actions = $(this).closest('.action-td').find(moreActionsClass);
        $(moreActionsClass).not(actions).addClass(hiddenClass);
        actions.toggleClass(hiddenClass);
    });

    $(document).on('click', function () {
        $(moreActionsClass).addClass(hiddenClass);
    });

    $(moreActionsClass).on('click', function (e) {
        e.stopPropagation();
    });

    // Toggle password visibility
    $('#togglePassword').on('click', function (event) {
        event.preventDefault();
        var passwordField = $('#password');
        var eyeIcon = $('#eyeIcon');
        var type = passwordField.attr('type');

        if (type === 'password') {
            passwordField.attr('type', 'text');
            eyeIcon.attr('src', 'images/show.png'); // Show icon
        } else {
            passwordField.attr('type', 'password');
            eyeIcon.attr('src', 'images/hide.png'); // Hide icon
        }
    });

    // Click to copy text functionality
    $('.copyButton').on('click', function () {
        var copyText = $(this).siblings('.copyText');
        var tempInput = $('<input>');
        $('body').append(tempInput);

        tempInput.val(copyText.val()).select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
        tempInput.remove();

        // Show the custom message for copy success
        var customMessage = copyText.attr('data-message');
        $('.copy-status').text(customMessage);

        // Display and hide the copy success message
        $('.copy-message').fadeIn().delay(1000).fadeOut();
    });

    // Show back to top button
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 200) {
            $('.backtotop-wrapper').fadeIn();
        } else {
            $('.backtotop-wrapper').fadeOut();
        }
    });

    // Scroll to top functionality
    $('.backtotop-wrapper').on('click', function () {
        $('html, body').animate({
            scrollTop: 0
        }, 500);
        return false;
    });

});
