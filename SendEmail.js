var EmpName, ManagerEmail, StartDate, EndDate, EmpID, Comments, LeaveType = '';

function getDetails() {
    EmpName = $("#Emp_Name").val();
    ManagerEmail = $("#ManagerEmail").val();
    StartDate = document.getElementsByName("StartDate")[0].value;
    EndDate = document.getElementsByName("EndDate")[0].value;
    EmpID = document.getElementsByName("Emp_ID")[0].value;
    Comments = document.getElementsByName("Comments")[0].value;
    LeaveType = $("input[type='radio'][name='LeaveType']:checked").val();
    fnCreateItem();
    processSendEmails();
}

function fnCreateItem() {
    var requestUriPOST = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('LeaveTracker')/items?";
    $.ajax({
        url: requestUriPOST,
        type: "POST",
        data: JSON.stringify({
            __metadata: {
                type: "SP.Data.LeaveTrackerListItem"
            },
            Title: EmpName,
            ManagerEmail: ManagerEmail,
            EmployeeID: EmpID,
            LeaveStartDate: StartDate,
            LeaveEndDate: EndDate,
            LeaveType: LeaveType,
            Comments: Comments
        }),
        headers: {
            "accept": "application/json;odata=verbose",
            "content-Type": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "X-HTTP-Method": "POST"
        },
        success: function(data) {
            console.log("Success");
        },
        error: function(error) {
            console.log(error.responseText);
        }
    });
}


function processSendEmails() {
    var from = 'AdminPortal@contoso.com',
        to = [ManagerEmail],
        cc = [_spPageContextInfo.userEmail],
        body = "<p><strong>Leave Type : </strong>" + LeaveType + "</p><p><strong>Leave Start Date : </strong>" + StartDate + "</p><p><strong>Leave End Date : </strong>" + EndDate + "</p><p><strong>Comments : </strong>" + Comments + "</p><p>Thanks,<br/>" + EmpName + "</p>",
        subject = 'Leave Application for ' + EmpName;
    sendEmail(from, to, cc, body, subject);
}


function sendEmail(from, to, cc, body, subject) {
    var siteurl = _spPageContextInfo.webServerRelativeUrl;
    var urlTemplate = siteurl + "/_api/SP.Utilities.Utility.SendEmail";
    $.ajax({
        contentType: 'application/json',
        url: urlTemplate,
        type: "POST",
        data: JSON.stringify({
            'properties': {
                '__metadata': {
                    'type': 'SP.Utilities.EmailProperties'
                },
                'From': from,
                'To': {
                    'results': to
                },
                'CC': {
                    'results': cc
                },
                'Body': body,
                'Subject': subject
            }
        }),
        headers: {
            "Accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "X-RequestDigest": jQuery("#__REQUESTDIGEST").val()
        },
        success: function(data) {
            alert('Email has been sent to your Manager');
            document.location.href = _spPageContextInfo.webAbsoluteUrl;
        },
        error: function(err) {
            alert('Error in sending Email: ' + JSON.stringify(err));
        }
    });
}
