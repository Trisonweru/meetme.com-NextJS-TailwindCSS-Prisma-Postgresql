import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../lib/prisma';
//An API to help create a user when they sign up.

import { google } from 'googleapis';

const  CREDENTIALS=JSON.parse(process.env.CREDENTIALS)
const  calenderId=process.env.CALENDER_ID

const SCOPES ='https://www.googleapis.com/auth/calendar'
const calendar = google.calendar({ version : "v3"})

const auth= new google.auth.JWT(
  CREDENTIALS.client_email,
  null,
  CREDENTIALS.private_key,
  SCOPES
)

const TIMEOFFSET="+03:00"
const dateTimeForCalander = () => {

    let date = new Date();

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    let day = date.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    let hour = date.getHours();
    if (hour < 10) {
        hour = `0${hour}`;
    }
    let minute = date.getMinutes();
    if (minute < 10) {
        minute = `0${minute}`;
    }

    let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;

    let event = new Date(Date.parse(newDateTime));

    let startDate = event;
    // Delay in end time is 1
    let endDate = new Date(new Date(startDate).setHours(startDate.getHours()+1));

    return {
        'start': startDate,
        'end': endDate
    }
};
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  //Check if the request type if its post, if not we send status 405 with a message of method not aloowed.
  if (req.method != 'POST') {
    return res.status(405).json({ status: 405, message: 'Method Not Allowed' });
  }
  // if user, we create the user in the database using prisma create function.
  try {
    const { data, user, dt } = req.body;
    const attendee = await prisma?.attendee.create({
      data: data,
    });
    if (attendee) {
      const booking = await prisma?.booking.create({
        data: {
          attendeeId: attendee.id,
          eventId: user[0].events[0].id,
          dateTime: new Date(dt),
        },
      });

      let startDate = new Date(dt);
      let timeZone = "Africa/Nairobi";
      let duration = `00:${user[0].events[0].length}:00`;

      let msDuration = (Number(duration.split(':')[0]) * 60 * 60 + Number(duration.split(':')[1]) * 60  + Number(duration.split(':')[2])) * 1000;
      let endDate = new Date(startDate.getTime() + msDuration);
      let isoStartDate = new Date(startDate.getTime()-new Date().getTimezoneOffset()*60*1000).toISOString().split(".")[0];
      let isoEndDate = new Date(endDate.getTime()-(new Date().getTimezoneOffset())*60*1000).toISOString().split(".")[0];

      console.log(isoStartDate)
      console.log(isoEndDate)

      const insertEvent = async (event) => {
        try {
        let response = await calendar.events.insert({
            auth: auth,
            calendarId: calenderId,
            resource: event
        });
    
        if (response['status'] == 200 && response['statusText'] === 'OK') {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`Error at insertEvent --> ${error}`);
        return 0;
    }
    };
     let dateTime = dateTimeForCalander();
      
// Event for Google Calendar
    let event = {
        'summary': user[0].events[0].title,
        'description': user[0].events[0].description,
        'start': {
            'dateTime': isoStartDate,
            'timeZone': timeZone
        },
        'end': {
            'dateTime': isoEndDate,
            'timeZone': timeZone
        }
    };
    insertEvent(event)
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });
     
      return res.status(200).json(booking);
    }
  } catch (err: any) {
    //if any error during the creation proces we catch it and send the error message to the frontend.
    res.status(400).json({ status: 400, message: err.message });
  }
};








// // Get all the events between two dates
// const getEvents = async (dateTimeStart, dateTimeEnd) => {

//     try {
//         let response = await calendar.events.list({
//             auth: auth,
//             calendarId: calendarId,
//             timeMin: dateTimeStart,
//             timeMax: dateTimeEnd,
//             timeZone: 'Asia/Kolkata'
//         });
    
//         let items = response['data']['items'];
//         return items;
//     } catch (error) {
//         console.log(`Error at getEvents --> ${error}`);
//         return 0;
//     }
// };

// // let start = '2020-10-03T00:00:00.000Z';
// // let end = '2020-10-04T00:00:00.000Z';

// // getEvents(start, end)
// //     .then((res) => {
// //         console.log(res);
// //     })
// //     .catch((err) => {
// //         console.log(err);
// //     });

// // Delete an event from eventID
// const deleteEvent = async (eventId) => {

//     try {
//         let response = await calendar.events.delete({
//             auth: auth,
//             calendarId: calendarId,
//             eventId: eventId
//         });

//         if (response.data === '') {
//             return 1;
//         } else {
//             return 0;
//         }
//     } catch (error) {
//         console.log(`Error at deleteEvent --> ${error}`);
//         return 0;
//     }
// };

// let eventId = 'hkkdmeseuhhpagc862rfg6nvq4';

// deleteEvent(eventId)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });