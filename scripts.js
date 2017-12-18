const LIMIT = 10; // Max number of Wikipedia results

// GUI - New search show/hide toggle
fClickSearch = function () {
    $("#searchIcon").click(function () {
        $("#searchIcon").css("display", "none"); // Hide search icon
        $("#searchIconLabel").css("display", "none"); // Hide search label
        $("#searchField").css("display", "flex"); // Show search field
        $("#searchVal").focus(); // Gain focus on search field
    });
}

// GUI - Reset search show/hide toggle
fClickResetSearch = function () {
    $("#closeSearchBox").click(function () {
        $("#searchField").css("display", "none"); // Hide search field
        $(".sub-icon").css("display", "none"); // Hide search field sub icons
        $("#searchResults").empty(); // Remove search results
        $("#searchVal").val(""); // Remove search input value
        $("#searchIcon").css("display", "inline-block"); // Show search icon
        $("#searchIconLabel").css("display", "block"); // Show search label
    });
}

// UX - Show/Hide search sub-icons while in search session
fSearchFieldKeyUp = function () {
    $("#searchVal").keyup(function () {
        if ($("#searchVal").val() === "") {
            $(".sub-icon").css("display", "none");
        } else {
            $(".sub-icon").css("display", "inline-block");
        }
    });
}

// UX - Allow clearing search value & re-search while in search session
fClickClearSearch = function () {
    $("#clearSearchIcon").click(function () {
        $("#searchVal").val(""); // Remove search input value
        $("#searchVal").focus(); // Gain focus on search field
    });
}

// UX - Add tooltip to no-touch wide screen
fIsTouchDevice = function () {
        return 'ontouchstart' in window;
}

fAddTooltips = function () {
    // Case touch device - NO tooltips
    if (fIsTouchDevice()) {
        return;
    }

    // Case NO touch + Wide screen - ADD tooltips
    if($(document).width() > 768) {
        $("#closeSearchBox").attr({"data-toggle":"tooltip", "data-placement":"right", "title":"Reset search"});
        $("#clearSearchIcon").attr({"data-toggle":"tooltip", "data-placement":"bottom", "title":"Clear search"});
        $("#startSearchIcon").attr({"data-toggle":"tooltip", "data-placement":"bottom", "title":"New search"});
        $('[data-toggle="tooltip"]').tooltip();
    }
}

// FUNC - Get results wrapper
fSearchWiki = function () {
    $("#searchVal").blur(function () {
        if ($("#searchVal").val() !== "") {
            fGetResults();
        }
    });
}

// FUNC - Get results
fGetResults = function () {
    var wikiURL = "https://en.wikipedia.org/w/api.php";
    var searchVal = $("#searchVal").val();
    wikiURL += '?' + $.param({
            'action': 'opensearch',
            'search': searchVal,
            'prop': 'revisions',
            'rvprop': 'content',
            'format': 'json',
            'limit': LIMIT
        });

    $.ajax({
        url: wikiURL,
        dataType: 'jsonp',
        success: function (data) {
            fDisplayResults(data);
        }
    });
}

// FUNC - Display results
fDisplayResults = function (data) {
    var length = Math.min(data[1].length, data[2].length, data[3].length);
    var output = "";

    // Case NO results
    if (length == 0) {
        output = '<div class="d-flex justify-content-center align-items-center article-div no-results"><article><h1>No results found!</h1></article></div>';
    }
    // Case results
    else {
        for (var i = 0; i < length; i++) {
            var currArticle = '<a href=\"' + data[3][i] + '\" target=\"_blank\">';
            currArticle += '<div class="article-div">';
            currArticle += '<article><h1>' + data[1][i] + '</h1>';
            currArticle += '<p>' + data[2][i] + '</p>';
            currArticle += '</article></div></a>';
            output += currArticle;
        }
    }

    $("#searchResults").html(output);
}

// On document ready
$(document).ready(function () {
    fClickSearch(); // GUI - New search show/hide toggle
    fClickResetSearch(); // GUI - Reset search show/hide toggle

    fSearchFieldKeyUp(); // UX - Show/Hide search sub-icons while in search session
    fClickClearSearch(); // UX - Allow clearing search value & re-search while in search session
    fAddTooltips(); // UX - Add tooltips for no touch, wide-screen devices

    fSearchWiki(); // FUNC - Get Wikipedia results
});