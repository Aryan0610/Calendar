let monthNav = 0
let selectedDayInt = 0 
let eventDay = 0
const calendar = document.getElementById('days')

let seletedDayDiv = 0

const weekdays = ['Monday', 'Tuesday', 'Wendnesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

//loads the calendar grid
function load() {
    const date = new Date()

    if(monthNav !== 0) {
        date.setMonth(new Date().getMonth()+monthNav)
    }

    let month = date.getMonth()
    let year = date.getFullYear()

    const firstDayOfTheMonth = new Date(year, month, 1)
    const daysInMonth = new Date(year, month+1, 0).getDate()

    const dateString = firstDayOfTheMonth.toLocaleDateString('en-uk', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    })

    const paddingDays = weekdays.indexOf(dateString.split(', ')[0])

    document.getElementById('month').innerText = 
    `${date.toLocaleDateString('en-uk', {month:'long'})}` 

    document.getElementById('year').innerText = 
    `${date.toLocaleDateString('en-uk', {year:'numeric'})}` 

    calendar.innerText = ''

    for(let i=1; i <= (paddingDays+daysInMonth); i++) {
        const dayString = `${i-paddingDays}/${month+1}/${year}`
        const daySquare = document.createElement('div')
        daySquare.classList.add('day')
        
        if(i>paddingDays) {
            daySquare.innerText = i-paddingDays

            if(i-paddingDays === date.getDate() && monthNav === 0) {
                daySquare.id = 'currentDay'
            }

            daySquare.addEventListener('click', ()=>
             selectedDay(i-paddingDays, dayString))
        } else {
            daySquare.classList.add('padding')
        }

        calendar.appendChild(daySquare)
    }
    eventsOfTheMonthFunc()
}

function selectedDay(selectedDayInt, dayString) {
    if(document.querySelector(".selectedDay")) {
        document.querySelector(".selectedDay").classList.remove('selectedDay')
    }

    let numberOfDaysNodes = document.querySelectorAll(".day")
    let numberOfDaysArray = Array.from(numberOfDaysNodes)

    for(i=0; i<numberOfDaysArray.length; i++){
        if(numberOfDaysArray[i].outerText == selectedDayInt) {
            numberOfDaysArray[i].classList.add('selectedDay')
        }   
    }

    eventDay = dayString
    //eventFunc(dayString)
}

//adds events to the event menu
function eventFunc(dayString) {
    const localStorageEvents = JSON.parse(localStorage.getItem('events'))
    let eventsForDay = []

    document.getElementById('eventHeader').innerText = 'Events'

    if(localStorageEvents != null) {
        for(i=0; i<localStorageEvents.length; i++) {
            if(localStorageEvents[i].date == dayString) {   
                eventsForDay.push(localStorageEvents[i])
            }
        }
    }

    const date = new Date()
    let day = date.getDate()
    let month = date.getMonth()+1
    let year = date.getFullYear()

    //if month changes
    if(monthNav != 0) {
        month = month + monthNav;
    }

    let currentDay = `${day}/${month}/${year}`

    let todaysEvent = []
    let upcomingEvents = []

    const existingEventDiv = document.querySelectorAll('.eventItem')
    for(i=0; i<existingEventDiv.length; i++) {
        existingEventDiv[i].remove()
    }

    //adds todays events to the array 
    if(localStorageEvents != null) {
        for(i=0; i<localStorageEvents.length; i++) {
            if(localStorageEvents[i].date == currentDay) {
                if(todaysEvent) {
                    todaysEvent.push({
                        date: localStorageEvents[i].date,
                        title: localStorageEvents[i].title
                    })
                } else {
                    todaysEvent = [{
                        date: localStorageEvents[i].date,
                        title: localStorageEvents[i].title
                    }]
                }
            }
        }
    }

    //adds today events into the from the array to the page
    for(i=0; i<todaysEvent.length; i++) {
        const todaysEventDIv = document.createElement('div')
        todaysEventDIv.classList.add('eventItem')
        document.getElementById('todaysEvent').appendChild(todaysEventDIv)

        const todaysEventDateDiv = document.createElement('div')
        todaysEventDateDiv.innerText = todaysEvent[i].date
        //todaysEventDIv.appendChild(todaysEventDateDiv)

        const todaysEventTitleDiv = document.createElement('div')
        todaysEventTitleDiv.innerText = todaysEvent[i].title
        todaysEventDIv.appendChild(todaysEventTitleDiv)

        const deleteEventBtn = document.createElement('button')
        //deleteEventBtn.innerText = 'delete'
        deleteEventBtn.classList.add('deleteBtn')
        let todaysEventInt = i
        deleteEventBtn.addEventListener('click', function() {
            removeEventBtn(todaysEvent[todaysEventInt].date, todaysEvent[todaysEventInt].title)
        })
        todaysEventDIv.appendChild(deleteEventBtn)
    }
    
    //adds upcoming events to the array
    let eventsOfTheMonth = eventsOfTheMonthFunc()
    
    for(i=0; i<eventsOfTheMonth.length; i++) {
        if(`${eventsOfTheMonth[i].day}/${eventsOfTheMonth[i].month}/${eventsOfTheMonth[i].year}` > currentDay) {
            let upcomingEventDate = `${eventsOfTheMonth[i].day}/${eventsOfTheMonth[i].month}/${eventsOfTheMonth[i].year}`
            let upcomingEventTitle
            for(j=0; j<localStorageEvents.length; j++) {
                if(localStorageEvents[j].date == `${eventsOfTheMonth[i].day}/${eventsOfTheMonth[i].month}/${eventsOfTheMonth[i].year}`) {
                    upcomingEventTitle = localStorageEvents[j].title
                }
            }

            upcomingEvents.push({
                date: upcomingEventDate,
                title: upcomingEventTitle
            })
        }
    }


    for(i=0; i<upcomingEvents.length; i++) {
        const upcomingEventDiv = document.createElement('div')
        upcomingEventDiv.classList.add('eventItem')
        //upcomingEventDiv.innerText = upcomingEvents[i].title

        document.getElementById('upcomingEvents').appendChild(upcomingEventDiv)

        const upcomingEventDateDiv = document.createElement('div')
        upcomingEventDateDiv.innerText = upcomingEvents[i].date
        //upcomingEventDiv.appendChild(upcomingEventDateDiv)

        const upcomingEventTitleDiv = document.createElement('div')
        upcomingEventTitleDiv.innerText = upcomingEvents[i].title   
        upcomingEventDiv.appendChild(upcomingEventTitleDiv)

        const deleteEventBtn = document.createElement('button')
        //deleteEventBtn.innerText = 'delete'
        deleteEventBtn.classList.add('deleteBtn')
        let upcomingEventInt = i
        deleteEventBtn.addEventListener('click', function() {
            removeEventBtn(upcomingEvents[upcomingEventInt].date, upcomingEvents[upcomingEventInt].title)
        })
        upcomingEventDiv.appendChild(deleteEventBtn)
    }
}

//specifies which days of the month have events and returns an array with the events of the month
function eventsOfTheMonthFunc() {
    const localStorageEvents = JSON.parse(localStorage.getItem('events'))

    const dayOfTheMonth = document.querySelectorAll('.day')
    let eventsOfTheMonth = []

    const date = new Date()
    let month = date.getMonth()+1
    let year = date.getFullYear()

    //if month changes
    if(monthNav != 0) {
        month = month + monthNav;
    }

    //removing events from from the class name of the days
    for(i=0; i<dayOfTheMonth.length; i++) {
        if(dayOfTheMonth[i].classList.contains('eventOfTheMonth')) {
            dayOfTheMonth[i].classList.remove('eventOfTheMonth')
        }
    }

    //adding events in the class name of the days
    for(i=0; i<dayOfTheMonth.length; i++) {
        if(localStorageEvents != null) {
            for(j=0; j<localStorageEvents.length; j++) {
                if((`${dayOfTheMonth[i].innerText}/${month}/${year}`) === localStorageEvents[j].date) {
                    dayOfTheMonth[i].classList.add('eventOfTheMonth')
    
                    //adding events of the current month into the array
                    if(eventsOfTheMonth) {
                        eventsOfTheMonth.push({
                            day: dayOfTheMonth[i].innerText,
                            month: month,
                            year: year
                        })
                    } else {
                        eventsOfTheMonth = [{
                            day: dayOfTheMonth[i].innerText,
                            month: month,
                            year: year
                        }]
                    }
                }
            }
        }
    }  
    
    return eventsOfTheMonth
}

//adds events to the local storage
function addEventBtn() {
    let localStorageEvents = JSON.parse(localStorage.getItem('events'))
    
    if(localStorageEvents) {
        localStorageEvents.push({
            date: eventDay,
            title: document.getElementById('addEventInput').value
        })
    } else {
        localStorageEvents = [{
            date: eventDay,
            title: document.getElementById('addEventInput').value
        }]
    }

    localStorage.setItem('events', JSON.stringify(localStorageEvents))
    document.getElementById('addEventInput').value = ''
}

function removeEventBtn(date, title) {
    let localStorageEvents = JSON.parse(localStorage.getItem('events'))

    eventToBeDeltedDate = date
    eventToBeDeltedTitle = title

    for(i=0; i<localStorageEvents.length; i++) {
        if(localStorageEvents[i].date == eventToBeDeltedDate 
            && localStorageEvents[i].title == eventToBeDeltedTitle) {
                localStorageEvents.splice(i, 1)
                localStorage.setItem('events', JSON.stringify(localStorageEvents))
            }
    }
    eventFunc(eventDay)
}

//initializes the buttons
function initButtons() {
    document.getElementById('nextBtn').addEventListener('click', ()=> {
        monthNav++;
        load()
    })

    document.getElementById('backBtn').addEventListener('click', ()=> {
        monthNav--;
        load()
    })

    document.getElementById('addEventBtn').addEventListener('click', ()=> {
        addEventBtn()
        eventFunc(eventDay)
    })
}

//initial Date
function initDate() {
    const date = new Date()
    const dt = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    eventDay = `${dt}/${month+1}/${year}`
    selectedDay(dt, eventDay)
}

load()
eventFunc(eventDay)
initButtons()
initDate()
