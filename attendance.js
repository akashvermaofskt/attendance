import axios from 'axios';
import qs from 'qs';
import moment from 'moment';
import { config } from "./config";

const { PUNCHES, EMPLOYEE_ID, ASPXAUTH, ASPNET_SESSION_ID, START_DATE, END_DATE, SKIP_DATE } = config;

const successMessage = "Attendance punch request has been added successfully."

const punchAttendance = (date) => {
    console.log("Date => ", date)
    const data = qs.stringify({
        'Action1': 'Assign',
        'AttendanceType': 'Requested',
        'AttendanceTypeValue': '2',
        'AttendenceDate': date,
        'JustifyAttendancePunchs': '',
        'Punches': PUNCHES,
        'Reason': '',
        'SelectedEmployeeId': EMPLOYEE_ID
    });

    const config = {
        method: 'post',
        url: 'https://lido.hrstop.com/Attendance/OnDutyAttendance',
        headers: {
            'Upgrade-Insecure-Requests': '1',
            'Origin': 'https://lido.hrstop.com',
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-User': '?1',
            'Sec-Fetch-Dest': 'document',
            'Cookie': `.ASPXAUTH=${ASPXAUTH}; ASP.NET_SessionId=${ASPNET_SESSION_ID}`
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            if (response.data.includes(successMessage)) {
                console.log("Success! ", date);
            } else {
                console.log("Failed! ", date);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

const getTime = (day, month, year) => (new Date(year, month - 1, day).getTime());

const startDate = new Date(START_DATE[2], START_DATE[1] - 1, START_DATE[0]);
const endDate = new Date(END_DATE[2], END_DATE[1] - 1, END_DATE[0]);
let currentDate = startDate;

const skipDate = SKIP_DATE.map((date) => {
    return getTime(date[0], date[1], date[2]);
})

const loop = (currentDate, endDate) => {
    if (currentDate.getTime() > endDate.getTime()) {
        return;
    }
    if (!(skipDate.includes(currentDate.getTime()))) {
        punchAttendance(moment(currentDate).format("MMM D, YYYY"))
    }
    currentDate.setDate(currentDate.getDate() + 1)
    loop(currentDate, endDate)
}

loop(currentDate, endDate)