$(function () {
    var username;
    var admin = $('#admin');
    // login select buttons
    var adminLogin = $('#adminLogin');
    var studentLogin = $('#studentLogin');
    // select user login buttons
    var adminBTN = $('#adminBTN');
    var studentBTN = $('#studentBTN');
    // for students
    var notifier = $('#notifier');
    var paidnotifier = $('#paidnotifier')
    // login buttons to redirect to another actions
    var studentbtnlogin = $('#studentbtnlogin');
    var adminbtnlogin = $('#adminbtnlogin')
    // for admin activity
    var adminActivity = $('#adminActivity');
    var url = "http://localhost:8080"
    var paid = false;
    var isStudent = false;

    var okbtn = $('#oktbn');

    $(adminLogin).hide();
    $(studentLogin).hide();
    $(adminActivity).hide();

    $(studentBTN).click(function () {
        $(adminLogin).hide();
        $(studentLogin).show();
    });

    // functions for admin activity
    $(adminBTN).click(function () {
        $(studentLogin).hide();
        $(adminLogin).show();
        isStudent = false;
    });
    $(adminbtnlogin).click(function (e) {
        Swal.fire(
            'Successfully login!',
            'Good job!',
            'success'
          )
        e.preventDefault();
        $(adminBTN).hide();
        $(studentBTN).hide();
        $(adminLogin).hide();
        $(studentLogin).hide();
        $(adminActivity).show();
        isStudent = false;
    });

    // functions for the student notifier
    $(studentbtnlogin).click(function (e) {
        Swal.fire(
            'Successfully login!',
            'Good job!',
            'success'
          ) 
        e.preventDefault();
        $.ajax({
            type: "post",
            crossDomain: true,
            url: `${url}/login`,
            data: { username: $("#user").val() },
            success: function (data) {
                console.log(data);
            }
        })
        $(adminBTN).hide();
        $(studentBTN).hide();
        $(adminLogin).hide();
        $(studentLogin).hide();
        $(notifier).show();
        isStudent = true;
    });

    $("#okbtn").click(function (e) {
        e.preventDefault();
        $(adminBTN).hide();
        $(studentBTN).hide();
        $(adminLogin).hide();
        $(studentLogin).hide();
        $(notifier).hide();

        window.setTimeout(function () {
            $(notifier).show();
        }, 3000)

    });

    var socket = io();
    $('#studentbtnlogin').click(function (e) {
        e.preventDefault();
        username = $("#user").val()
        socket.emit('online', { username: $("#user").val() })
    })

    var online = []
    socket.on('online', function (data) {
        $("#tbody").empty()
        console.log("data: ", data)
        data.forEach(element => {
            console.log("enter..", data)
            if (!online.includes(element.username)) {
                newOnline(element.username, element.text)
            }
        });
    })
    $("#tbody").on('click', 'button', function (event) {
        Swal.fire(
            'Successfully added!',
            'Good job!',
            'success'
          ) 
        let user = $(this).attr('name');
        let txt = $(this).text()
        if (txt == "Paid") {
            socket.emit('paid', { username: user })
        } else {
            Swal.fire(
                'Already paid!',
                'Nice one!',
                'success'
              ) 
        }
    });

    function newOnline(username, text) {
        
        let btn = "<button name='" + username + "'>" + text + "</button>"
        let row = "<tr><th scope='row'>" + username + "</th><td>" + btn + "</td></tr>"
        $("#tbody").append(row)
    }

    socket.on('payment', function (data) {
        newPayment(data.name, data.month)
        if (username == data.username) {
            $(notifier).hide()
            $("#paidnotifier").show()
        }

    })

    function newPayment(name, month) {
        let row = "<tr><td>" + name + "</td><td>" + month + "</td><td>500.00</td><td>Paid</td></tr>"
        $("#paymentBody").append(row)
    }
});