// Define your connection token, database name, and relation name
const connToken = "90932143|-31949220476295259|90963752";
const jpdbBaseURL = "http://api.login2explore.com:5577";
const stuDBName = "SCHOOL_DB";
const stuRelationName = "STUDENT_COLLECTION";

// Function to validate form data and return it as JSON
function validateAndGetFormData() {
    var stuIdVar = $("#stuId").val();
    if (stuIdVar === "") {
        alert("Student Roll-No Required Value");
        $("#stuId").focus();
        return "";
    }
    var stuNameVar = $("#stuName").val();
    if (stuNameVar === "") {
        alert("Student Name is Required Value");
        $("#stuName").focus();
        return "";
    }
    var stuClassVar = $("#stuClass").val();
    if (stuClassVar === "") {
        alert("Student Class is Required Value");
        $("#stuClass").focus();
        return "";
    }
    var stuDOBVar = $("#stuDOB").val();
    if (stuDOBVar === "") {
        alert("Student Birth-Date is Required Value");
        $("#stuDOB").focus();
        return "";
    }
    var stuAddressVar = $("#stuAddress").val();
    if (stuAddressVar === "") {
        alert("Student Address is Required Value");
        $("#stuAddress").focus();
        return "";
    }
    var stuEnrollDateVar = $("#stuEnrollDate").val();
    if (stuEnrollDateVar === "") {
        alert("Student Enrollment-Date is Required Value");
        $("#stuEnrollDate").focus();
        return "";
    }

    var jsonStrObj = {
        Roll_No: stuIdVar,
        Full_Name: stuNameVar,
        Class: stuClassVar,
        Birth_Date: stuDOBVar,
        Address: stuAddressVar,
        Enrollment_Date: stuEnrollDateVar
    };
    return JSON.stringify(jsonStrObj);
}

// Function to save data with a PUT request
function saveData() {
    var jsonStr = validateAndGetFormData();
    if (jsonStr === "") {
        return;
    }
    
    var putReqStr = createPUTRequest(
        connToken,
        jsonStr,
        stuDBName,
        stuRelationName
    );

    console.log("PUT Request String:", putReqStr);

    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(
        putReqStr,
        jpdbBaseURL,
        "/api/iml"  // API URL for PUT request
    );
    jQuery.ajaxSetup({ async: true });

    console.log("Result Object:", resultObj);

    if (resultObj.status === 200) {
        alert("Data saved successfully.");
    } else {
        alert("Error saving data: " + resultObj.message);
    }

    resetForm();
}

// Function to create a GET request based on student ID
function getStu() {
    var stuIdJsonObj = getStuIdAsJsonObj(); // Ensure this function is defined and returns the right JSON format
    var getRequest = createGET_BY_KEYRequest(
        connToken,
        stuDBName,
        stuRelationName,
        stuIdJsonObj
    );

    console.log("GET Request String:", getRequest);

    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(
        getRequest,
        jpdbBaseURL,
        "/api/irl"  // API URL for GET request
    );
    jQuery.ajaxSetup({ async: true });

    console.log("Result Object:", resJsonObj);

    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#stuName").focus();
    } else if (resJsonObj.status === 200) {
        $("#stuId").prop("disabled", true);
        fillData(resJsonObj);  // Ensure this function is defined and processes the response
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#stuName").focus();
    }
}

// Function to reset the form fields
function resetForm() {
    $("#stuId").val("");
    $("#stuName").val("");
    $("#stuClass").val("");
    $("#stuDOB").val("");
    $("#stuAddress").val("");
    $("#stuEnrollDate").val("");
    $("#stuId").focus();
}

// Function to create a JSON object for student ID (used for GET request)
function getStuIdAsJsonObj() {
    var stuId = $("#stuId").val();
    var jsonStr = {
        Roll_No: stuId
    };
    return JSON.stringify(jsonStr);
}

// Function to fill data into form fields from GET response
function fillData(resJsonObj) {
    var data = resJsonObj.data;
    if (data !== "") {
        var student = JSON.parse(data);
        $("#stuId").val(student.Roll_No);
        $("#stuName").val(student.Full_Name);
        $("#stuClass").val(student.Class);
        $("#stuDOB").val(student.Birth_Date);
        $("#stuAddress").val(student.Address);
        $("#stuEnrollDate").val(student.Enrollment_Date);
    }
}
