$(function() {

    $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function($form, event) {
            // Prevent spam click and default submit behaviour
            $("#btnSubmit").attr("disabled", true);
            event.preventDefault();
            
            // get values from FORM
            var uuid = document.getElementById('uuidResult').innerHTML;
            var email = $("input#email").val();
            var password = $("input#adminpwd").val();
            var hostname = "daspanel.site";
            var userid = "1000";

            create_zip(uuid, email, password, hostname, userid);
        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

// When clicking on Full hide fail/success boxes
$('#name').focus(function() {
    $('#success').html('');
});

function create_zip(uuid, email, password, hostname, userid) {

    // loading a file and add it in a zip file
    JSZipUtils.getBinaryContent("https://raw.githubusercontent.com/daspanel/daspanel/master/docker-compose.yml", function (err, data) {
        if(err) {
            throw err; // or handle the error
        }
        var zip = new JSZip();
        zip.file(uuid + "/docker-compose.yml", data, {binary:true});
        zip.file(uuid + "/data/.keep", "");
        zip.file(uuid + "/daspanel.env", 
            "DASPANEL_SYS_UUID=" + uuid + "\n" +
            "DASPANEL_SYS_ADMIN=" + email + "\n" +
            "DASPANEL_SYS_PASSWORD=" + password + "\n" +
            "DASPANEL_SYS_HOST=" + hostname + "\n" +
            "DASPANEL_SYS_USERID=" + userid + "\n"
        );
        zip.generateAsync({type:"blob"}).then(function (blob) {
            saveAs(blob, "daspanel-" + uuid + ".zip");
        });
    });
}

