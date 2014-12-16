jQuery(document).ready(function() {
    var OS = null;
    var device_type = null;
    var os_type = null;
    var browser_type = null;
    var site_url = null;

    var os = null;
    var os_version = null;
    var browser = null;
    var browser_version = null
    var zoom_to_fit = true;
    var full_screen = true;
    var autofit = true;
    var url = true;
    var device = null;

    function setTestingParams(dt) {
        jQuery.each(OSBrowserObj[device_type], function(i, val) {
            if (val.hasOwnProperty('os_display_name')) {
                if (val['os_display_name'] == os_type) {
                    os = encodeURI(val['os']);
                    os_version = encodeURI(val['os_version']);
                    jQuery.each(val[dt], function(k, b) {
                        if (dt == "browsers") {
                            if (b.hasOwnProperty('display_name')) {
                                if (b['display_name'] == browser_type) {
                                    browser = encodeURIComponent(b['browser']).replace(/%20/g, "+");
                                    browser_version = encodeURIComponent(b['browser_version']).replace(/%20/g, "+");
                                }
                            }
                        } else {
                            if (b.hasOwnProperty('display_name')) {
                                if (b['display_name'] == browser_type) {
                                    device = encodeURIComponent(b['device']).replace(/%20/g, "+");
                                    os_version = encodeURIComponent(b['os_version']).replace(/%20/g, "+");
                                }
                            }
                        }
                    });
                }
            }
        });
    }

    $("#test_desktop").click(function(e) {
        os_type = $("#dropdownMenu1").text();
        browser_type = $("#dropdownMenu2").text();
        site_url = $("#desktop_url").val();
        if (site_url == "") {
            site_url = "http://www.google.com"
        }
        url = encodeURIComponent(site_url).replace(/%20/g, "+");
        setTestingParams("browsers");
        chrome.tabs.create({
            url: "http://www.browserstack.com/start#os=" + os + "&os_version=" + os_version + "&browser=" + browser + "&browser_version=" + browser_version + "&zoom_to_fit=" + zoom_to_fit + "&full_screen=" + full_screen + "&autofit=" + autofit + "&url=" + url + "&resolution=2048x1536&speed=2&start=true"
        });
    });

    $("#test_mobile").click(function(e) {
        os_type = $("#dropdownMenu3").text();
        browser_type = $("#dropdownMenu4").text();
        site_url = $("#mobile_url").val();
        if (site_url == "") {
            site_url = "http://www.google.com"
        }
        url = encodeURIComponent(site_url).replace(/%20/g, "+");
        setTestingParams("devices");
        chrome.tabs.create({
            url: "http://www.browserstack.com/start#os=" + os + "&os_version=" + os_version + "&device=" + device + "+&zoom_to_fit=true&full_screen=true&url=" + url + "&speed=1&start=true"
        });
    });



    $("#menu1").on('click', 'li a', function() {
        $("#dropdownMenu1:first-child").text($(this).text());
        $("#dropdownMenu1:first-child").val($(this).text());

    });

    $("#menu2").on('click', 'li a', function() {
        $("#dropdownMenu2:first-child").text($(this).text());
        $("#dropdownMenu2:first-child").val($(this).text());
    });

    $("#menu3").on('click', 'li a', function() {
        $("#dropdownMenu3:first-child").text($(this).text());
        $("#dropdownMenu3:first-child").val($(this).text());

    });

    $("#menu4").on('click', 'li a', function() {
        $("#dropdownMenu4:first-child").text($(this).text());
        $("#dropdownMenu4:first-child").val($(this).text());
    });


    var OSBrowserObj = {};

    function ajax_test(callback) {
        $.ajax({
            url: "http://www.browserstack.com/list-of-browsers-and-platforms.json?product=live",
            type: 'GET',
            dataType: 'json',

            success: function(data) {
                OSBrowserObj = data;
                callback();
            }
        });
    }

    function SetBrowsersNames(os_name) {
        var dt = null;
        var browser_menu = null;
        if (device_type == "desktop") {
            browser_menu = $('#menu2');
            dt = "browsers";
        } else {
            browser_menu = $('#menu4');
            dt = "devices";
        }

        browser_menu.empty();
        jQuery.each(OSBrowserObj[device_type], function(i, val) {
            if (val.hasOwnProperty('os_display_name')) {
                if (val['os_display_name'] == os_name) {
                    jQuery.each(val[dt], function(k, b) {
                        browser_menu.append('<li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="browser">' + b['display_name'] + '</a></li>');

                    });
                }
            }
        });

        $(".browser").click(function(e) {
            os_clicked = $(this).text();
            e.preventDefault();
        });
    }

    function SetOSNames() {
        var os_menu = null;
        if (device_type == "desktop") {
            os_menu = $('#menu1');

        } else {
            os_menu = $('#menu3');

        }
        os_menu.empty();
        jQuery.each(OSBrowserObj[device_type], function(i, val) {
            if (val.hasOwnProperty('os_display_name')) {
                os_menu.append('<li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="os">' + val['os_display_name'] + '</a></li>');
            }

        });

        $(".os").click(function(e) {
            os_clicked = $(this).text();
            if (device_type == "desktop") {
                $('#menu2').empty();
                $("#dropdownMenu2:first-child").text("--Select--");
                $("#dropdownMenu2:first-child").val("--Select--");
            } else {
                $('#menu4').empty();
                $("#dropdownMenu4:first-child").text("--Select--");
                $("#dropdownMenu4:first-child").val("--Select--");
            }
            SetBrowsersNames(os_clicked);
            e.preventDefault();
        });
    }

    ajax_test(function() {
        device_type = "desktop";
        SetOSNames();
    });

    $("#device_desktop").click(function(e) {
        device_type = "desktop";
        SetOSNames();

    });

    $("#device_mobile").click(function(e) {
        device_type = "mobile";
        SetOSNames();
    });
});